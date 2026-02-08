import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import "../stylesheets/productdetail.css";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../fireConfig";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function ProductInfo() {
  const [data, setData] = useState({});
  const [qty, setQty] = useState(1);
  const cartItems = useSelector((state) => state.cartReducer.cartItems);
  const dispatch = useDispatch();
  const params = useParams();
  const docRef = doc(db, "product", params.productId);
  const id = useRef(null);
  const [favs, setFavs] = useState([]);
  const navigate = useNavigate()

  const getProduct = async () => {
    const docSpap = await getDoc(docRef);
    if (docSpap.exists()) {
      setData({ id: docSpap.id, ...docSpap.data() });
    } else {
      console.log("No such document!");
    }
  };
  const docSnap = async () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if(!user)return ;
    const q = query(collection(db, "user"), where("email", "==", user.email));
    try {
      let querySnapshort = await getDocs(q);
      querySnapshort.forEach((doc) => {
        id.current = doc.id;
        setFavs(doc.data().favorite ?? []);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const addToCart = (e, qty) => {
    e.preventDefault();
    dispatch({ type: "ADD_TO_CART", payload: { ...data, qty } });
    toast.success("Add to cart successfull!")
  };

  const handleFavorite = async (e) => {
    e.preventDefault()
    if(!id.current){
      toast.error("Not logged in yet!")
    }
    if (favs.includes(params.productId)) {
      await updateDoc(doc(db, "user", id.current), {
        favorite: favs.filter((item) => item !== params.productId),
      });
      setFavs(favs.filter((item) => item !== params.productId));
      toast.success("Delete from favorite successfull!");
    }
    else {
      await updateDoc(doc(db, "user", id.current), {favorite: [...favs, params.productId]});
      setFavs([...favs, params.productId]);
      toast.success("Add to favorite successfull!");
    }
  };

  const handleBuyNow = (e, qty) => {
    e.preventDefault();
    dispatch({ type: "ADD_TO_CART", payload: { ...data, qty } });
    navigate("/checkout")
  }

  const handleQty = (e) => {
    if(e.target.value < 1) {
      setQty(1);
    }
    else if (e.target.value > data.stock) {
      return 
    }
    else setQty(e.target.value)
  }

  useEffect(() => {
    getProduct();
    docSnap();
  }, []);
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Layout>
      <main className="main-productdetail">
        <div className="product-top">
          <p className="link-product">
            Home/ <a href="">{data.name}</a>
          </p>
        </div>
        <div className="product-container">
          <div className="product-left">
            <img src={data.img} alt="" className="product-detail-img" />
            <div className="thumbnails-container">
              <a href="">
                <img src={data.img} alt="" />
              </a>
            </div>
            <p>{data.description}</p>
          </div>
          <div className="product-right">
            <h2 className="product-detail-name">{data.name}</h2>
            <p className="product-detail-id">ID: 0048</p>
            <p className="product-detail-price">
              {data.sale != 0 && <s>${data.price}.00</s>}${data.price - data.sale}
              .00
            </p>
            <p>Store: {data.stock}</p>
            <form className="product-detail-qty">
              <label for="qty">Quantity</label>
              <br />
              <input
                type="number"
                name="qty"
                id="qty"
                value={qty}
                onChange={handleQty}
              />
              <div className="submit-btn">
                <input
                  type="submit"
                  id="submit"
                  value="Add to cart"
                  onClick={(e) => addToCart(e, qty)}
                />
                <button
                  className={
                    favs.includes(params.productId)
                      ? "product-info-favorite"
                      : ""
                  }
                  onClick={handleFavorite}
                >
                  <i className="fa-regular fa-heart"></i>
                </button>
              </div>
              <button onClick={(e) => handleBuyNow(e, qty)} className="buy-now-btn">Buy now</button>
            </form>
            <div className="product-info">
              <div className="product-info-title">Product Info</div>
              <p>{data.infomation}</p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
