const express = require('express');
const router = express.Router();

const productController= require('../controller/productcontroller.js');
const authenticate = require('../middlware/authenticate.js');

router.get("/",authenticate,productController.getAllProducts);
router.get("/id/:id",authenticate,productController.findProductById);

module.exports=router;