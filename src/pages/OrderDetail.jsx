import React, { useEffect, useState } from 'react'
import AccountInfo from '../components/AccountInfo'
import Layout from '../components/Layout'
import { useParams } from 'react-router-dom'
import "../stylesheets/orderdetail.css"
import { doc, getDoc} from 'firebase/firestore'
import { db } from '../fireConfig'
import { toast } from 'react-toastify'

export default function OrderDetail() {
    const [order, setOrder] = useState({});
    const params = useParams();
    const getOrder = async () => {
        const data = await getDoc(doc(db, "order", params.orderId));
        if (data.exists()) {
        setOrder(data.data());
        } else {
        toast.error("failed fetch order detail data!");
        }
    };

    useEffect(() => {
        getOrder();
    }, []);

  return (
    <Layout>
        <main className='main-account main-info'>
            <AccountInfo/>
            <div className="info-content">
                <div className="orderdetail-detail col2">
                    <h2 className='col2'>Detail</h2>
                    <div className="orderdetail-detail-container">
                        <p><b>Name:</b> {order.firstName} {order.lastName}</p>
                        <p><b>Phone:</b> {order.phone}</p>
                        <p><b>Adress:</b> {order.address}</p>
                        <p><b>Status:</b> {order.status}</p>
                    </div>
                    <div className="orderdetail-detail-container">
                        <p><b>Payment:</b> {order.payment}</p>
                        <p><b>Shipping:</b> {order.shipping}</p>
                        <p><b>Total:</b> ${order.total}.00</p>
                    </div>
                </div>
                <h2 className='orderdetail-item-label'>Items</h2>
              <div className="cart-container col2">
              {order.products &&
                    order.products.map((item) => {
                    return <div className="cart-item">
                      <img src={item.img}
                      alt="" className="cart-item-img"/>
                      <div className="cart-item-info">
                          <p className="cart-item-name">
                              {item.name}
                          </p>
                          <div className="cart-item-price">
                              {item.sale && <span className="cart-item-cost">
                                  <s>${item.price}.00</s>
                              </span>}
                              
                              <span className="cart-item-sale">
                                  ${item.price-item.sale}.00
                              </span>
                          </div>
                      </div>
                      <div className="cart-item-qty orderdetail-qty">
                          <span>Qty: {item.qty}</span>

                      </div>
                      <p className="cart-item-total orderdetail-price">
                          Total: ${(item.price-item.sale)*item.qty}.00
                      </p>
                  </div>
                })}
                  
                  <br/><br/>
                  
              </div>
            </div> 
        </main>
    </Layout>
  )
}
