// Xử lý ảnh phía client trước khi gửi lên Groq Vision API.
// Nén lại để giảm token & tránh vượt giới hạn 20MB của Groq.

const MAX_DIMENSION = 1024; // cạnh dài nhất sau khi resize
const JPEG_QUALITY = 0.8;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB — chặn từ đầu, Groq cho tối đa 20MB

export const isImageFile = (file) => !!file && file.type.startsWith("image/");

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Không đọc được file ảnh"));
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("File ảnh không hợp lệ"));
    img.src = src;
  });

/**
 * Đọc file ảnh, resize về tối đa 1024px và trả về data URL base64 (JPEG).
 * Nếu resize thất bại thì fallback về data URL gốc.
 */
export async function fileToDataUrl(file) {
  const original = await readAsDataUrl(file);

  try {
    const img = await loadImage(original);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
    if (scale === 1 && file.size < 500 * 1024) return original; // ảnh đã đủ nhỏ

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  } catch {
    return original;
  }
}
