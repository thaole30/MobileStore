import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../fireConfig";
import ChatWindow from "./ChatWindow";
import "./chatwidget.css";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-20b";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";
const MAX_HISTORY = 10;

const REGISTER_KEYWORDS = [
  "đăng ký", "dang ky", "tạo tài khoản", "tao tai khoan",
  "register", "sign up", "create account", "mở tài khoản",
];

const isRegisterIntent = (text) =>
  REGISTER_KEYWORDS.some((kw) => text.toLowerCase().includes(kw));

const ADD_CART_PATTERNS = [
  /(^|\s)(thêm|them|bỏ|bo|cho|lấy|lay|add)\s[\s\S]{0,40}?(vào|vao|to|into)?\s*(giỏ|gio|cart)/i,
  /(^|\s)(đặt mua|dat mua|chốt đơn|chot don|mua ngay|order)(\s|$)/i,
];

const isAddCartIntent = (text) =>
  ADD_CART_PATTERNS.some((re) => re.test(text));

const extractQty = (text) => {
  const match = text.match(/(\d+)\s*(cái|chiếc|sp|sản phẩm|máy)\b/);
  return match ? Math.max(1, parseInt(match[1])) : 1;
};

const CART_PHRASES = [
  "vào giỏ hàng", "vao gio hang", "vào giỏ", "vao gio",
  "vào cart", "vao cart", "giỏ hàng", "gio hang",
  "add to cart", "into cart", "to cart",
  "đặt mua", "dat mua", "chốt đơn", "chot don", "mua ngay",
];

const CART_VERBS = ["thêm", "them", "bỏ", "bo", "lấy", "lay", "add", "order"];

const NOISE_WORDS = [
  "tôi", "muốn", "cho", "cần", "mua", "một", "ngay", "giúp",
  "hãy", "nhé", "đi", "với", "được", "thì",
];

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const stripWords = (text, words) =>
  words.reduce(
    (acc, w) => acc.replace(new RegExp(`(^|\\s)${escapeRe(w)}(?=\\s|$)`, "g"), " "),
    text
  );

const extractProductQuery = (text) => {
  let q = text.toLowerCase();
  q = q.replace(/\d+\s*(cái|chiếc|sp|sản phẩm|máy)\b/g, " ");
  CART_PHRASES.forEach((kw) => {
    q = q.replace(new RegExp(escapeRe(kw), "g"), " ");
  });
  q = stripWords(q, CART_VERBS);
  q = stripWords(q, NOISE_WORDS);
  return q.replace(/\s+/g, " ").trim();
};

const matchProducts = (query, products) => {
  if (!query) return [];
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  return products.filter((p) =>
    tokens.every((token) => p.name.toLowerCase().includes(token))
  );
};

const stripReasoning = (text) => {
  const cleaned = text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<think>[\s\S]*$/i, "")
    .trim();
  return cleaned || text.trim();
};

const toGroqMessages = (msgs) =>
  msgs.map((m, i) => {
    const isLast = i === msgs.length - 1;
    if (!m.image) return { role: m.role, content: m.content };
    if (!isLast) return { role: m.role, content: `${m.content} [đã gửi kèm 1 ảnh]` };
    return {
      role: m.role,
      content: [
        { type: "text", text: m.content },
        { type: "image_url", image_url: { url: m.image } },
      ],
    };
  });

const toGeminiParts = (message) => {
  const parts = [];

  if (message.content) {
    parts.push({ text: message.content });
  }

  if (message.image) {
    const match = message.image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
    if (match) {
      parts.push({
        inline_data: {
          mime_type: match[1],
          data: match[2],
        },
      });
    }
  }

  return parts;
};

const toGeminiContents = (msgs) =>
  msgs.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: toGeminiParts(m),
  }));

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
- Không được tự nói "đăng ký thành công", "tài khoản đã tạo", "Đã thêm vào giỏ hàng" hay bất kỳ xác nhận đăng ký/đăng nhập nào.
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

  const sendMessage = async (text, image = null) => {
    if (!image && isRegisterIntent(text)) {
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setShowRegisterForm(true);
      return;
    }

    if (!image && isAddCartIntent(text)) {
      const products = await getProducts();
      const query = extractProductQuery(text);
      const matched = matchProducts(query, products);

      if (matched.length > 0) {
        const qty = extractQty(text);
        setMessages((prev) => [...prev, { role: "user", content: text }]);

        if (matched.length === 1) {
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
    }

    const newMessages = [
      ...messages,
      { role: "user", content: text, ...(image ? { image } : {}) },
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      const products = await getProducts();
      const user = JSON.parse(localStorage.getItem("currentUser") ?? "null");
      let systemPrompt = buildSystemPrompt(products, cartItems, user);

      if (image) {
        systemPrompt +=
          "\n\nKhách vừa gửi kèm một ảnh. Hãy quan sát ảnh, mô tả sản phẩm/điện thoại trong ảnh, " +
          "rồi đối chiếu với DANH SÁCH SẢN PHẨM ở trên. Nếu cửa hàng có sản phẩm giống hoặc tương tự, " +
          "hãy giới thiệu kèm giá. Nếu không có, nói thật là cửa hàng chưa có và gợi ý sản phẩm gần nhất.";
      }

      let reply = "";

      if (image) {
        const history = toGeminiContents(newMessages.slice(-MAX_HISTORY));
        const geminiBody = {
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: history,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        };

        const res = await fetch(`${GEMINI_API_URL}?key=${process.env.REACT_APP_GEMINI_API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(geminiBody),
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        const raw = data.candidates?.[0]?.content?.parts
          ?.map((part) => part.text)
          .filter(Boolean)
          .join("\n")
          ?.trim();

        reply = raw ? stripReasoning(raw) : "Xin lỗi, tôi không nhận được phản hồi. Vui lòng thử lại.";
      } else {
        const history = toGroqMessages(newMessages.slice(-MAX_HISTORY));
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
        const raw = data.choices?.[0]?.message?.content;
        reply = raw ? stripReasoning(raw) : "Xin lỗi, tôi không nhận được phản hồi. Vui lòng thử lại.";
      }

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
