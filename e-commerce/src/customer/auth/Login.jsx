import { Button } from "@headlessui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../State/Auth/Action";

const Login = () => {
  const navigate=useNavigate();
  const dispatch = useDispatch();
 
  
  const handleSubmit=(event)=>{
  event.preventDefault();
  const data=new FormData(event.currentTarget);

  const userData ={
   
    email:data.get("email"),
    password:data.get("password")
  }
  dispatch(login(userData));
  console.log(userData)
  }
  return(
  <div className="flex items-center justify-center  " sx={{outerHeight:'8rem'}}>
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        
         
       
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
          LOGIN{" "}
        </button>{" "}
      </form>{" "}
      <div className="flex justify-center flex-col items-center">
        {" "}
          <div className="py-3 flex items-center">
           <p>if you have not account?</p> 
            <Button onClick={()=>navigate('/register')} className='ml-5 text-blue-500' size='small'>Register</Button>
          </div>
          </div>
  </div>
  </div>
  );
};

export default Login;
