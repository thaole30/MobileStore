import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "../stylesheets/cart.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EmptyCart from "../components/EmptyCart";

export default function CartPage() {
  const cartItems = useSelector((state) => state.cartReducer.cartItems);
  let tt = 0;

  const dispatch = useDispatch();

  const updateQtyHandler = (product, qty) => {
    if (qty < 1) qty = 1;
    dispatch({ type: "UPDATE_QTY", payload: { ...product, qty } });
  };

  const deleteHandler = (product) => {
    dispatch({ type: "DELETE_FROM_CART", payload: product });
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);
  return (
    <Layout>
      <main className="main-cart">
        <div className="mycart">
          <div className="cart-title">My Cart</div>

          <div className="cart-container">
            {cartItems.length == 0 && <EmptyCart />}
            {cartItems.map((item) => {
              tt += (item.price - item.sale) * item.qty;
              return (
                <div className="cart-item">
                  <img src={item.img} alt="" className="cart-item-img" />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <div className="cart-item-price">
                      {item.sale != 0 && (
                        <span className="cart-item-cost">
                          <s>${item.price}</s>
                        </span>
                      )}

                      <span className="cart-item-sale">
                        ${item.price - item.sale}.00
                      </span>
                    </div>
                  </div>
                  <div className="cart-item-qty">
                    <button
                      className="minus"
                      onClick={() => updateQtyHandler(item, item.qty - 1)}
                    >
                      -
                    </button>
                    <input
                      aria-label="Choose quantity"
                      aria-live="assertive"
                      aria-describedby="[object Object]"
                      type="number"
                      min="1"
                      max="999"
                      value={item.qty}
                      step="1"
                      onChange={(e) => updateQtyHandler(item, e.target.value)}
                    />
                    <button
                      className="plus"
                      onClick={() => updateQtyHandler(item, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="cart-item-total">
                    ${(item.price - item.sale) * item.qty}.00
                  </p>
                  <button
                    className="cart-item-del"
                    onClick={() => deleteHandler(item)}
                  >
                    <i className="fa-thin fa-x"></i>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="ordersumary">
          <div className="cart-title">Order Sumary</div>
          <div className="order-info-container">
            <div className="order-info">
              <p className="label">Subtotal</p>
              <p className="value">${tt}.00</p>
            </div>
            <div className="order-info">
              <p className="label">Shipping</p>
              <p className="value">FREE</p>
            </div>
            <div className="order-info">
              <p className="label">
                <a href="">Address</a>
              </p>
            </div>
          </div>

          <div className="total">
            <p className="label">Total</p>
            <p className="value">${tt}.00</p>
          </div>
          <button className="checkout">
            <Link
              to="/checkout"
              style={{ color: "white", "text-decoration": "none" }}
            >
              Checkout
            </Link>
          </button>
        </div>
      </main>
    </Layout>
  );
}
