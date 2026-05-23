import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { auth, db } from "../../fireConfig";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export default function ChatRegisterForm({ onSuccess, onCancel }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [confirmErr, setConfirmErr] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (v) => {
    if (!v) return "Email không được để trống!";
    if (!EMAIL_REGEX.test(v)) return "Email không hợp lệ!";
    return "";
  };

  const validatePass = (v) => {
    if (v.length < 6) return "Mật khẩu phải ít nhất 6 ký tự!";
    return "";
  };

  const validateConfirm = (v, p) => {
    if (v.length < 6) return "Mật khẩu phải ít nhất 6 ký tự!";
    if (v !== p) return "Mật khẩu xác nhận không khớp!";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eErr = validateEmail(email);
    const pErr = validatePass(pass);
    const cErr = validateConfirm(confirm, pass);
    setEmailErr(eErr);
    setPassErr(pErr);
    setConfirmErr(cErr);
    if (eErr || pErr || cErr) return;

    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = credential.user;

      await addDoc(collection(db, "user"), {
        email,
        date: Timestamp.fromDate(new Date()),
      });

      // set localStorage để user tiếp tục chat ở trạng thái đăng nhập
      localStorage.setItem("currentUser", JSON.stringify(user));
      onSuccess(user);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setEmailErr("Email này đã được sử dụng!");
      } else {
        setEmailErr("Đăng ký thất bại, vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="chat-register-form" onSubmit={handleSubmit} noValidate>
      <div className="chat-register-form__title">📝 Tạo tài khoản mới</div>

      <div className="chat-register-form__field">
        <label className="chat-register-form__label">Email</label>
        <input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailErr(validateEmail(e.target.value));
          }}
          disabled={loading}
          autoFocus
        />
        {emailErr && <span className="chat-register-form__err">{emailErr}</span>}
      </div>

      <div className="chat-register-form__field">
        <label className="chat-register-form__label">Mật khẩu</label>
        <input
          type="password"
          placeholder="Ít nhất 6 ký tự"
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
            setPassErr(validatePass(e.target.value));
          }}
          disabled={loading}
        />
        {passErr && <span className="chat-register-form__err">{passErr}</span>}
      </div>

      <div className="chat-register-form__field">
        <label className="chat-register-form__label">Xác nhận mật khẩu</label>
        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setConfirmErr(validateConfirm(e.target.value, pass));
          }}
          disabled={loading}
        />
        {confirmErr && <span className="chat-register-form__err">{confirmErr}</span>}
      </div>

      <div className="chat-register-form__actions">
        <button type="submit" className="chat-register-form__submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>
        <button
          type="button"
          className="chat-register-form__cancel"
          onClick={onCancel}
          disabled={loading}
        >
          Huỷ
        </button>
      </div>
    </form>
  );
}
