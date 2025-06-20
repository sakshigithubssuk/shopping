import React, { useState } from 'react';
import { Grid, Typography, Paper, FormControlLabel, Checkbox } from '@mui/material';
import Ordercard from './Ordercard';
import OrderSummary from './OrderSummary'; // Import the new component

const orderStatusOptions = [
    { label: "On The Way", value: "on_the_way" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Returned", value: "returned" }
];

const MyOrders = [
  { id: 1, status: 'delivered', deliveryDate: 'April 10, 2024', title: "Men's Premium Softshell Jacket", price: 1099, size: "M", color: "Charcoal Black" },
  { id: 2, status: 'on_the_way', expectedDate: 'April 18, 2024', title: "Another Item", price: 45.50, size: "L", color: "Red" },
  { id: 3, status: 'cancelled', title: "Cancelled Thing", size:"XL", price: 75, color: "Blue" },
  { id: 4, status: 'returned', title: "Returned Product", price: 60, size: "S", color: "Green" },
];

const Orderpage = () => {
    const [selectedFilters, setSelectedFilters] = useState([]);

    const handleFilterChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedFilters(prev => [...prev, value]);
        } else {
            setSelectedFilters(prev => prev.filter(status => status !== value));
        }
    };

    const filteredOrders = selectedFilters.length === 0
        ? MyOrders
        : MyOrders.filter(order => selectedFilters.includes(order.status));

    return (
        <Grid container spacing={3} sx={{ px: 2, py: 3 }}>

            {/* Filter Section */}
            <Grid item xs={12} md={2}>
                <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 16 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Filter
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="semibold" sx={{ mb: 1 }}>
                        Order Status
                    </Typography>
                    {orderStatusOptions.map(option => (
                        <FormControlLabel
                            key={option.value}
                            control={
                                <Checkbox
                                    value={option.value}
                                    checked={selectedFilters.includes(option.value)}
                                    onChange={handleFilterChange}
                                    color="primary"
                                />
                            }
                            label={option.label}
                        />
                    ))}
                </Paper>
            </Grid>

            {/* Main Content Section */}
            <Grid item xs={12} md={10}>
                {/* Order Summary - above orders */}
                <OrderSummary orders={filteredOrders} />

                {/* Orders List */}
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <Ordercard
                            key={order.id}
                            status={order.status}
                            deliveryDate={order.deliveryDate}
                            expectedDate={order.expectedDate}
                            title={order.title}
                            price={order.price}
                            size={order.size}
                            color={order.color}
                        />
                    ))
                ) : (
                    <Typography sx={{ textAlign: 'center', mt: 5 }}>
                        No orders found.
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
};

export default Orderpage;
