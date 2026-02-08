import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { collection, getDocs} from "firebase/firestore";
import { auth, db } from "../fireConfig";
import { Link, useNavigate } from "react-router-dom";
import HomeProduct from "../components/HomeProduct";
import Banner from "../components/Banner";
import Policy from "../components/Policy";

export default function HomePage() {
  const docRef = collection(db, "category");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const docSnap = async () => {
    try {
      const categories = [];
      let querySnapshort = await getDocs(docRef);
      querySnapshort.forEach((doc) => {
        categories.push({ id: doc.id, ...doc.data() });
      });
      setData(categories);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log(auth.currentUser);
    docSnap();
  }, []);

  return (
    <Layout>
      <main>
        <Banner />
        <div id="content">
          <Policy />
          <HomeProduct title="Best Sellers" tag="hot" />

          <div className="home-container">
            <h2 className="home-container-title">Shop by Category</h2>
            <div className="h-category-container">
              {data.map((item) => (
                <div className="h-category-item" onClick={() => {navigate("/listcate/"+item.id+"/all/inc")}}>
                  <div className="h-category-img">
                  <img
                    src={item.img}
                    alt=""
                  />
                  </div>
                  
                  <h3>{item.name}</h3>
                </div>
              ))}
            </div>
          </div>

          <div className="home-container product-ads">
            <img
              src={require("../img/banner/ads1.jpg")}
              alt=""
              className="helpcenter-img"
            />
            <div className="home-product-ads">
              <div className="home-product-ads-info abs-center">
                <p style={{ fontSize: "2vw", fontWeight: "700" }}>Save up to</p>
                <p style={{ fontSize: "6vw", fontWeight: "600" }}>$150</p>
                <p style={{ fontSize: "2vw", fontWeight: "700" }}>
                  on selected laptop & tablets brands
                </p>
                <p style={{ fontSize: "1vw", fontWeight: "300" }}>
                  Terms and conditions apply
                </p>
                <button className="button-in-img">Shop</button>
              </div>
            </div>
            <div className="best-price-label">
              <p>Best Price</p>
            </div>
          </div>

          <HomeProduct title="New Products" tag="new" />

          <div className="home-container product-ads">
            <div className="home-product-ads ads-left">
              <div className="home-product-ads-info abs-center ads-info2">
                <p className="today-special">Today's Special</p>
                <p style={{ fontSize: "2vw", fontWeight: "700" }}>
                  Best Arial View in Town
                </p>
                <p style={{ fontSize: "6vw", fontWeight: "600" }}>30% </p>
                <p style={{ fontSize: "2vw", fontWeight: "700" }}>
                  on professional camera drones
                </p>
                <p
                  style={{
                    fontSize: "1vw",
                    fontWeight: "300",
                    marginTop: "10px",
                  }}
                >
                  Limited quantities.
                  <br />
                  See product detail pages for availability.
                </p>
                <button className="button-in-img">Shop</button>
              </div>
            </div>
            <img
              src={require("../img/banner/ads2.jpg")}
              alt=""
              className="helpcenter-img"
            />
          </div>

          <HomeProduct title="On Sales" tag="sale" />
        </div>
      </main>
    </Layout>
  );
}
