import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatRegisterForm from "./ChatRegisterForm";

const SUGGESTED_QUESTIONS = [
  "Cho tôi xem điện thoại giá rẻ nhất",
  "Điện thoại nào đang hot nhất?",
  "Tôi cần tư vấn chọn máy",
];

export default function ChatWindow({ messages, loading, onSend, onClose, showRegisterForm, onRegisterSuccess, onRegisterCancel, onAddToCart, onConfirmCancel }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    onSend(text);
  };

  const handleSuggestion = (text) => {
    if (loading) return;
    onSend(text);
  };

  return (
    <div className="chat-window">
      <div className="chat-window__header">
        <div className="chat-window__title">
          <span className="chat-window__dot" />
          Trợ lý MobileStore
        </div>
        <button className="chat-window__close" onClick={onClose} aria-label="Đóng chat">✕</button>
      </div>

      <div className="chat-window__messages">
        {messages.length === 0 && (
          <div className="chat-window__welcome">
            <p>Xin chào! Tôi có thể giúp bạn tìm sản phẩm hoặc tư vấn mua hàng 😊</p>
            <div className="chat-window__suggestions">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button key={q} className="chat-suggestion" onClick={() => handleSuggestion(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            role={msg.role}
            content={msg.content}
            type={msg.type}
            products={msg.products}
            product={msg.product}
            qty={msg.qty}
            onAddToCart={onAddToCart}
            onConfirmCancel={onConfirmCancel}
          />
        ))}

        {loading && (
          <div className="chat-message chat-message--bot">
            <div className="chat-message__avatar">🤖</div>
            <div className="chat-message__bubble chat-message__bubble--loading">
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {showRegisterForm ? (
        <div className="chat-window__register-area">
          <ChatRegisterForm onSuccess={onRegisterSuccess} onCancel={onRegisterCancel} />
        </div>
      ) : (
        <form className="chat-window__input-area" onSubmit={handleSubmit}>
          <input
            className="chat-window__input"
            type="text"
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button
            className="chat-window__send"
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Gửi"
          >
            ➤
          </button>
        </form>
      )}
    </div>
  );
}
