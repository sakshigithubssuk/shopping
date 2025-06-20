const express = require('express');
const router = express.Router();

const Cartcontroller = require('../controller/cartcontroller.js');
const authenticate = require('../middlware/authenticate.js');

router.get("/",authenticate,Cartcontroller.findUserCart);
router.put("/add",authenticate,Cartcontroller.addItemToCart);
module.exports=router;