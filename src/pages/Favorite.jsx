import { async } from "@firebase/util";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { db } from "../fireConfig";

export default function Favorite() {
  const [favorites, setFavorites] = useState([]);
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const q = query(collection(db, "user"), where("email", "==", user.email));
  const idUser = useRef("");
  const docSnap = async () => {
    let idFav = [];
    try {
      let querySnapshort = await getDocs(q);
      querySnapshort.forEach((doc) => {
        idUser.current = doc.id;
        idFav = doc.data().favorite ?? [];
      });
      const fav = [];
      for (let id of idFav) {
        const item = await getDoc(doc(db, "product", id));
        console.log(item);
        if (item.exists()) {
          fav.push({ id: id, ...item.data() });
        }
      }
      console.log(fav);
      setFavorites(fav);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteHandler = async (id) => {
    await updateDoc(doc(db, "user", idUser.current), {
      favorite: favorites
        .filter((item) => item.id != id)
        .map((item) => item.id),
    });
    docSnap()
  };

  useEffect(() => {
    docSnap();
  }, []);
  return (
    <Layout>
      <main className="main-cart">
        <div className="mycart">
          <div className="cart-title">My Favorite</div>

          <div className="cart-container">
            {favorites.length === 0 && (
              <p>You don't have favorite product yet!</p>
            )}
            {favorites.map((item) => {
              return (
                <div className="cart-item" key={item.id}>
                  <Link to={"/productinfo/" + item.id}>
                    <img src={item.img} alt="" className="cart-item-img" />
                  </Link>
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <div className="cart-item-price">
                      {item.sale !== 0 && (
                        <span className="cart-item-cost">
                          <s>${item.price}</s>
                        </span>
                      )}

                      <span className="cart-item-sale">
                        ${item.price - item.sale}.00
                      </span>
                    </div>
                  </div>

                  <p className="favorite-item-info">{item.infomation}</p>

                  <button
                    className="cart-item-del"
                    onClick={() => deleteHandler(item.id)}
                  >
                    <i className="fa-thin fa-x"></i>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </Layout>
  );
}
