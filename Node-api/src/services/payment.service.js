const axios = require('axios');
const orderService = require('../services/order.service.js');

const RAZORPAY_KEY_ID = 'rzp_test_sF3coOlKxKliQD';
const RAZORPAY_KEY_SECRET = 'ZdPn0MIyb1fylGV3f1oegMM1';

const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

const createPaymentLink = async (orderId) => {
  try {
    const order = await orderService.findOrderById(orderId);
    if (!order) throw new Error('Order not found');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = emailRegex.test(order.user.email) ? order.user.email : 'default@example.com';

    console.log("Email being sent to Razorpay:", email);

    const data = {
      amount: order.totalPrice * 100, // amount in paise
      currency: 'INR',
      customer: {
        name: order.user.firstName + " " + order.user.lastName,
        contact: order.user.mobile,
        email: email
      },
      notify: {
        sms: true,
        email: true
      },
      reminder_enable: true,
      callback_url: `http://localhost:3000/payment/${order._id}`,
      callback_method: 'get'
    };

    const response = await axios.post('https://api.razorpay.com/v1/payment_links', data, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      paymentLinkId: response.data.id,
      paymentLinkUrl: response.data.short_url,
    };

  } catch (error) {
    throw new Error(error.response?.data?.error?.description || error.message);
  }
};


const updatePaymentInformation = async (reqData) => {
  const paymentId = reqData.payment_id;
  const orderId = reqData.order_id;

  try {
    const order = await orderService.findOrderById(orderId);
    if (!order) throw new Error('Order not found');

    // You need Razorpay SDK initialized here to fetch payment details
    // If you want I can help setup razorpay SDK for this part.
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status === 'captured') {
      order.paymentDetails = order.paymentDetails || {};
      order.paymentDetails.paymentId = paymentId;
      order.paymentDetails.status = "COMPLETED";
      order.orderStatus = "PLACED";
      await order.save();
    }

    return { message: "Your order is Placed", success: true };

  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createPaymentLink,
  updatePaymentInformation
};
