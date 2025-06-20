// src/Routers/CustomerRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation    from '../customer/components/Navigation/Navigation';
import Footer        from '../customer/components/footer/Footer';
import HomePage      from '../customer/pages/HomePage';
import Cartsection   from '../customer/components/Cart/Cartsection';
import Product       from '../customer/components/Product/Product';
import ProductDetails from '../customer/components/ProductDetail/ProductDetails';
import Checkout      from '../customer/components/Checkout/Checkoutpage';
import Orderpage     from '../customer/components/Order/Orderpage';
import OrderDetails  from '../customer/components/Order/OrderDetails';
import OrderSummary from '../customer/components/Checkout/OrderSummary';

const CustomerRoutes = () => (
  <div>
    <Navigation/>
    <Routes>
      <Route path="/login"    element={<HomePage/>}/>
      <Route path="/register" element={<HomePage/>}/>
      <Route path="/"         element={<HomePage/>}/>
      <Route path="/cart"     element={<Cartsection/>}/>
      <Route path="/:lavelOne/:lavelTwo/:lavelThree" element={<Product/>}/>
      <Route path="/product/:productId" element={<ProductDetails/>}/>
      <Route path="/checkout"  element={<Checkout/>}/>
      <Route path="/account/order"           element={<Orderpage/>}/>
      <Route path="/account/order/:orderId"  element={<OrderDetails/>}/>
      <Route path="/checkout?step=2" element={<OrderSummary/>}/>
    </Routes>
    <Footer/>
  </div>
);

export default CustomerRoutes;
