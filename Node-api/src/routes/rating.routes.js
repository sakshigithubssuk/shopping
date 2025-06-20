const express = require('express');
const router = express.Router();

const ratingController= require('../controller/ratingcontroller.js');
const authenticate = require('../middlware/authenticate.js');

router.post("/create",authenticate,ratingController.createRating);
router.put("/product/:productId",authenticate,ratingController.getALlRatings);

module.exports=router;