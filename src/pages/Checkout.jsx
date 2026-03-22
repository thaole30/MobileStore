import { async } from "@firebase/util";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { db } from "../fireConfig";
import "../stylesheets/checkout.css";

export default function Checkout() {
  const [showItems, setShowItems] = useState(false);
  const [shipping, setShipping] = useState(null);
  const [shippingString, setShippingString] = useState(null);
  const [payment, setPayment] = useState(null);
  const [email, setEmail] = useState("");
  const [emailReadOnly, setEmailReadOnly] = useState(false);
  const [styleEmailOnly, setStyleEmailReadOnly] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [creditName, setCreditName] = useState("");
  const [creditNum, setCreditNum] = useState("");
  const [creditDate, setCreditDate] = useState("");
  const [cvc, setCVC] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [errorAddress, setErrorAddress] = useState("");
  const [errorShipping, setErrorShipping] = useState("");
  const [errorPayment, setErrorPayment] = useState("");
  const [errorEmptyOrder, setErrorEmptyOrder] = useState("");
  const refEmail = useRef(null);
  const refPhone = useRef(null);
  const refAddress = useRef(null);
  const refShipping = useRef(null);
  const refPayment = useRef(null);

  const cartItems = useSelector((state) => state.cartReducer.cartItems);
  const dispatch = useDispatch();

  let tt = cartItems.reduce((total, item) => {
    return Number(total) + (Number(item.price) - item.sale) * Number(item.qty);
  }, 0);

  const onFlat = (e) => {
    setShipping(5);
    setShippingString(e.target.value);
    setErrorShipping("");
  };
  const onQuickShipping = (e) => {
    setShipping(10);
    setShippingString(e.target.value);
    setErrorShipping("");
  };
  const onInstore = (e) => {
    setShipping(0);
    setShippingString(e.target.value);
    setErrorShipping("");
  };

  const onShowItems = () => {
    setShowItems((pre) => !pre);
  };

  const checkError = () => {
    if (cartItems.length == 0) {
      setErrorEmptyOrder("Your order(cart) is empty!");
      return true;
    }
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || reg.test(email) === false) {
      setErrorEmail("Email is in valid!");
      refEmail.current.focus();
      return true;
    }
    const regPhone = /^[0-9]*$/;
    if (!phone || regPhone.test(phone) === false) {
      refPhone.current.focus();
      setErrorPhone("Phone is in valid!");
      return true;
    }
    if (!address) {
      refAddress.current.focus();
      setErrorAddress("Address field is required!");
      return true;
    }

    if (!shippingString) {
      refShipping.current.focus();
      setErrorShipping("Shipping method is required!");
      return true;
    }

    if (!payment) {
      refPayment.current.focus();
      setErrorPayment("Payment method field is required!");
      return true;
    }

    return false;
  };
  const navigate = useNavigate();

  const handleOrder = async () => {
    if (checkError()) return;
    try {
      const res = await addDoc(collection(db, "order"), {
        email,
        firstName:
          firstName || lastName
            ? firstName
            : email.substring(0, email.indexOf("@")),
        lastName,
        phone,
        address,
        shipping: shippingString,
        shippingFee: shipping,
        payment,
        products: cartItems,
        total: tt,
        date: Timestamp.fromDate(new Date()),
        status: "Pending",
      });
      dispatch({ type: "DELETE_ALL" });
      localStorage.setItem("cartItems", JSON.stringify([]));
      toast.success("Order Complete!");
      navigate("/confirmorder/" + res.id);
    } catch (e) {
      console.log(e);
      toast.error("Order failed!");
    }
  };

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setEmail(user.email);
      setEmailReadOnly(true);
      setStyleEmailReadOnly({ backgroundColor: "#8080805c" });
    }
  }, []);

  return (
    <>
      <Layout>
        <main class="main-checkout">
          <div className="ship-info">
            <h2>SHIPPING INFO</h2>
            <form className="address-form">
              <div className="address-info">
                <label for="email" className="important">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  ref={refEmail}
                  readOnly={emailReadOnly}
                  style={styleEmailOnly}
                  value={email}
                  placeholder="ued@gmail.com"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorEmail("");
                  }}
                />
                <span className="err-mess">{errorEmail}</span>
              </div>
              <div className="address-info name">
                <div className="first-name">
                  <label for="fname">First Name</label>
                  <input
                    type="text"
                    name="fname"
                    value={firstName}
                    placeholder="A"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <span className="err-mess"></span>
                </div>
                <div className="last-name">
                  <label for="lname">Last Name</label>
                  <input
                    type="text"
                    name="lname"
                    value={lastName}
                    placeholder="NV"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="address-info">
                <label for="phone" className="important">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  ref={refPhone}
                  value={phone}
                  placeholder="0123456789"
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrorPhone("");
                  }}
                />
                <span className="err-mess">{errorPhone}</span>
              </div>
              <div className="address-info">
                <label for="address" className="important">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  ref={refAddress}
                  value={address}
                  placeholder="09 Le Duan"
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setErrorAddress("");
                  }}
                />
                <span className="err-mess">{errorAddress}</span>
              </div>
              <div className="shipping">
                <h2 className="important">Shipping method</h2>
                <div id="shipping-container">
                  <div className="shipping-item">
                    <input
                      type="radio"
                      name="ship-method"
                      ref={refShipping}
                      value="flat"
                      onClick={onFlat}
                    />
                    <label for="flat">Flat Shipping Rate - $5.00</label>
                  </div>
                  <div className="shipping-item">
                    <input
                      type="radio"
                      name="ship-method"
                      id="free"
                      value="quick shipping"
                      onClick={onQuickShipping}
                    />
                    <label for="free">Quick Shipping - $10.00</label>
                  </div>
                  <div className="shipping-item">
                    <input
                      type="radio"
                      name="ship-method"
                      id="instore"
                      value="instore"
                      onClick={onInstore}
                    />
                    <label for="instore">Pickup in store</label>
                  </div>
                </div>
                <span className="err-mess">{errorShipping}</span>
              </div>
              <div className="payment">
                <h2 className="important">Payment method</h2>
                <div id="payment-container">
                  <div className="payment-item">
                    <input
                      type="radio"
                      name="p-method"
                      ref={refPayment}
                      value="Cash On Delivery"
                      onClick={(e) => {
                        setPayment(e.target.value);
                        setErrorPayment("");
                      }}
                    />
                    <label for="fast">Cash On Delivery</label>
                  </div>
                  <div className="payment-item">
                    <input
                      type="radio"
                      name="p-method"
                      id="bank"
                      value="Bank Transfer"
                      onClick={(e) => {
                        setPayment(e.target.value);
                        setErrorPayment("");
                      }}
                    />
                    <label for="fast">Bank Transfer</label>
                  </div>
                  <div className="payment-item">
                    <input
                      type="radio"
                      name="p-method"
                      id="card"
                      value="Credit Card"
                      onClick={(e) => {
                        setPayment(e.target.value);
                        setErrorPayment("");
                      }}
                    />
                    <label for="fast">Credit Card</label>
                  </div>
                </div>
                <span className="err-mess">{errorPayment}</span>
              </div>
              {payment === "Credit Card" ? (
                <div className="creadit-card">
                  <h2>Credit Card</h2>
                  <div className="address-info credit">
                    <div className="credit-info">
                      <label for="credit-name" className="important">Name on Card</label>
                      <input
                        type="text"
                        name="creditname"
                        value={creditName}
                        placeholder="A"
                        onChange={(e) => setCreditName(e.target.value)}
                      />
                      <span className="err-mess"></span>
                    </div>
                    <div className="credit-info">
                      <label for="credit-num" className="important">Number</label>
                      <input
                        type="text"
                        name="credit-num"
                        value={creditNum}
                        placeholder="A"
                        onChange={(e) => setCreditNum(e.target.value)}
                      />
                      <span className="err-mess"></span>
                    </div>
                    <div className="credit-info-50">
                      <label for="credit-date" className="important">Expired date</label>
                      <input
                        type="date"
                        name="credit-date"
                        value={creditDate}
                        placeholder="12/05/2022"
                        onChange={(e) => setCreditDate(e.target.value)}
                      />
                      <span className="err-mess"></span>
                    </div>
                    <div className="credit-info-50">
                      <label for="cvc" className="important">CVC</label>
                      <input
                        type="text"
                        name="cvc"
                        value={cvc}
                        placeholder="CVC"
                        onChange={(e) => setCVC(e.target.value)}
                      />
                      <span className="err-mess"></span>
                    </div>
                  </div>
                </div>
              ) : null}
            </form>
          </div>
          <div className="order-sumary">
            <h2>ORDER SUMMARY</h2>
            <div className="item-cart">
              <div className="ck-order-info">
                <p>
                  {cartItems.length} {cartItems.length == 1 ? "item" : "items"}{" "}
                  in Cart
                </p>
                <div className="show-btn" onClick={() => onShowItems()}>
                  <i className="fa-solid fa-angles-down"></i>
                </div>
              </div>
              {showItems && (
                <div id="order-item-container">
                  {cartItems.map((item) => {
                    return (
                      <div className="order-item">
                        <img src={item.img} alt="" className="item-img" />
                        <div className="item-info">
                          <p>{item.name}</p>
                          <p>
                            Qty: <span>{item.qty}</span>
                          </p>
                        </div>
                        <p className="price">${item.price - item.sale}.00</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="ck-order-info-container">
              <div className="ck-order-info">
                <p className="label">Cart Subtotal</p>
                <p className="price">${tt}.00</p>
              </div>
              {/* <div className="ck-order-info">
                <p className="label">Promotion Discount</p>
                <p className="price">$0.00</p>
              </div> */}
              <div className="ck-order-info">
                <p className="label">Shipping</p>
                <p id="shipping-price">
                  {shipping == null
                    ? "not yet caculated"
                    : "$" + shipping + ".00"}
                </p>
              </div>
              <div className="ck-order-info checkout-total">
                <p className="label">Order Total</p>
                <p className="price">${tt + shipping}.00</p>
              </div>
              <span className="err-mess">{errorEmptyOrder}</span>
            </div>
            <button className="order-btn" onClick={handleOrder}>
              Confirm Order
            </button>
          </div>
        </main>
      </Layout>
    </>
  );
}
