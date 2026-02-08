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
import React, { lazy, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AccountInfo from "../components/AccountInfo";
import Layout from "../components/Layout";
import { db } from "../fireConfig";
// import "../stylesheets/address.css"
export default function Address() {
  const [address1, setBilldingAddress] = useState("");
  const [address2, setShippingAddress] = useState("");
  const [user, setUser] = useState("");
  const getUser = async () => {
    let u = JSON.parse(localStorage.getItem("currentUser"));
    const q = query(collection(db, "user"), where("email", "==", u.email));
    const snapDoc = await getDocs(q);
    snapDoc.forEach((item) => {
      u = item.data();
      setUser({ ...u, id: item.id });
      setBilldingAddress(u.address1 ?? "");
      setShippingAddress(u.address2 ?? "");
    });
  };

  const handleSaveBillAddress = async (e) => {
    e.preventDefault();
    try {
      if (user.id) {
        console.log(1);
        await updateDoc(doc(db, "user", user.id), {
          address1,
        });
        toast.success("Update successfull!");
      } else {
        await addDoc(collection(db, "user"), {
          email: user.email,
          address1,
        });
        toast.success("Update successfull!");
      }
    } catch (error) {
      toast.error("Update infomation failed!");
    }
  };

  const handleSaveShipAddress = async (e) => {
    e.preventDefault();
    try {
      if (user.id) {
        await updateDoc(doc(db, "user", user.id), {
          address2,
        });
        toast.success("Update successfull!");
      } else {
        await addDoc(collection(db, "user"), {
          email: user.email,
          address2,
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
          <div>
            <form action="" className="info-form">
              <div className="form-item left">
                <label for="">Default Billding Address</label>
                <input
                  type="text"
                  name="fname"
                  value={address1}
                  onChange={(e) => setBilldingAddress(e.target.value)}
                />
              </div>

              <div className="save-btn">
                <button
                  className="account-btn"
                  type="submit"
                  onClick={handleSaveBillAddress}
                >
                  Save
                </button>
              </div>
            </form>
            <br />
            <br />
            <form action="" className="info-form">
              <div className="form-item left">
                <label for="">Default Shipping Address</label>
                <input
                  type="text"
                  name="fname"
                  value={address2}
                  onChange={(e) => setShippingAddress(e.target.value)}
                />
              </div>

              <div className="save-btn">
                <button
                  className="account-btn"
                  type="submit"
                  onClick={handleSaveShipAddress}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </Layout>
  );
}
