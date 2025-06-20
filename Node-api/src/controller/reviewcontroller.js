const ReviewService = require('../services/review.service.js');

const createReview=async(req,res)=>{
  const user = req.user;
  try{
const review = await ReviewService.createReview(req.body,user);
return res.status(201).send(review);
  }catch(error){
return res.status(500).send({error:error.message});
  }
}

const getALlReview=async(req,res)=>{
  const productId = req.params.productId;
  try{
const review = await ReviewService.getAllReview(productId);
return res.status(201).send(review);
  }catch(error){
return res.status(500).send({error:error.message});
  }
}

module.exports={
  createReview,
  getALlReview,
}
