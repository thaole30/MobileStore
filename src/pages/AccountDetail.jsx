import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "../stylesheets/accountdetail.css";
import AccountInfo from "../components/AccountInfo";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../fireConfig";
import { async } from "@firebase/util";
import { toast } from "react-toastify";

export default function AccountDetail() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [id, setId] = useState(null);
  const getUser = async () => {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    setEmail(user.email);
    const q = query(collection(db, "user"), where("email", "==", user.email));
    const snapDoc = await getDocs(q);
    snapDoc.forEach((item) => {
      user = item.data();
      setId(item.id);
      setPhone(user.phone ?? "");
      setFirstname(user.firstname ?? "");
      setLastname(user.lastname ?? "");
    });
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateDoc(doc(db, "user", id), {
          firstname,
          lastname,
          phone,
        });
        toast.success("Update successfull!");
      } else {
        await addDoc(collection(db, "user"), {
          email,
          firstname,
          lastname,
          phone,
        });
        toast.success("Update successfull!");
      }
    } catch (error) {
      toast.error("Update infomation failed!");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Layout>
      <main className="main-account main-info">
        <AccountInfo />
        <div className="info-content">
          <form action="" className="info-form">
            <div className="form-name">
              <div className="form-item left">
                <label for="">First Name</label>
                <input
                  type="text"
                  name="fname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </div>
              <div className="form-item right">
                <label for="">Last Name</label>
                <input
                  type="text"
                  name="lname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>
            </div>
            <div className="form-item">
              <label for="" className="important">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                readOnly={true}
                value={email}
              />
            </div>
            <div className="form-item">
              <label for="">Phone</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="save-btn">
              <button
                className="account-btn"
                type="submit"
                onClick={handleSaveInfo}
              >
                Save
              </button>
            </div>
            <br />
            <br />

            <h3>Change password</h3>
            <div className="old-pass">
              <label for="" className="important">
                Current password
              </label>
              <input
                type="password"
                name="oldpass"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="new-pass">
              <label for="" className="important">
                New password
              </label>
              <input
                type="password"
                name="newpass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="confirm-pass">
              <label for="" className="important">
                Confirm password
              </label>
              <input
                type="password"
                name="confirmpass"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="save-btn">
              <button className="account-btn" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </main>
    </Layout>
  );
}
