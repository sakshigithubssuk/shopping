import React, { useState } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from "../../../State/Order/Action.js";
import { useNavigate } from 'react-router-dom';

export default function DeliveryAdressForm({ goToNextStep }) {
  const [addresses, setAddresses] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector(state => state.cart.cart);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newAddr = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      streetAddress: data.get("address"),
      city: data.get("city"),
      state: data.get("state"),
      zipCode: data.get("zip"),
      mobile: data.get("phoneNumber"),
    };
    setAddresses((prev) => [newAddr, ...prev]);
    e.currentTarget.reset();
  };

  const handleSelect = (addr) => {
    const orderData = {
      shippingAddress: {
        fullName: `${addr.firstName} ${addr.lastName}`,
        address: addr.streetAddress,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zipCode,
        phone: addr.mobile
      },
      items: cart?.cartItems?.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.discountedPrice
      })),
      totalPrice: cart?.totalPrice,
      discount: cart?.discounte,
      finalPrice: cart?.totalDiscountedPrice
    };

    dispatch(createOrder(orderData));
    goToNextStep(addr);
   
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Box className="border rounded-md shadow-md p-5">
          <form onSubmit={handleSubmit}>
            {[{ name: "firstName", label: "First Name" },
              { name: "lastName", label: "Last Name" },
              { name: "address", label: "Address", multiline: true, rows: 4 },
              { name: "city", label: "City" },
              { name: "state", label: "State" },
              { name: "zip", label: "Zip Code" },
              { name: "phoneNumber", label: "Phone Number", type: "tel" }
            ].map((field) => (
              <TextField
                key={field.name}
                name={field.name}
                label={field.label}
                required
                fullWidth
                multiline={field.multiline || false}
                rows={field.rows || 1}
                margin="normal"
              />
            ))}
            <Button type="submit" variant="contained" fullWidth>
              Add Address
            </Button>
          </form>
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        {addresses.length === 0 ? (
          <Box>No saved addresses.</Box>
        ) : (
          addresses.map((addr, idx) => (
            <Box key={idx} mb={2} className="border p-2">
              <p>{addr.firstName} {addr.lastName}</p>
              <p>{addr.streetAddress}, {addr.city}, {addr.state} - {addr.zipCode}</p>
              <p>Phone: {addr.mobile}</p>
              <Button variant="contained" onClick={() => handleSelect(addr)}>
                Deliver To This Address
              </Button>
            </Box>
          ))
        )}
      </Grid>
    </Grid>
  );
}
