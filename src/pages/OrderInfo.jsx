import React, { useEffect, useRef, useState } from "react";
import AccountInfo from "../components/AccountInfo";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import "../stylesheets/table.css";
import { DeleteOutline as Delete } from "@material-ui/icons";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../fireConfig";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

export default function OrderInfo() {
  const [orders, setOrders] = useState([]);
  const [cancelRequest, setCancelRequest] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const order = useRef(null);

  const pendingStyle = {
    backgroundColor: "rgb(178 221 255)",
  };

  const approvedStyle = {
    backgroundColor: "rgb(157 255 194)",
  };

  const declinedStyle = {
    backgroundColor: "#ff7e7e",
  };

  const PenDecStyle = {
    backgroundColor: "#ffc37e",
  };

  const CancelledStyle = {
    backgroundColor: "#ff7c7c",
  };

  const getOrder = async () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const q = query(
      collection(db, "order"),
      where("email", "==", user.email),
     
    );
    const snapDoc = await getDocs(q);
    const arrOrders = [];
    snapDoc.forEach((item) => {
      console.log(item.data().date);
      arrOrders.push({ id: item.id, ...item.data() });
    });
    setOrders(arrOrders);
  };

  const handleDelete = async () => {
    if (!cancelRequest) return;
    await updateDoc(doc(db, "order", order.current), { status: "PendingCancel" });
    await addDoc(collection(db, "message"), {
      type: "Cancell Request",
      text: cancelRequest,
      order: order.current,
      status: "unread",
      date: Timestamp.fromDate(new Date()),
    });
    handleClose();
    toast.success("Your cancel request has been send!");
    getOrder();
  };

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <Layout>
      <main className="main-account main-info">
        <AccountInfo />
        <div className="info-content">
          <table className="col2 orderInfoTable">
            <tr className="orderInfoTableTitle">
              <th>ID</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date Create</th>
              <th>View Detail</th>
            </tr>
            {orders.map((item) => {
              return (
                <tr className="orderInfoTableItem" key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <div
                      className="orderInfoTableStatus"
                      style={
                        item.status === "Pending"
                          ? pendingStyle
                          : item.status === "Approved"
                          ? approvedStyle
                          : item.status === "Decline"
                          ? declinedStyle
                          : item.status === "Cancelled"
                          ? CancelledStyle
                          : PenDecStyle
                      }
                    >
                      {item.status}
                    </div>
                  </td>
                  <td className="orderInfoTableTotal">${item.total}</td>
                  <td>
                    {item.date.toDate().toDateString()}{" "}
                    {item.date.toDate().toLocaleTimeString()}
                  </td>
                  <td>
                    <Link to={"/orderdetail/" + item.id}>
                      <button
                        className="account-btn orderDetailBtn"
                        type="submit"
                      >
                        Detail
                      </button>
                    </Link>
                    {item.status !== "Cancelled" && <Delete className="orderInfoDelete" onClick={() => {handleShow(); order.current = item.id}} />}
                  </td>
                </tr>
              );
            })}
            <Modal centered show={show} onHide={handleClose} className="cancelModal">
              <Modal.Header closeButton>
                <Modal.Title>Cancel Order Request</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p>
                  Your request will be sent to our support team to cancel this
                  order.
                </p>
                <p>Please enter your reason for Order cancellation:</p>
                <input
                  type="text"
                  required={true}
                  value={cancelRequest}
                  onChange={(e) => setCancelRequest(e.target.value)}
                  placeholder="Enter your reason"
                />
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleDelete}>
                  Submit
                </Button>
              </Modal.Footer>
            </Modal>
          </table>
        </div>
      </main>
    </Layout>
  );
}
