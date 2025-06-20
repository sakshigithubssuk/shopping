const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_test_sF3coOlKxKliQD",
  key_secret: "ZdPn0MIyb1fylGV3f1oegMM1",
});
console.log("Razorpay instance created", razorpay);
module.exports = razorpay
