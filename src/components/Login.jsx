import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../fireConfig";
import "../stylesheets/login.css";
export default function Login(props) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [errorEmail, setErrorEmail] = useState("*Email field is required!");
  const [errorPass, setErrorPass] = useState(
    "*Password must be at least 6 characters!"
  );

  const emailRef = useRef(null);
  const passRef = useRef(null);

  const handleEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!value) setErrorEmail("*Email field is required!");
    else if (reg.test(value) === false) {
      setErrorEmail("*Email is invalid!");
    } else setErrorEmail("");
  };
  const handlePassword = (e) => {
    const value = e.target.value;
    setPass(value);
    if (value.length > 5) setErrorPass("");
    else setErrorPass("*Password must be at least 6 characters!");
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
    return false;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    props.setLoading(true);
    if (checkError()){
      return props.setLoading(false);
    } 
    await signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        localStorage.setItem("currentUser", JSON.stringify(user));
        toast.success("Login success!");
        props.hideLogin();
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(error);
        if (errorCode == "auth/user-not-found") {
          setErrorEmail("*Email not found!");
          emailRef.current.focus();
        } else if (errorCode == "auth/wrong-password") {
          setErrorPass("*Wrong password!");
          passRef.current.focus();
        } else {
          toast.error("Login failed");
          props.hideLogin();
        }
        props.setLoading(false);
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
            placeholder="Email"
            required=""
            value={email}
            onChange={handleEmail}
          />
          <span className="err-mess">{errorEmail}</span>
          <input
            className="text"
            type="password"
            ref={passRef}
            placeholder="Password"
            required=""
            value={pass}
            onChange={handlePassword}
          />
          <span className="err-mess">{errorPass}</span>
          <input type="submit" value="SIGN IN" onClick={handleSignIn} />
        </form>
        {props.children}
      </div>
    </div>
  );
}
