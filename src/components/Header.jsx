import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./Login";
import { Modal } from "react-bootstrap";
import Register from "./Register";
import Loading from "./Loading";
import "../stylesheets/header.css";
import { Clear, Menu } from "@material-ui/icons";
import Drawer from "./Drawer";

export default function Header() {
  const [search, setSearch] = useState("");
  const cartItems = useSelector((state) => state.cartReducer.cartItems);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  const [showDrawer, setShowDrawer] = useState(false);

  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY + 200) {
        // if scroll down hide the navbar
        setShow(false);
        setLastScrollY(window.scrollY);
      } else if (window.scrollY < lastScrollY) {
        // if scroll up show the navbar
        setShow(true);
        setLastScrollY(window.scrollY);
      }

      // remember current page location to use in the next move
    }
  };

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCloseLogin = () => setShowLogin(false);
  const handleCloseRegister = () => setShowRegister(false);

  const handleShowLogin = (e) => {
    e.preventDefault();
    if (showRegister) setShowRegister(false);
    setShowLogin(true);
  };
  const handleShowRegister = (e) => {
    e.preventDefault();
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleLogin = (e) => {
    setLoading(false);
    setShowLogin(false);
    setUser(JSON.parse(localStorage.getItem("currentUser")));
  };

  const handleRegister = () => {
    setLoading(false);
    setShowRegister(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if(search) navigate("/list/" + search);
  };

  useEffect(() => {
    console.log(loading);
  }, loading);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  const listDrawer = (
    <div className="header-nav-right mobile">
      <Clear onClick={() => setShowDrawer(false)} />
      <ul>
        <li>
          {user ? (
            <Link to="/info" className="link">
              <i className="fa-solid fa-circle-user personal-icon"></i>
              <span>{user.email.substring(0, user.email.indexOf("@"))}</span>
            </Link>
          ) : (
            <>
              <i className="fa-solid fa-circle-user personal-icon"></i>
              <span onClick={handleShowLogin}>Login</span>
            </>
          )}
        </li>
        <li>
          <Link to="/favorite" className="link">
            <i className="fa-regular fa-heart personal-icon"></i>
            <span>Favorite</span>
          </Link>
        </li>
        <li>
          <Link to="/cart" className="link">
            {" "}
            <i className="fa-solid fa-cart-shopping personal-icon"></i>
            <span>Cart</span>
          </Link>
        </li>
        <hr/>
        <li>
          {" "}
          <span>About</span>
        </li>
        <li>
          {" "}
          <span>Contact</span>
        </li>
        <li>
          {" "}
          <span>Help Center</span>
        </li>
      </ul>
    </div>
  );

  return (
    <>
      {loading && <Loading loading={loading} />}
      <Drawer
        show={showDrawer}
        open={() => setShowDrawer(true)}
        close={() => setShowDrawer(false)}
        children={listDrawer}
      />
      <div id="header" className={!show && "header-hidden"}>
        <Modal centered show={showLogin} onHide={handleCloseLogin}>
          <Login hideLogin={handleLogin} setLoading={setLoading}>
            <p>
              Don't have an Account?{" "}
              <a href="#" onClick={handleShowRegister}>
                {" "}
                Register Now!
              </a>
            </p>
          </Login>
        </Modal>

        <Modal centered show={showRegister} onHide={handleCloseRegister}>
          <Register hideRegister={handleRegister} setLoading={setLoading}>
            <p>
              Already have an Account?{" "}
              <a href="#" onClick={handleShowLogin}>
                {" "}
                Login Now!
              </a>
            </p>
          </Register>
        </Modal>
        <div id="header-top">
        <div className="header-nav-mobile mobile">
            <Menu
              color="white"
              className="header-nav-icon"
              onClick={() => setShowDrawer(true)}
            />
          </div>
          <ul className="info desktop">
            <li>
              <a href="">About</a>
            </li>
            <li>
              <a href="">Contact</a>
            </li>
            <li>
              <a href="">Help Center</a>
            </li>
            <li>
              Call Us <a href="">123-456-789</a>
            </li>
          </ul>
          <div className="free-ship ">
            <i className="fa-solid fa-truck-fast"></i>
            Free Shipping for orders over 50$
          </div>
          
        </div>
        <div id="header-content">
          <div className="logo">
            <p className="logo-icon">
              <Link to={"/"} className="link">
                UEDTech
              </Link>
            </p>
            <form action="" className="search-form">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="search-btn" onClick={handleSearch}>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>

          <ul className="personal desktop">
            {user ? (
              <Link to="/info" style={{ color: "black" }}>
                <li className="personal-item">
                  <i className="fa-solid fa-circle-user personal-icon"></i>
                  <a href="">
                    {user.email.substring(0, user.email.indexOf("@"))}
                  </a>
                </li>
              </Link>
            ) : (
              <li className="personal-item" onClick={handleShowLogin}>
                <i className="fa-solid fa-circle-user personal-icon"></i>
                <a href="">Login</a>
              </li>
            )}

            <li className="personal-item">
              <i className="fa-regular fa-heart personal-icon"></i>
              <Link to="/favorite" style={{ color: "black" }}>
                <a href="#">Favories</a>
              </Link>
            </li>
            <li className="personal-item">
              <Link to="/cart" style={{ color: "black" }}>
                <i className="fa-solid fa-cart-shopping personal-icon"></i>{" "}
                <a href="">{cartItems.length}</a>
              </Link>
            </li>
          </ul>
        </div>
        <div id="header-nav">
          <ul className="nav">
            <li className="nav-item">
              <Link to={"/list/all/inc"} className="link">
                Shop All
              </Link>
            </li>
            <li className="nav-item">Phones</li>
            <li className="nav-item">Tablets</li>
            <li className="nav-item">Computers</li>
          </ul>
        </div>
      </div>
    </>
    //     <div className='header'>
    //     <nav className="navbar navbar-expand-lg navbar-light bg-light">
    //       <div className="container-fluid">
    //         <Link className="navbar-brand" to="/">UEDshop</Link>
    //         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    //           <span className="navbar-toggler-icon"><FaBars size={25} color='white'/></span>
    //         </button>
    //         <div className="collapse navbar-collapse" id="navbarNav">
    //           <ul className="navbar-nav ms-auto">
    //             <li className="nav-item">
    //               <Link className="nav-link active" aria-current="page" to="/">user</Link>
    //             </li>
    //             <li className="nav-item">
    //               <Link className="nav-link" to="/">orders</Link>
    //             </li>
    //             <li className="nav-item">
    //               <Link className="nav-link" to="/">logout</Link>
    //             </li>
    //             <li className="nav-item">
    //               <Link className="nav-link" to="/">cart</Link>
    //             </li>
    //           </ul>
    //         </div>
    //       </div>
    //     </nav>
    //   </div>
  );
}
