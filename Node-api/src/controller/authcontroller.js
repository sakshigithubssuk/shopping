const userservice = require('../services/user.service.js');
const jwtProvider = require('../config/jwtProvider.js');
const cartService = require('../services/cart.service.js');
const bcrypt = require('bcrypt');
const register=async(req,res)=>{
try{
const user = await userservice.createUser(req.body);
const jwt = jwtProvider.generateToken(user._id);

await cartService.createCart(user);
return res.status(200).send({jwt,message:"register Successfull"});
}catch(error){
return res.status(500).send({error:error.message});
}
}

const login = async(req,res)=>{
const{password,email}=req.body;
try{
const user = await userservice.getUserByEmail(email);
if(!user){
  return res.status(404).send({message:"user not found with email",email});
}
const isPasswordValid= await bcrypt.compare(password,user.password);//password,hashpassword
if(!isPasswordValid){
  return res.status(401).send({message:"Invalid Password try again"});
}
if (!email || !password) {
  return res.status(400).send({ message: "Email and password are required." });
}
const jwt = jwtProvider.generateToken(user._id);
return res.status(200).send({jwt,message:"login successfull"})
}
catch(error){
  return res.status(500).send({error:error.message});
}
}
module.exports={register,login};