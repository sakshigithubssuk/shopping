import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const OrderSummary = ({ orders }) => {
  const totalOrders = orders.length;
  const delivered = orders.filter(o => o.status === 'delivered').length;
  const onTheWay = orders.filter(o => o.status === 'on_the_way').length;
  const cancelled = orders.filter(o => o.status === 'cancelled').length;
  const returned = orders.filter(o => o.status === 'returned').length;

  return (
    <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Order Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Typography>Total Orders</Typography>
          <Typography fontWeight="bold">{totalOrders}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography>Delivered</Typography>
          <Typography fontWeight="bold" color="success.main">{delivered}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography>On The Way</Typography>
          <Typography fontWeight="bold" color="info.main">{onTheWay}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography>Cancelled</Typography>
          <Typography fontWeight="bold" color="error.main">{cancelled}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography>Returned</Typography>
          <Typography fontWeight="bold" color="warning.main">{returned}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OrderSummary;
