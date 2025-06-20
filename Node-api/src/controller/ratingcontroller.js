const RatingService = require('../services/rating.service.js');

const createRating=async(req,res)=>{
  const user = req.user;
  try{
const review = await RatingService.createRating(req.body,user);
return res.status(201).send(review);
  }catch(error){
return res.status(500).send({error:error.message});
  }
}

const getALlRatings=async(req,res)=>{
  const productId = req.params.productId;
  try{
const review = await RatingService.getProductRating(productId);
return res.status(201).send(review);
  }catch(error){
return res.status(500).send({error:error.message});
  }
}

module.exports={
  createRating,
  getALlRatings,
}
