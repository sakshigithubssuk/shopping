const express = require('express');
const router = express.Router();

const adminController = require('../controller/adminOrderController.js');
const authenticate = require('../middlware/authenticate.js');

router.get("/",authenticate,adminController.getAllOrders);//first it call on / then go to authenticate if there is a token then a valid user it go to the next means reach at the gettallorders part
router.put('/orderId/confirmed',authenticate,adminController.confirmOrders);
router.put('/orderId/ship',authenticate,adminController.shippOrders);
router.put('/orderId/deliver',authenticate,adminController.deliverOrders);
router.put('/orderId/cancel',authenticate,adminController.cancelOrders);
router.put('/orderId/delete',authenticate,adminController.deleteOrders);

module.exports=router;