import React from "react";
import "../stylesheets/footer.css"
export default function Footer() {
  return (
    <div id="footer">
      <div className="helpcenter">
        <div className="helpcenter-link">
          <div className="helpcenter-clip-path"></div>
          <div className="helpcenter-info desktop abs-center">
            <p className="title-in-img">Need Help? Check Out Our Help Center</p>
            <p className="helpcenter-p">
              I'm a paragraph. Click here to add your own text and edit me. Let
              your users get to know you.
            </p>
            <button className="button-in-img">Go to Help Center</button>
          </div>
        </div>
        <img
          src={require("../img/helpcenter.jpg")}
          alt=""
          className="helpcenter-img"
        />
      </div>
      <div className="footer-info">
        <div className="footer-info-container">
          <h3>Store Location</h3>
          <ul className="footer-info-ul">
            <li>500 Terry Francois Street San Francisco, CA 94158</li>
            <li>info@mtsite.com</li>
            <li>123-456-789</li>
            <li></li>
          </ul>
        </div>
        <div className="footer-info-container">
          <h3>Shop</h3>
          <ul className="footer-info-ul">
            <li>
              <a href="">Shop All</a>
            </li>
            <li>
              <a href="">Phone</a>
            </li>
            <li>
              <a href="">Tablet</a>
            </li>
            <li>
              <a href="">Computer</a>
            </li>
          </ul>
        </div>
        <div className="footer-info-container">
          <h3> Customer Support</h3>
          <ul className="footer-info-ul">
            <li>
              <a href="">Contact Us</a>
            </li>
            <li>
              <a href="">Help Center</a>
            </li>
            <li>
              <a href="">About Us</a>
            </li>
            <li>
              <a href="">Careers</a>
            </li>
          </ul>
        </div>
        <div className="footer-info-container">
          <h3>Policy</h3>
          <ul className="footer-info-ul">
            <li>
              <a href="">Shipping & Returns</a>
            </li>
            <li>
              <a href="">Terms & Conditions</a>
            </li>
            <li>
              <a href="">Payment Methods</a>
            </li>
            <li>
              <a href="">FAQ</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-hr"></div>
      <div className="footer-copyright">
        <p className="footer-p">We accept the following paying methods</p>
        <div className="footer-paymethod">
          <img
            src="https://static.wixstatic.com/media/84770f_27001c40036842889a78a72766ad4700~mv2.png/v1/fill/w_69,h_41,al_c,usm_0.66_1.00_0.01,enc_auto/Visa.png"
            alt=""
            className="img-paymethod"
          />
          <img
            src="https://static.wixstatic.com/media/c837a6_e8798fcfdaf144478a5c7da1ba28ff2c~mv2.png/v1/fill/w_69,h_43,al_c,usm_0.66_1.00_0.01,enc_auto/brand-mastercard%403x.png"
            alt=""
            className="img-paymethod"
          />
          <img
            src="https://static.wixstatic.com/media/c837a6_2bd3e20d1e214eccb5e106fc6d1f535d~mv2.png/v1/fill/w_69,h_36,al_c,usm_0.66_1.00_0.01,enc_auto/brand-amex%403x.png"
            alt=""
            className="img-paymethod"
          />
          <img
            src="https://static.wixstatic.com/media/c837a6_52115f99af28419d95a951f226e32e2b~mv2.png/v1/fill/w_69,h_43,al_c,usm_0.66_1.00_0.01,enc_auto/brand-chinaunionpay%403x.png"
            alt=""
            className="img-paymethod"
          />
          <img
            src="https://static.wixstatic.com/media/c837a6_9378fbd3ef8c470bb89aee12ecbd2209~mv2.png/v1/fill/w_69,h_43,al_c,usm_0.66_1.00_0.01,enc_auto/brand-jcb%403x.png"
            alt=""
            className="img-paymethod"
          />
          <img
            src="https://static.wixstatic.com/media/84770f_70555dcb450a415d80322cb8d7e82a33~mv2.png/v1/fill/w_65,h_48,al_c,usm_0.66_1.00_0.01,enc_auto/Diners.png"
            alt=""
            className="img-paymethod"
          />
          <img
            src="https://static.wixstatic.com/media/84770f_8445424a46ca49f39359bf19d4a3e537~mv2.png/v1/fill/w_69,h_48,al_c,usm_0.66_1.00_0.01,enc_auto/PayPal.png"
            alt=""
            className="img-paymethod"
          />
        </div>
      </div>
    </div>
  );
}
