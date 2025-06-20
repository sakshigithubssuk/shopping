const express = require('express');
const router = express.Router();

const cartItemController = require('../controller/cartItemcontroller.js')
const authenticate = require('../middlware/authenticate.js');
router.put("/:id",authenticate,cartItemController.updateCartItem);
router.delete("/:id",authenticate,cartItemController.removeCartItem);
module.exports=router;