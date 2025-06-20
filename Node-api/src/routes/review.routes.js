const express = require('express');
const router = express.Router();

const reviewController = require('../controller/reviewcontroller.js');
const authenticate = require('../middlware/authenticate.js');
router.post("/create",authenticate,reviewController.createReview);
router.get("/product/:productId",authenticate,reviewController.getALlReview);
module.exports=router;