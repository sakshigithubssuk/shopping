import React from 'react';
import frontpage3 from '../../../assets/frontpage3.jpeg';
import './ProductCard.css'
import { useNavigate } from 'react-router-dom';
const ProductCard = ({product}) => {
  const navigate = useNavigate();
  return (
    <div onClick={()=>navigate(`/product/${product?._id}`)}className="productCard w-[15rem] m-3 transition-all cursor-pointer border rounded-lg shadow-md"> {/* Added border, rounded corners, and shadow */}
      <div className="h-[20rem]">
        <img className="h-full w-full object-cover object-center" src={product.imageUrl} alt="" /> 
      </div>
      <div className="textPart bg-white p-3">
        <div>
          <p className="font-bold opacity-60 text-gray-600">{product.brand}</p> {/* Added text color */}
          <p className="text-lg font-medium">{product.title}</p> {/* Adjusted font size and weight */}
        </div>
        <div className="flex items-center space-x-2 mt-2"> {/* Added margin top */}
          <p className="font-semibold text-xl text-red-600">{product.discountPrice}</p> {/* Adjusted font size and color */}
          <p className="line-through opacity-50 text-gray-500">{product.price}</p> {/* Added text color */}
          <p className="text-green-600 font-semibold">{product.discountPresent}% OFF</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;