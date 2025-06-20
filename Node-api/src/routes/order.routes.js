const express = require('express');
const router = express.Router();

const orderController = require('../controller/ordercontroller.js');
const authenticate = require('../middlware/authenticate.js');

router.post("/",authenticate,orderController.createOrder);
router.get("/user",authenticate,orderController.OrderHistory);
router.get("/:id",authenticate,orderController.findOrderById);

module.exports=router;