const {default:mongoose} =require("mongoose");
const mondbUrl ="mongodb+srv://sakshikug22ec:aadsi@cluster0.76z25fw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectDb =()=>{
  return mongoose.connect(mondbUrl);
}
module.exports={connectDb}