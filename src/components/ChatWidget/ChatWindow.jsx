import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatRegisterForm from "./ChatRegisterForm";
import { fileToDataUrl, isImageFile, MAX_FILE_SIZE } from "./imageUtils";
import { IconBot, IconImage } from "./Icons";

const SUGGESTED_QUESTIONS = [
  "Cho tôi xem điện thoại giá rẻ nhất",
  "Điện thoại nào đang hot nhất?",
  "Tôi cần tư vấn chọn máy",
];

export default function ChatWindow({ messages, loading, onSend, onClose, showRegisterForm, onRegisterSuccess, onRegisterCancel, onAddToCart, onConfirmCancel }) {
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null); // data URL base64 của ảnh đính kèm
  const [imageError, setImageError] = useState("");
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const pickImage = async (file) => {
    setImageError("");
    if (!isImageFile(file)) {
      setImageError("Vui lòng chọn file ảnh.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setImageError("Ảnh quá lớn (tối đa 10MB).");
      return;
    }
    try {
      setImage(await fileToDataUrl(file));
    } catch {
      setImageError("Không đọc được ảnh, thử ảnh khác nhé.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // cho phép chọn lại đúng file vừa xoá
    if (file) pickImage(file);
  };

  const handlePaste = (e) => {
    const file = [...(e.clipboardData?.files ?? [])][0];
    if (file) {
      e.preventDefault();
      pickImage(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImageError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if ((!text && !image) || loading) return;
    setInput("");
    clearImage();
    // gửi kèm ảnh thì luôn cần một câu hỏi mặc định cho model
    onSend(text || "Đây là ảnh gì? Cửa hàng có sản phẩm nào giống không?", image);
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
            image={msg.image}
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
            <div className="chat-message__avatar"><IconBot /></div>
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
          {image && (
            <div className="chat-attachment">
              <img src={image} alt="Ảnh đính kèm" className="chat-attachment__thumb" />
              <button
                type="button"
                className="chat-attachment__remove"
                onClick={clearImage}
                aria-label="Xoá ảnh đính kèm"
              >
                ✕
              </button>
            </div>
          )}

          {imageError && <p className="chat-attachment__error">{imageError}</p>}

          <div className="chat-window__input-row">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="chat-window__attach"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              aria-label="Đính kèm ảnh"
              title="Đính kèm ảnh"
            >
              <IconImage />
            </button>
            <input
              className="chat-window__input"
              type="text"
              placeholder={image ? "Hỏi gì về ảnh này?" : "Nhập tin nhắn..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPaste={handlePaste}
              disabled={loading}
              autoFocus
            />
            <button
              className="chat-window__send"
              type="submit"
              disabled={loading || (!input.trim() && !image)}
              aria-label="Gửi"
            >
              ➤
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
