import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export async function uploadImgCloud(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "sellphones");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/del0iskif/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url; // URL ảnh
}