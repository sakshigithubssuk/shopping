const orderService = require('../services/order.service.js');

const createOrder = async(req,res)=>{
const user= await req.user;
try{
let createdOrder=await orderService.createOrder(user,req.body);
return res.status(201).send(createdOrder);
}catch(error){
return res.status(500).send({error:error.message});
}
}

const findOrderById = async(req,res)=>{
  const orderId =req.params.id;
  try{
  let findOrder=await orderService.findOrderById(orderId);
  return res.status(201).send(findOrder);
  }catch(error){
  return res.status(500).send({error:error.message});
  }
  }
  const OrderHistory = async(req,res)=>{
    const user= await req.user;
    try{
    let ordershistory=await orderService.userOrderHistory(user._id);
    return res.status(201).send(ordershistory);
    }catch(error){
    return res.status(500).send({error:error.message});
    }
    }
  module.exports={
    createOrder,
    findOrderById,
    OrderHistory,
  }
