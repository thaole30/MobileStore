import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../fireConfig";
import ChatWindow from "./ChatWindow";
import "./chatwidget.css";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";
const MAX_HISTORY = 10; // số tin nhắn gần nhất gửi kèm cho Groq

const REGISTER_KEYWORDS = [
  "đăng ký", "dang ky", "tạo tài khoản", "tao tai khoan",
  "register", "sign up", "create account", "mở tài khoản",
];

const isRegisterIntent = (text) =>
  REGISTER_KEYWORDS.some((kw) => text.toLowerCase().includes(kw));

const ADD_CART_KEYWORDS = [
  "thêm vào giỏ", "them vao gio", "thêm vào cart", "cho vào giỏ",
  "add to cart", "muốn mua", "cho tôi", "đặt mua", "thêm",
];

const isAddCartIntent = (text) =>
  ADD_CART_KEYWORDS.some((kw) => text.toLowerCase().includes(kw));

const extractQty = (text) => {
  // chỉ nhận qty khi số đi kèm đơn vị: "2 cái", "3 chiếc"...
  const match = text.match(/(\d+)\s*(cái|chiếc|sp|sản phẩm|máy)\b/);
  return match ? Math.max(1, parseInt(match[1])) : 1;
};

const NOISE_WORDS = [
  "tôi", "muốn", "cho", "cần", "mua", "một", "ngay", "giúp",
  "hãy", "nhé", "đi", "với", "được", "thì",
];

const extractProductQuery = (text) => {
  let q = text.toLowerCase();
  // xóa qty có đơn vị trước (VD: "2 cái") — KHÔNG xóa số đứng một mình
  q = q.replace(/\d+\s*(cái|chiếc|sp|sản phẩm|máy)\b/g, " ");
  // xóa cart keywords
  [...ADD_CART_KEYWORDS, "vào giỏ hàng", "vào giỏ", "vào cart"].forEach((kw) => {
    q = q.replace(kw, " ");
  });
  // xóa từ nhiễu tiếng Việt
  NOISE_WORDS.forEach((w) => {
    q = q.replace(new RegExp(`\\b${w}\\b`, "g"), " ");
  });
  return q.replace(/\s+/g, " ").trim();
};

const matchProducts = (query, products) => {
  if (!query) return [];
  // tách thành từng token, lọc rỗng
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  // sản phẩm hợp lệ khi tên chứa TẤT CẢ tokens (không cần liên tiếp)
  return products.filter((p) =>
    tokens.every((token) => p.name.toLowerCase().includes(token))
  );
};

