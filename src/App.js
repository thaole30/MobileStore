import HomePage from './pages/HomePage';
import {Route, BrowserRouter, Routes, useLocation } from 'react-router-dom'

import ProductInfo from './pages/ProductInfo';
import CartPage from './pages/CartPage';
import './stylesheets/style.css';

import {initializeApp} from 'firebase/app'
import Checkout from './pages/Checkout';
import Info from './pages/Info';
import AccountDetail from './pages/AccountDetail';
import ShopAll from './pages/ShopAll';
import ScrollToTop from './components/ScrollToTop';
import Address from './pages/Address';
import OrderInfo from './pages/OrderInfo';
import OrderDetail from './pages/OrderDetail';
import ConfirmOrder from './pages/ConfirmOrder';
import Favorite from './pages/Favorite';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// import { useEffect } from 'react';


function App() {



  return (
      <BrowserRouter className="App">
         <ToastContainer />
        <ScrollToTop/>
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/list/:tag/:orderby' element={<ShopAll/>} />
          <Route path='/list/:search' element={<ShopAll/>} />
          <Route path='/listcate/:id' element={<ShopAll/>} />
          <Route path='/listcate/:id/:tag/:orderby' element={<ShopAll/>} />
          <Route path='/listcate/:id/:search' element={<ShopAll/>} />
          <Route path='/productinfo/:productId' element={<ProductInfo/>} />
          <Route path='/cart' element={<CartPage/>} />
          <Route path='/checkout' element={<Checkout/>} />
          <Route path='/confirmorder/:orderId' element={<ConfirmOrder/>} />
          <Route path='/info' element={<Info/>} />
          <Route path='/accountdetail' element={<AccountDetail/>} />
          <Route path='/address' element={<Address/>} />
          <Route path='/order' element={<OrderInfo/>} />
          <Route path='/orderdetail/:orderId' element={<OrderDetail/>} />
          <Route path='/favorite' element={<Favorite/>} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
