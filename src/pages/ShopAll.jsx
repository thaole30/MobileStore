import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import "../stylesheets/shopall.css";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit,
} from "firebase/firestore";
import { db } from "../fireConfig";
import { Link, useNavigate, useParams } from "react-router-dom";
export default function ShopAll() {
  const [title, setTitle] = useState("");
  const [sortby, setSortby] = useState(false);
  const docRef = collection(db, "product");
  const [data, setData] = useState([]);
  const [sliceData, setSliceData] = useState([]);
  const [numproduct, setNumproduct] = useState(8);
  const [root, setRoot] = useState("/list");
  const navigate = useNavigate();
  const params = useParams();
  const docSnap = async () => {
    const product = [];
    let q = docRef;
    setTitle("Shop All");
    if (params.tag !== "all") {
      switch (params.tag) {
        case "sold":
          setTitle("Best Sellers");
          break;
        case "sale":
          setTitle("On Sales");
          break;
        case "date":
          setTitle("New Products");
          break;
      }
      if (params.orderby === "inc") q = query(docRef, orderBy(params.tag));
      else {
        q = query(docRef, orderBy(params.tag, params.orderby));
      }
    }

    try {
      let querySnapshort = await getDocs(q);
      querySnapshort.forEach((doc) => {
        product.push({ id: doc.id, ...doc.data() });
      });
      if (params.id)
        setData(product.filter((item) => item.categoryId === params.id));
      else setData(product);
      console.log(product);
    } catch (e) {
      console.log(e);
    }
  };

  const docSnapSearch = async () => {
    const product = [];
    let q = query(docRef);
    setTitle("Search for " + [params.search]);
    try {
      let querySnapshort = await getDocs(q);
      querySnapshort.forEach((doc) => {
        product.push({ id: doc.id, ...doc.data() });
      });
      setData(
        product.filter((item) => {
          const ckName = item.name
            .toLowerCase()
            .includes(params.search.toLowerCase());
          let ckCate = true;
          if (params.id) {
            ckCate = params.id === item.categoryId;
          }
          return ckName && ckCate;
        })
      );
      console.log(product);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (params.id) {
      console.log(params.id);
      setRoot(root + "cate/" + params.id);
    }
    if (params.search) {
      docSnapSearch();
    } else {
      docSnap();
    }
  }, []);

  useEffect(() => {
    if (params.search) {
      docSnapSearch();
    } else {
      docSnap();
    }
  }, [params]);

  useEffect(() => {
    setSliceData(data.slice(0, numproduct));
  }, [data, numproduct]);

  return (
    <Layout>
      <main>
        <h2 className="main-title">{title}</h2>
        <div className="main-content">
          <div className="main-filter desktop">
            <p className="main-filter-title">Filter by</p>
            <hr />
            <ul className="main-filter-ul">
              <li
                className="main-filter-li"
                onClick={() => {
                  navigate(root + "/all/inc");
                }}
              >
                All
              </li>
              <li
                className="main-filter-li"
                onClick={() => {
                  navigate(root + "/sold/desc");
                }}
              >
                Hot
              </li>
              <li
                className="main-filter-li"
                onClick={() => {
                  navigate(root + "/sale/desc");
                }}
              >
                Sale
              </li>
              <li
                className="main-filter-li"
                onClick={() => {
                  navigate(root + "/date/desc");
                }}
              >
                New
              </li>
              <li
                className="main-filter-li"
                onClick={() => {
                  navigate(root + "/price/inc");
                }}
              >
                Low Price
              </li>
            </ul>
            <hr />
          </div>
          <div className="main-product-conteiner">
            <div className="main-prododuct-filter">
              <div id="sortby" onClick={() => setSortby((pre) => !pre)}>
                <span>Sort by</span>
                <i className="fa-solid fa-angle-down sortby-icon"></i>
                <ul
                  id="sortby-ul"
                  style={{ display: sortby ? "block" : "none" }}
                >
                  <li
                    className="sortby-li"
                    onClick={() => {
                      navigate(root + "/date/desc");
                    }}
                  >
                    Newest
                  </li>
                  <li
                    className="sortby-li"
                    onClick={() => {
                      navigate(root + "/price/inc");
                    }}
                  >
                    Price (low to high)
                  </li>
                  <li
                    className="sortby-li"
                    onClick={() => {
                      navigate(root + "/price/desc");
                    }}
                  >
                    Price (high to low)
                  </li>
                  <li
                    className="sortby-li"
                    onClick={() => {
                      navigate(root + "/name/inc");
                    }}
                  >
                    Name A-Z
                  </li>
                  <li
                    className="sortby-li"
                    onClick={() => {
                      navigate(root + "/name/desc");
                    }}
                  >
                    Name z-A
                  </li>
                </ul>
              </div>
              <div className="mobile main-product-mobile">
                <div className="filter">
                  <p>Filter:</p>
                  <ul>
                    <li
                      onClick={() => {
                        navigate(root + "/all/inc");
                      }}
                    >
                      All
                    </li>
                    <li
                      onClick={() => {
                        navigate(root + "/sold/desc");
                      }}
                    >
                      Hot
                    </li>
                    <li
                      onClick={() => {
                        navigate(root + "/sale/desc");
                      }}
                    >
                      Sale
                    </li>
                    <li
                      onClick={() => {
                        navigate(root + "/date/desc");
                      }}
                    >
                      New
                    </li>
                    <li
                      onClick={() => {
                        navigate(root + "/price/inc");
                      }}
                    >
                      Low Price
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="productContainer shopall">
              {sliceData.map((item) => {
                return (
                  <div className="productitem fouritem">
                    <Link to={"/productinfo/" + item.id} className="link">
                      {/* <span className="sale-tag">SALE</span> */}
                      <img src={item.img} alt="" className="productimg" />
                      <p className="productname">{item.name}</p>
                      <div className="productprice">
                        {item.sale != "0" && (
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

            <button
              className="loadmore-button"
              onClick={() => setNumproduct((pre) => pre + 8)}
            >
              Load more
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
}
