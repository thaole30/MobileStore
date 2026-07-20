import React from "react";

// Icon SVG dùng chung cho chat widget — tự ăn màu chữ của phần tử cha.

// Khung ảnh (núi + mặt trời) — thể hiện rõ "đính kèm ảnh".
export const IconImage = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    focusable="false"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1.6" />
    <path d="M21 15.5l-4.5-4.5L6 21.5" />
  </svg>
);

// Robot nữ: ăng-ten, tóc hai bên, mắt tròn, miệng cười.
export const IconBot = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    focusable="false"
    {...props}
  >
    <path d="M12 5.5V4" />
    <circle cx="12" cy="2.8" r="1.1" fill="currentColor" stroke="none" />
    <rect x="5" y="5.5" width="14" height="13" rx="4.5" />
    <circle cx="3.2" cy="12" r="1.9" fill="currentColor" stroke="none" />
    <circle cx="20.8" cy="12" r="1.9" fill="currentColor" stroke="none" />
    <circle cx="9.5" cy="11.5" r="1.05" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="11.5" r="1.05" fill="currentColor" stroke="none" />
    <path d="M9.8 15c1.3.9 3.1.9 4.4 0" />
  </svg>
);
