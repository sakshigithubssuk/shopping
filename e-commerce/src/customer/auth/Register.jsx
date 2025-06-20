import { Button } from "@headlessui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUser, register } from "../../State/Auth/Action.js";
import { store } from "../../State/store.js";
const Register = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
const jwt = localStorage.getItem("jwt");
const {auth} = useSelector(store=>store);
  useEffect(()=>{
    if(jwt){
      dispatch(getUser(jwt))
    }
    
  },[jwt,auth.jwt])
  const handleSubmit=(event)=>{
  event.preventDefault();
  const data=new FormData(event.currentTarget);

  const userData ={
    firstName:data.get("firstName"),
    lastName:data.get('lastName'),
    email:data.get("email"),
    password:data.get("password")
    
  }
  dispatch(register(userData));
  console.log(userData)
  }
  return(
  <div className="flex items-center justify-center  " sx={{outerHeight:'8rem'}}>
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold text-center mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            name='firstName'
            placeholder="First Name *"
            className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />{" "}
          <input
            type="text"
            name='lastName'
            placeholder="Last Name *"
            className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />{" "}
        </div>{" "}
        <div className="mb-4">
          {" "}
          <input
            type="email"
            name='email'
            placeholder="Email *"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />{" "}
        </div>{" "}
        <div className="mb-4">
          {" "}
          <input
            type="password"
            name='password'
            placeholder="Password *"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />{" "}
        </div>{" "}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          {" "}
          REGISTER{" "}
        </button>{" "}
      </form>{" "}
    
    <div className="flex justify-center flex-col items-center">
    {" "}
      <div className="py-3 flex items-center">
       <p>if you have already account?</p> 
        <Button onClick={()=>navigate('/login')} className='ml-5 text-blue-500' size='small'>Login</Button>
      </div>
      </div>
      </div>
    </div>
   
  );
};

export default Register;
