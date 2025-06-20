const express = require("express")

const cors = require("cors")
 const app = express()
 app.use(express.json())
 app.use(cors())//everyone can access frontend part
 app.get("/",(req,res)=>{
  return res.status(200).send({message:"Welcome to ecommerce api-node",status:true})
 })

 const authRouters = require('./routes/auth.route.js');
 const userRouters = require('./routes/user.route.js');
 app.use("/auth",authRouters);
 app.use("/api/users",userRouters);

 const productRouter = require('./routes/product.routes.js');
 app.use("/api/products",productRouter);

 const adminProductRouter = require('./routes/adminproduct.route.js');
 app.use("/api/admin/products",adminProductRouter);

 const cartRouter = require('./routes/cart.route.js');
 app.use("/api/cart",cartRouter);

 const cartItemRouter = require('./routes/cartItem.route.js');
 app.use("/api/cart_items",cartItemRouter);

 const orderRouter = require('./routes/order.routes.js');
 app.use("/api/orders",orderRouter);

 const adminOrderRouter = require('./routes/adminorder.route.js');
 app.use('/api/admin/orders',adminOrderRouter);
 
 const reviewRouter = require('./routes/review.routes.js');
 app.use('/api/reviews',reviewRouter);

 const ratingRouter = require('./routes/review.routes.js');
 app.use('/api/ratings',ratingRouter);

const paymentRouter = require("./routes/payment.route.js");
app.use("/api/payments",paymentRouter);
module.exports=app;
