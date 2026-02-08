import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function AccountInfo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch({ type: "DELETE_ALL" });
    localStorage.setItem("cartItems", JSON.stringify([]));
    localStorage.setItem("currentUser", null);
    navigate("/");
    toast.success("Logout Successfull!");
  };
  return (
    <div className="menu-left">
      <p>Account Infomation</p>
      <ul className="menu-ul">
        <li className="menu-li">
          <Link to={"/info"} className="link">
            Dashboard
          </Link>
        </li>
        <li className="menu-li">
          <Link to={"/accountdetail"} className="link">
            Account Detail
          </Link>
        </li>
        <li className="menu-li">
          <Link to={"/address"} className="link">
            Address
          </Link>
        </li>
        <li className="menu-li">
          <Link to={"/order"} className="link">
            Order
          </Link>
        </li>
        <li className="menu-li">
          <Link to={"/favorite"} className="link">
            Favorite
          </Link>
        </li>
        <li className="menu-li" onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </div>
  );
}
