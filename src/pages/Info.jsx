import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AccountInfo from "../components/AccountInfo";
import Layout from "../components/Layout";
import "../stylesheets/info.css";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../fireConfig";
import { useDispatch } from "react-redux";

export default function Info(props) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  const [order, setOrder] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch({type: 'DELETE_ALL'});
    localStorage.setItem('cartItems', JSON.stringify([]));
    localStorage.setItem("currentUser", null);
    navigate("/");
    toast.success("Logout Successfull!");
  };

  const getUser = async () => {
    const q = query(collection(db, "user"), where("email", "==", user.email));
    const snapDoc = await getDocs(q);
    snapDoc.forEach((item) => {
      setUser(item.data());
    });
  };

  const getOrder = async () => {
    const q = query(collection(db, "order"), orderBy("date", "desc"), limit(1));
    const snapDoc = await getDocs(q);
    snapDoc.forEach((item) => {
      setOrder(item.data().products);
    })
  };

  useEffect(() => {
    getUser();
    getOrder();
  }, []);

  return (
    <div>
      <Layout>
        <main className="main-info">
          <AccountInfo />
          <div className="info-content">
            <div className="welcome col2">
              <h1>
                Hello{" "}
                {user.firstname
                  ? user.firstname + " " + (user.lastname ?? "")
                  : user.email.substring(0, user.email.indexOf("@"))}
                !
              </h1>
              <p>
                From your Account Dashboard you have the ability to view a
                snapshot of your recent account activity and update your account
                information. Select a link below to view or edit information.
              </p>
            </div>
            <div className="account-info col2">
              <h3 className="title">Contact Infomation</h3>
              <p>
                {user.firstname
                  ? user.firstname + " " + (user.lastname ?? "")
                  : user.email.substring(0, user.email.indexOf("@"))}
              </p>
              <a href="#">{user.email}</a>
              <div className="button">
                <button className="account-btn" onClick={()=>navigate("/accountdetail")}>Edit Account Infomation</button>
                <button className="account-btn" onClick={()=>navigate("/accountdetail")}>Change Password</button>
              </div>
            </div>

            <div className="account-info">
              <h3 className="title">Your Order</h3>
              <p>
                Newest order:{" "}
                {order &&
                  order.map((item) => {
                    return (
                      <span>
                        {item.name}
                        <br />
                      </span>
                    );
                  })}
              </p>

              <div className="button">
                <button className="account-btn" onClick={()=>navigate("/order")}>Manage Order</button>
              </div>
            </div>
            <div className="account-info">
              <h3 className="title">Default Billing Address</h3>
              {user.address1 ? (
                <p>{user.address1}</p>
              ) : (
                <p>You have not set a default billing address.</p>
              )}
              <div className="button">
                <button className="account-btn" onClick={()=>navigate("/address")}>Edit Address</button>
              </div>
            </div>
            <div className="account-info">
              <h3 className="title">Default Shipping Address</h3>
              {user.address2 ? (
                <p>{user.address2}</p>
              ) : (
                <p>You have not set a default shipping address.</p>
              )}
              <div className="button">
                <button className="account-btn" onClick={()=>navigate("/address")}>Edit Address</button>
              </div>
            </div>
            <div className="account-info">
              <h3 className="title">Logout</h3>
              <p>Sign out of account</p>
              <div className="button">
                <button className="account-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </div>
  );
}
