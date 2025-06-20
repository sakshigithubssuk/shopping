import { ADD_ITEM_TO_CART_FAILURE, ADD_ITEM_TO_CART_REQUEST, ADD_ITEM_TO_CART_SUCCESS, GET_CART_FAILURE, GET_CART_REQUEST, GET_CART_SUCCESS, REMOVE_CART_ITEM_FAILURE, REMOVE_CART_ITEM_REQUEST, REMOVE_CART_ITEM_SUCCESS, UPDATE_CART_ITEM_FAILURE, UPDATE_CART_ITEM_REQUEST, UPDATE_CART_ITEM_SUCCESS } from "./ActionType"
import {api} from '../../config/apiconfig.js';
export const getCart=()=>async(dispatch)=>{
  dispatch({type:GET_CART_REQUEST})
  try{
    const {data}=await api.get("/api/cart")
    dispatch({type:GET_CART_SUCCESS,payload:data})
    console.log("cart",data)
    }
    catch(error){
  dispatch({type:GET_CART_FAILURE,payload:error.message})
    }
}
export const  addItemToCart=(reqData)=>async(dispatch)=>{
  dispatch({type:ADD_ITEM_TO_CART_REQUEST})
  try{
  const {data}=await api.put("/api/cart/add",reqData)
  dispatch({type:ADD_ITEM_TO_CART_SUCCESS,payload:data})
  }
  catch(error){
dispatch({type:ADD_ITEM_TO_CART_FAILURE,payload:error.message})
  }
 }

 export const removeCartItem = (cartItemId) => async (dispatch) => { // Takes cartItemId directly now based on CartItem.jsx change
  dispatch({ type: REMOVE_CART_ITEM_REQUEST });
  try {
      if (!cartItemId) {
          throw new Error("cartItemId is required for removal");
      }

      // *** ADJUST THIS URL TO MATCH YOUR BACKEND DELETE ROUTE ***
      const apiUrl = `/api/cart_items/${cartItemId}`;
      // const apiUrl = `/api/cart/items/${cartItemId}`; // Another possibility

      console.log(`Attempting DELETE request to: ${apiUrl}`); // Log the URL

      // The second argument to api.delete is usually config, not data. Data is not sent in DELETE body typically.
      const { data } = await api.delete(apiUrl);

      // Payload should ideally be the ID of the removed item for the reducer
      dispatch({ type: REMOVE_CART_ITEM_SUCCESS, payload: cartItemId });
      console.log("Removed item, ID:", cartItemId, "Response:", data); // Log response too

      // Re-fetch the cart to update the UI is often the simplest approach after delete
      dispatch(getCart());

  } catch (error) {
      console.error("Error removing cart item:", error.response || error.message || error);
      dispatch({ type: REMOVE_CART_ITEM_FAILURE, payload: error.response?.data?.message || error.message || 'Failed to remove item' });
  }
};
 export const updateCartItem = (reqData) => async (dispatch) => {
  dispatch({ type: UPDATE_CART_ITEM_REQUEST });
  try {
    const cartItemId = reqData.cartItemId;
    const updateData = reqData.data;
    if (!cartItemId || !updateData) throw new Error("cartItemId and data are required");

    console.log(`Sending PUT request to: /api/cart_items/${cartItemId}`); // Log the exact URL

    // *** ADJUST THIS URL TO MATCH YOUR BACKEND ***
    const { data } = await api.put(`/api/cart_items/${cartItemId}`, updateData);
    // const { data } = await api.put(`/api/cart/items/${cartItemId}`, updateData); // Another possible backend path

    dispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: data });
    console.log("Updated item, response data:", data);
    // Consider re-fetching cart if response doesn't contain the full updated cart
    // dispatch(getCart());
  } catch (error) {
    console.error("Error updating cart item:", error.response || error.message || error);
    dispatch({ type: UPDATE_CART_ITEM_FAILURE, payload: error.response?.data?.message || error.message || 'Failed to update item' });
  }
};