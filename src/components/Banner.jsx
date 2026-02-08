import React from "react";
import '../stylesheets/banner.css'

export default function Banner() {
  return (
    <div id="banner">
      <div className="bigbanner desktop">
        <img src={require("../img/banner/banner1.png")} alt="" />
        <div className="bigbanner-info">
          <p className="bigbanner-title">
            Incredible Prices on All Your Favorite Items
          </p>
          <p className="bigbanner-p">Get more for less on selected brands</p>
          <button className="button-in-img">Shop Now</button>
        </div>
      </div>
      <div className="smallbanner">
        <div className="smallbanneritem">
          <div className="smallbannerInfo">
            <p>Holiday Deals</p>
            <h2>Up to 30% off</h2>
          </div>
          <img src={require("../img/banner/sbaner1.jpg")} alt="" />
        </div>
        <div className="smallbanneritem">
          <div className="smallbannerInfo">
            <p>Just In</p>
            <h2>Take Your Sound Anywhere</h2>
          </div>
          <img src={require("../img/banner/sbaner2.jpg")} alt="" />
        </div>
      </div>
    </div>
  );
}
