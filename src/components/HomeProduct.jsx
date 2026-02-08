import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../fireConfig";

export default function HomeProduct(props) {
  const [product, setProduct] = useState([]);
  const tag = useRef("");
  const productSnap = async () => {
    try {
      const product = [];

      const productRef = collection(db, "product");
      switch (props.tag) {
        case "hot":
          tag.current = "sold";
          break;
        case "sale":
          tag.current = "sale";
          break;
        case "new":
          tag.current = "date";
          break;
      }

      const q = query(productRef, orderBy(tag.current, "desc"), limit(5));
      let querySnapshort = await getDocs(q);
      querySnapshort.forEach((doc) => {
        product.push({ id: doc.id, ...doc.data() });
      });
      setProduct(product);
      console.log(product);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    productSnap();
  }, []);
  return (
    <div className="home-container">
      <h2 className="home-container-title">{props.title}</h2>
      <div className="productContainer">
        {product.map((item) => {
          return (
            <div className="productitem">
              <Link className="link" to={"/productinfo/" + item.id}>
                <span className={props.tag + "-tag"}> {props.tag}</span>
                <img src={item.img} alt="" className="productimg" />
                <p className="productname">{item.name}</p>
                <div className="productprice">
                  {item.sale !== 0 && (
                    <span className="productcost">
                      <s>${item.price}.00</s>
                    </span>
                  )}

                  <span className="productsale">
                    ${item.price - item.sale}.00
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      <Link to={`/list/${tag.current}/desc`}>
        <button className="product-button">View All</button>
      </Link>
    </div>
  );
}
