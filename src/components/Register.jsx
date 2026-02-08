import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useRef, useState } from "react";
import { auth, db } from "../fireConfig";
import { toast } from "react-toastify";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export default function Register(props) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorEmail, setErrorEmail] = useState("*email field is required!");
  const [errorPass, setErrorPass] = useState(
    "*password must be at least 6 characters!"
  );
  const [errorConfirm, setErrorConfirm] = useState(
    "*password must be at least 6 characters!"
  );
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const confirmRef = useRef(null);

  const handleEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!value) setErrorEmail("Email field is required!");
    else if (reg.test(value) === false) {
      setErrorEmail("*email field is invalid!");
    } else setErrorEmail("");
  };
  const handlePassword = (e) => {
    const value = e.target.value;
    setPass(value);
    if (value.length > 5) setErrorPass("");
    else setErrorPass("*password must be at least 6 characters!");
  };
  const handleConfirm = (e) => {
    const value = e.target.value;
    setConfirm(value);
    if (value.length > 5) setErrorConfirm("");
    else setErrorConfirm("*password must be at least 6 characters!");
  };

  const checkError = () => {
    if (errorEmail) {
      emailRef.current.focus();
      return true;
    }
    if (errorPass) {
      passRef.current.focus();
      return true;
    }
    if (errorConfirm) {
      confirmRef.current.focus();
      return true;
    }
    if (pass !== confirm) {
      setErrorConfirm("*password and confirm password does not match!");
      confirmRef.current.focus();
      return true;
    }
    return false;
  };
  const addUserInfo = async () => {
    await addDoc(collection(db, "user"), {
      email, date: Timestamp.fromDate(new Date())
    });
    toast.success("Registration successfull!");
    props.hideRegister();
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (checkError()) {
      return props.setLoading(false)
    } 
    props.setLoading(true);
    await createUserWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        // Signed in
        addUserInfo();
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode == "auth/email-already-in-use") {
          props.setLoading(false);
          setErrorEmail("*email is already in use!");
          emailRef.current.focus();
        } else {
          toast.error("Registration failed");
          props.hideRegister();
        }
        // ..
      });
  };
  return (
    <div className="main-agileinfo">
      <div className="agileits-top">
        <form action="#" method="post">
          <input
            className="text email"
            ref={emailRef}
            type="email"
            name="email"
            placeholder="Email"
            required=""
            value={email}
            onChange={handleEmail}
          />
          <span className="err-mess">{errorEmail}</span>
          <input
            className="text"
            ref={passRef}
            type="password"
            name="password"
            placeholder="Password"
            required=""
            value={pass}
            onChange={handlePassword}
          />
          <span className="err-mess">{errorPass}</span>
          <input
            className="text w3lpass"
            ref={confirmRef}
            type="password"
            name="password"
            placeholder="Confirm Password"
            required=""
            value={confirm}
            onChange={handleConfirm}
          />
          <span className="err-mess">{errorConfirm}</span>
          <div className="wthree-text">
            <label className="anim">
              <input type="checkbox" className="checkbox" required="" />
              <span>I Agree To The Terms & Conditions</span>
            </label>
            <div className="clear"> </div>
          </div>
          <input type="submit" value="SIGNUP" onClick={handleSignup} />
        </form>
        {props.children}
      </div>
    </div>
  );
}
