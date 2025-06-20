import React from 'react';
// Removed unused import: front4
import { IconButton, Button as MuiButton } from '@mui/material'; // Import MUI Button and alias it
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
// Removed unused import: Button from headlessui
// Removed unused import: color from filterData
import { useDispatch } from 'react-redux';
import { removeCartItem, updateCartItem } from '../../../State/Cart/Action.js'; // Correct action imports

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  // This function handles increasing/decreasing quantity
  const handleUpdateCartItem = (num) => {
    // Prevent decreasing below 1 (already handled by disabled prop, but good to double-check)
    if (item.quantity + num < 1) {
      return;
    }
    const data = { data: { quantity: item.quantity + num }, cartItemId: item?._id };
    dispatch(updateCartItem(data));
  };

 // Inside CartItem.jsx -> handleRemoveCartItem
const handleRemoveCartItem = () => {
  if (item?._id) {
      console.log("Dispatching removeCartItem with ID:", item._id); // LOG ID
      dispatch(removeCartItem(item._id));
  } else {
      console.error("CartItem ID is missing, cannot remove item.");
  }
};
  // Basic check if item or item.product exists
  if (!item || !item.product) {
      // Optionally return null or a placeholder/error message
      console.warn("CartItem received invalid item prop:", item);
      return null;
  }


  return (
    <div className='p-5 shadow-lg border rounded-lg'>
      <div className='flex items-center'>
        <div className='w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem] flex-shrink-0'> {/* Added flex-shrink-0 */}
          <img
            className="w-full h-full object-cover object-top"
            src={item.product.imageUrl} // Use imageUrl from item prop
            alt={item.product.title || "Product image"} // Add alt text
          />
        </div>
        <div className='ml-5 space-y-1'>
          <p className='font-semibold'>{item.product.title}</p>
          {/* Ensure size and color exist */}
          <p className='opacity-70 text-sm'> {/* Made text smaller */}
            Size: {item.size}{item.product.color ? `, ${item.product.color}` : ''}
          </p>
          <p className='opacity-70 mt-2 text-sm'>{item.product.brand}</p>

          <div className='flex space-x-3 items-center mt-2 text-gray-900 pt-2'> {/* Adjusted spacing/padding */}
             {/* Ensure price properties exist */}
            <p className='font-semibold text-lg'>₹{item.discountedPrice ?? item.price ?? 'N/A'}</p> {/* Show discounted first */}
            {item.discountedPrice != null && item.price != null && item.discountedPrice !== item.price && (
              <p className='opacity-50 line-through'>₹{item.price}</p>
            )}
            {/* Corrected typo: discountPersent -> discountPercent (assuming) */}
             {item.discountPercent != null && item.discountPercent > 0 && (
               <p className='text-green-600 font-semibold'>{item.discountPercent}% off</p>
             )}
          </div>
        </div>
      </div>

      {/* Quantity Controls and Remove Button */}
      <div className='flex items-center justify-between pt-4'> {/* Use justify-between */}
        <div className='flex items-center space-x-2 '>
          <IconButton
            sx={{ color: "RGB(145 85 253)" }}
            onClick={() => handleUpdateCartItem(-1)}
            disabled={item.quantity <= 1} // Disable if quantity is 1 or less
            aria-label="decrease quantity"
          >
            <RemoveCircleOutlineIcon />
          </IconButton>

          {/* Display quantity */}
          <span className='py-1 px-5 border rounded-sm'>{item.quantity}</span>

          <IconButton
            sx={{ color: "RGB(145 85 253)" }}
            onClick={() => handleUpdateCartItem(1)}
            aria-label="increase quantity"
            // Optionally disable based on stock: disabled={item.quantity >= item.product.stock}
          >
            <ControlPointIcon />
          </IconButton>
        </div>

        {/* --- CORRECTED Remove Button --- */}
        <div>
          <MuiButton // Use MUI Button
            onClick={handleRemoveCartItem} // Correctly calls the function
            variant="text" // Use text variant for less emphasis
            sx={{ color: "red", fontWeight: 'medium' }} // Style directly or use Tailwind
             // className="text-red-600 font-medium" // Alternative Tailwind styling
          >
            Remove
          </MuiButton>
        </div>
      </div>
    </div>
  );
}

export default CartItem;