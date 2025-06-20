//delete function should be required

const CartItem = require("../model/cartItem.model.js");
const userService = require("../services/user.service.js");

async function updateCartItem(userId, cartItemId, cartItemData) {
  try {
      const item = await CartItem.findById(cartItemId);

      if (!item) {
          throw new Error(`CartItem not found with ID: ${cartItemId}`);
      }

      if (item.userId.toString() !== userId.toString()) {
          throw new Error("You can't update this cart item.");
      }

      const newQuantity = parseInt(cartItemData.quantity, 10);
      if (isNaN(newQuantity) || newQuantity < 0) {
          throw new Error("Invalid quantity provided. Quantity must be a non-negative number.");
      }

      if (newQuantity === 0) {
          await removeCartItem(userId, cartItemId);
          return { message: "Item removed from cart due to quantity 0." };
      }

      item.quantity = newQuantity;

      // Price recalculation removed - this was the source of NaN error

      const updatedItem = await item.save();
      return updatedItem;

  } catch (error) {
      console.error(`!!! [Service: updateCartItem] ERROR for Item ID: ${cartItemId} !!!`, error);
      throw error;
  }
}

async function removeCartItem(userId, cartItemId) {
 try {
      const result = await CartItem.findOneAndDelete({ _id: cartItemId, userId: userId });
      if (!result) {
          throw new Error(`CartItem not found with ID: ${cartItemId} for user ${userId}`);
      }
      // Optional: Update parent Cart document
      // await Cart.updateOne({ user: userId }, { $pull: { cartItems: cartItemId } });
      return { message: "Item removed successfully."};
 } catch (error) {
     console.error(`!!! [Service: removeCartItem] ERROR for Item ID: ${cartItemId} !!!`, error);
     throw error;
 }
}

// Example: findCartItemById if used (though not strictly necessary for the update fix)
async function findCartItemById(cartItemId) {
  const cartItem = await CartItem.findById(cartItemId).populate('product'); // Example
  if (!cartItem) {
      throw new Error(`CartItem not found by ID: ${cartItemId}`);
  }
  return cartItem;
}

async function removeCartItem(userId, cartItemId) {
  const cartItem = await findCartItemById(cartItemId);
  const user = await userService.findUserById(userId);

  if (user._id.toString() === cartItem.userId.toString()) {
    return await CartItem.findByIdAndDelete(cartItemId);
  }
  throw new Error("you cannot remove another users item");
}


module.exports = {
  updateCartItem,
  removeCartItem,
  findCartItemById,
};
