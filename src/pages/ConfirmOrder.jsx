import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { db } from "../fireConfig";
import "../stylesheets/confirmorder.css";

export default function ConfirmOrder() {
  const [order, setOrder] = useState({});
  const params = useParams();
  const getOrder = async () => {
    const data = await getDoc(doc(db, "order", params.orderId));
    if (data.exists()) {
      setOrder(data.data());
      console.log(data.data());
    } else {
      toast.error("failed fetch order data!");
    }
  };

  useEffect(() => {
    getOrder();
  }, []);
  return (
    <Layout>
      <main className="main-confirm-order">
        <h1>Thank you for your order!</h1>
        <p style={{marginBottom: "20px"}}>Your order #14322 has been place and being process. </p>
        <h4>Your Order Information:</h4>
        <p>Email: {order.email}</p>
        <p>Phone: {order.phone}</p>
        <p>Address: {order.address}</p>
        <p>Shipping method: {order.shipping}</p>
        <p>Payment method: {order.payment}</p>
        <p>
          Total: <b>{order.total}.00$</b>
        </p>
        <div className="main-confirm-products">
          Product:
          {order.products &&
            order.products.map((item) => {
              return (
                <li>
                  <img src={item.img} alt="" />
                  <div>
                    <p>{item.name}</p>
                    <p>Qty: {item.qty}</p>
                  </div>
                </li>
              );
            })}
        </div>
        {!JSON.parse(localStorage.getItem("currentUser")) && (
          <h5>Login to see more detail and track your order status!</h5>
        )}
      </main>
    </Layout>
  );
}
