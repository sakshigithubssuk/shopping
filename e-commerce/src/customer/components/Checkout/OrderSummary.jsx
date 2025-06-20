import React, { useEffect } from 'react';
import CartItem from '../Cart/CartItem.jsx';
import { Button, Divider, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../../../State/Cart/Action';

const OrderSummary = ({ address, goToNextStep }) => {
  const { cart } = useSelector((store) => store);
  const dispatch = useDispatch();

  const handleCheckout = () => {
    // Call goToNextStep to advance stepper and navigate to /api/payments
    goToNextStep(address, cart.cart?.cartItems || []);
  };

  useEffect(() => {
    dispatch(getCart());
  }, [cart.updateCartItem, cart.deleteCartItem, dispatch]);

  if (!address) return <Typography>No address selected.</Typography>;
  if (!cart.cart?.cartItems || cart.cart.cartItems.length === 0) return <Typography>No products in cart.</Typography>;

  return (
    <div>
      <div className="lg:grid grid-cols-2 lg:px-16 relative">
        <div className="col-span-1 space-y-2">
          {cart.cart?.cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <div className="px-5 sticky top-0 h-[100vh] mt-5 lg:mt-0">
          {/* Shipping Address Section */}
          <div className="border mb-5">
            <p className="uppercase font-bold opacity-60 pb-4 pt-4 px-4">Shipping Address</p>
            <Divider />
            <div className="p-4 space-y-2">
              <Typography variant="body1">
                {address.firstName} {address.lastName}
              </Typography>
              <Typography variant="body2">
                {address.streetAddress}, {address.city}, {address.state} - {address.zipCode}
              </Typography>
              <Typography variant="body2">Phone: {address.mobile}</Typography>
            </div>
          </div>

          {/* Price Details Section */}
          <div className="border">
            <p className="uppercase font-bold opacity-60 pb-4 pt-4 px-4">Price Details</p>
            <Divider />
            <div className="space-y-3 font-semibold mb-10 p-4">
              <div className="flex justify-between pt-3 text-black">
                <span>Price</span>
                <span className="text-green-500 font-bold">Rs {cart.cart?.totalPrice}</span>
              </div>
              <Divider />
              <div className="flex justify-between pt-3 text-black">
                <span>Discount</span>
                <span className="text-green-500 font-bold">Rs {cart.cart?.discounte || 0}</span>
              </div>
              <Divider />
              <div className="flex justify-between pt-3 text-black">
                <span>Delivery Charge</span>
                <span className="text-green-500 font-bold">Free</span>
              </div>
              <Divider />
              <div className="flex justify-between pt-3 text-black">
                <span>Total Amount</span>
                <span className="text-green-500 font-bold">Rs {cart.cart?.totalDiscountedPrice}</span>
              </div>
            </div>
          </div>
          <Button
            onClick={handleCheckout}
            variant="contained"
            sx={{ px: "2rem", py: "1rem", marginTop: "1.5rem", bgcolor: "#9155fd" }}
            className="w-full"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;