function buildSystemPrompt(products, cartItems, user) {
  const productList = products
    .slice(0, 50)
    .map((p) => `- [ID:${p.id}] ${p.name} | Giá: ${Number(p.price).toLocaleString("vi-VN")}đ | Loại: ${p.category ?? "—"}`)
    .join("\n");

  const cartText =
    cartItems.length > 0
      ? cartItems
          .map((item) => `  + ${item.name} x${item.qty} (${Number(item.price).toLocaleString("vi-VN")}đ)`)
          .join("\n")
      : "  (Giỏ hàng trống)";

  const userName = user?.displayName || user?.email || null;
  const loginStatus = user ? `Khách hàng đã đăng nhập: ${userName}.` : "Khách hàng chưa đăng nhập.";

  return `Bạn là trợ lý bán hàng thân thiện của cửa hàng điện thoại MobileStore.
Luôn trả lời bằng tiếng Việt, ngắn gọn, rõ ràng và nhiệt tình.
Chỉ tư vấn về sản phẩm trong danh sách bên dưới. Nếu không có thông tin hãy nói thật thà.
Khi đề cập sản phẩm, hãy nêu tên và giá. Không bịa thêm thông tin ngoài danh sách.
${loginStatus}

QUAN TRỌNG — NHỮNG VIỆC BẠN KHÔNG ĐƯỢC LÀM:
- Không được tự nói "đăng ký thành công", "tài khoản đã tạo", hay bất kỳ xác nhận đăng ký/đăng nhập nào.
- Không được giả vờ thực hiện bất kỳ thao tác tài khoản nào (đăng ký, đăng nhập, đổi mật khẩu, thêm giỏ hàng, thêm yêu thích,...).
- Nếu khách hỏi về đăng ký, chỉ hướng dẫn: "Vui lòng gõ 'đăng ký' để mở form tạo tài khoản."
- Không hỏi email hoặc mật khẩu qua chat — thông tin nhạy cảm chỉ được nhập qua form bảo mật.
- Nếu khách muốn thêm sản phẩm vào giỏ, hãy hướng dẫn: "Bạn gõ 'thêm [tên sản phẩm] vào giỏ' để tôi xử lý nhé!"

DANH SÁCH SẢN PHẨM HIỆN CÓ:
${productList || "  (Chưa tải được danh sách sản phẩm)"}

GIỎ HÀNG HIỆN TẠI CỦA KHÁCH:
${cartText}`;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const productsRef = useRef(null);

  const cartItems = useSelector((state) => state.cartReducer.cartItems);
  const dispatch = useDispatch();

  const getProducts = async () => {
    if (productsRef.current) return productsRef.current;
    try {
      const snap = await getDocs(collection(db, "product"));
      const products = snap.docs.map((d) => ({
        id: d.id,
        name: d.data().name,
        price: d.data().price ?? 0,
        sale: d.data().sale ?? 0,
        img: d.data().img ?? "",
        category: d.data().category ?? "",
        sold: d.data().sold ?? 0,
      }));
      productsRef.current = products;
      return products;
    } catch {
      return [];
    }
  };

  const handleAddToCart = async (product, qty) => {
    dispatch({ type: "ADD_TO_CART", payload: { ...product, qty } });
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Đã thêm **${product.name}** (x${qty}) vào giỏ hàng 🛒`,
      },
    ]);
  };

  const handleRegisterSuccess = (user) => {
    setShowRegisterForm(false);
    const displayName = user.displayName || user.email;
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: `Đăng ký thành công! Chào mừng ${displayName} đến với MobileStore 🎉 Tôi có thể giúp gì cho bạn?` },
    ]);
  };

  const handleConfirmCancel = () => {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Không sao! Bạn cần thêm thông tin gì về sản phẩm không?" },
    ]);
  };

  const handleRegisterCancel = () => {
    setShowRegisterForm(false);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Không sao, bạn có thể đăng ký sau. Tôi có thể giúp gì cho bạn?" },
    ]);
  };

  const sendMessage = async (text) => {
    // Keyword detection: hiển thị form đăng ký ngay, không gọi Groq
    if (isRegisterIntent(text)) {
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setShowRegisterForm(true);
      return;
    }

    // Keyword detection: thêm vào giỏ hàng, không gọi Groq
    if (isAddCartIntent(text)) {
      const products = await getProducts();
      const qty = extractQty(text);
      const query = extractProductQuery(text);
      const matched = matchProducts(query, products);

      setMessages((prev) => [...prev, { role: "user", content: text }]);

      if (matched.length === 0) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Xin lỗi, tôi không tìm thấy sản phẩm nào khớp với "${query}". Bạn có thể mô tả rõ hơn không?` },
        ]);
      } else if (matched.length === 1) {
        const p = matched[0];
        const displayPrice = (p.price - p.sale).toLocaleString("vi-VN");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "cart-confirm",
            content: `Tìm thấy **${p.name}** — ${displayPrice}đ. Bạn có muốn thêm vào giỏ hàng không?`,
            product: p,
            qty,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "product-options", content: "Tìm thấy nhiều sản phẩm, bạn muốn thêm cái nào?", products: matched, qty },
        ]);
      }
      return;
    }

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const products = await getProducts();
      const user = JSON.parse(localStorage.getItem("currentUser") ?? "null");
      const systemPrompt = buildSystemPrompt(products, cartItems, user);

      // chỉ gửi MAX_HISTORY tin nhắn gần nhất để giảm tokens
      const history = newMessages.slice(-MAX_HISTORY);

      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: "system", content: systemPrompt }, ...history],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? "Xin lỗi, tôi không nhận được phản hồi. Vui lòng thử lại.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <ChatWindow
          messages={messages}
          loading={loading}
          onSend={sendMessage}
          onClose={() => setIsOpen(false)}
          showRegisterForm={showRegisterForm}
          onRegisterSuccess={handleRegisterSuccess}
          onRegisterCancel={handleRegisterCancel}
          onAddToCart={handleAddToCart}
          onConfirmCancel={handleConfirmCancel}
        />
      )}
      <button
        className="chat-launcher"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Đóng chat" : "Mở chat tư vấn"}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </>
  );
}
