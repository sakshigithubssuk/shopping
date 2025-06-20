const express = require('express');
const router = express.Router();

const productController= require('../controller/productcontroller.js');
const authenticate = require('../middlware/authenticate.js');

router.post("/",authenticate,productController.createProduct);
router.post("/creates",authenticate,productController.createMultipleProduct);
router.delete("/:id",authenticate,productController.deleteProduct);
router.put("/:id",authenticate,productController.updateProduct);

module.exports=router;
