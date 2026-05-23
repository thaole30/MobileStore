import React from "react";

export default function ChatMessage({ role, content, type, products, product, qty, onAddToCart, onConfirmCancel }) {
  const isUser = role === "user";

  if (type === "cart-confirm") {
    const displayPrice = product ? (product.price - product.sale).toLocaleString("vi-VN") : "";
    return (
      <div className="chat-message chat-message--bot">
        <div className="chat-message__avatar">🤖</div>
        <div className="chat-message__bubble chat-message__bubble--confirm">
          <p className="chat-confirm__text">
            Tìm thấy <strong>{product?.name}</strong> — {displayPrice}đ.<br />
            Bạn có muốn thêm {qty > 1 ? `x${qty} ` : ""}vào giỏ hàng không?
          </p>
          <div className="chat-confirm__actions">
            <button
              className="chat-confirm__btn chat-confirm__btn--yes"
              onClick={() => onAddToCart(product, qty)}
            >
              🛒 Thêm vào giỏ
            </button>
            <button
              className="chat-confirm__btn chat-confirm__btn--no"
              onClick={onConfirmCancel}
            >
              Không, cảm ơn
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (type === "product-options") {
    return (
      <div className="chat-message chat-message--bot">
        <div className="chat-message__avatar">🤖</div>
        <div className="chat-message__bubble chat-message__bubble--options">
          <p className="chat-product-options__label">{content}</p>
          {products.map((p) => (
            <div key={p.id} className="chat-product-option">
              <div className="chat-product-option__info">
                <span className="chat-product-option__name">{p.name}</span>
                <span className="chat-product-option__price">
                  {(p.price - p.sale).toLocaleString("vi-VN")}đ
                </span>
              </div>
              <button
                className="chat-product-option__btn"
                onClick={() => onAddToCart(p, qty)}
              >
                + Thêm
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-message ${isUser ? "chat-message--user" : "chat-message--bot"}`}>
      {!isUser && (
        <div className="chat-message__avatar">🤖</div>
      )}
      <div className="chat-message__bubble">{content}</div>
    </div>
  );
}
