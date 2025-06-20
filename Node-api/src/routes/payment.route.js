const express = require('express');
const authenticate = require('../middlware/authenticate.js')

const router = express.Router();

const paymentcontroller = require('../controller/paymentController.js');

router.post("/:id",authenticate,paymentcontroller.createPaymentLink);
router.get("/",authenticate,paymentcontroller.updatePaymentInformation);

module.exports=router;