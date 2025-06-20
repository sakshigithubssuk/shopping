import React, { useEffect } from 'react';
import CartItem from './CartItem';
import { Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../../../State/Cart/Action';
import store from '../../../State/store.js';

const Cartsection = () => {
  const navigate = useNavigate();
  const {cart} =useSelector(store=>store)
  const dispatch = useDispatch();
  const handleCheckout=()=>{
navigate('/checkout?step=1')
  }
  useEffect(()=>{
dispatch(getCart())
  },[cart.updateCartItem,cart.deleteCartItem])
  return <div>
    <div>
      <div className='lg:grid grid-cols-2 lg:px-16 relative'>
        <div className='cols-span-2 space-y-2'>
        {cart.cart?.cartItems.map((item)=><CartItem item={item}/>)}
        </div>
        <div className='px-5 sticky top-0 h-[100vh] mt-5 lg:mt-0'>
        <div className='border'> 
          <p className='uppercase font-bold opacity-60 pb-4'> Price Details</p>
          <hr/>
            <div className='space-y-3 font-semibold mb-10'>
              <div className='flex justify-between pt-3 text-black'>
                <span>Price</span><span className=' text-green-500 font-bold'>Rs {cart.cart?.totalPrice
}</span>
            </div>
            <hr/>
            <div className='flex justify-between pt-3 text-black'>
                <span>Discount</span><span className=' text-green-500 font-bold'>Rs {cart.cart?.discounte}</span>
            </div>
            <hr/>
            <div className='flex justify-between pt-3 text-black'>
                <span>Dilevery Charge</span ><span className=' text-green-500 font-bold'>Free</span>
            </div>
            <hr/>
            <div className='flex justify-between pt-3 text-black'>
                <span>Total Amount</span><span className=' text-green-500 font-bold'>Rs {cart.cart?.totalDiscountedPrice}</span>
            </div>
        </div>

      </div>
      <Button onClick={handleCheckout} variant="contained" sx={{px:"2rem",py:"1rem",marginTop:"1.5rem",bgcolor:"#9155fd"}} className='w-full '>
              Checkout</Button>
      </div>
     
    </div>
    </div>
  </div>;
}



export default Cartsection;