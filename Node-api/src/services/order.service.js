// --- services/order.service.js ---

// Make sure all necessary models and services are required
const Address = require("../model/address.model");
const CartItem = require("../model/cartItem.model"); // Needed if cart.cartItems structure relies on it
const Product = require("../model/product.model"); // Needed for populate later?
const cartService = require("../services/cart.service.js");
const Order = require("../model/order.model.js");
const OrderItem = require("../model/orderitem.js");
const User = require("../model/user.model"); // Ensure User model is required if needed for type checks etc.

async function createOrder(user, shippAddress) {
  // --- DEBUG: Log entry and initial data ---
  console.log('--- [Service: createOrder] Entering ---');
  console.log('[Service: createOrder] User ID:', user ? user._id : 'USER IS UNDEFINED!');
  console.log('[Service: createOrder] Received shippAddress:', JSON.stringify(shippAddress));
  // --- End DEBUG ---

  // Check if user object is valid before proceeding
  if (!user || !user._id) {
      console.error("!!! [Service: createOrder] CRITICAL: User object is invalid or missing _id at the start.");
      throw new Error("User data is invalid in createOrder service.");
  }

  let address;

  if (shippAddress._id) {
    console.log(`[Service: createOrder] Finding existing address by ID: ${shippAddress._id}`);
    let existAddress = await Address.findById(shippAddress._id);
    address = existAddress;
    if (!address) {
        console.error(`!!! [Service: createOrder] Address with ID ${shippAddress._id} not found.`);
        throw new Error(`Address with ID ${shippAddress._id} not found.`);
    }
  } else {
    console.log('[Service: createOrder] Creating new address.');
    address = new Address(shippAddress);
    // --- DEBUG: Check user before assigning ---
    console.log('[Service: createOrder] Assigning user to new address - User ID:', user._id);
    address.user = user._id; // Assign only the ID if that's what your schema expects

    console.log('[Service: createOrder] Attempting new address.save()');
    await address.save();
    console.log('[Service: createOrder] New address saved. ID:', address._id);

    // --- DEBUG: Check user.address before push ---
    console.log('[Service: createOrder] Checking user.address before push.');
    console.log('[Service: createOrder] Type of user.address:', typeof user.address);
    console.log('[Service: createOrder] Is user.address an Array?:', Array.isArray(user.address));
    // --- End DEBUG ---

    // Ensure user.address is an array before pushing
    if (!Array.isArray(user.address)) {
        console.warn(`[Service: createOrder] user.address was not an array (${typeof user.address}). Initializing.`);
        // Depending on your User model, you might need to fetch the user again if 'address' wasn't populated
        // Or, if the object is live, you might be able to initialize it (less safe):
        // user.address = []; // Or handle as per your model structure
        // For safety, let's throw an error if it's not initially an array from the middleware/DB
         throw new Error("User object does not have address array initialized correctly.");
    }

    console.log('[Service: createOrder] Attempting user.address.push()');
    user.address.push(address._id); // Push only the ID if that's what your schema expects

    console.log('[Service: createOrder] Attempting user.save()');
    await user.save();
    console.log('[Service: createOrder] User saved with new address.');
  }

  console.log(`[Service: createOrder] Finding user cart for User ID: ${user._id}`);
  const cart = await cartService.findUserCart(user._id);
  if (!cart) {
      console.error(`!!! [Service: createOrder] Cart not found for user ${user._id}.`);
      throw new Error(`Cart not found for user ${user._id}. Cannot create order.`);
  }
   if (!cart.cartItems || cart.cartItems.length === 0) {
      console.error(`!!! [Service: createOrder] Cart is empty for user ${user._id}.`);
      throw new Error(`Cart is empty for user ${user._id}. Cannot create order.`);
  }
  console.log('[Service: createOrder] Cart found. Processing cart items.');

  const orderItems = [];
  for (const item of cart.cartItems) {
  
    if (!item.product) {
        console.error("!!! [Service: createOrder] Cart item is missing product details:", item);
        throw new Error("Invalid cart item found: missing product details.");
    }

    const orderItem = new OrderItem({
      price: item.price,
      product: item.product, // Ensure item.product contains the necessary Product reference (e.g., _id)
      quantity: item.quantity,
      size: item.size,
      userId: user._id, // Use the main user ID
      discountedPrice: item.discountedPrice,
    });

    const createdOrderItems = await orderItem.save();
    orderItems.push(createdOrderItems); // Push the saved OrderItem document
  }
  console.log(`[Service: createOrder] ${orderItems.length} OrderItems created.`);

  const createdOrder = new Order({
    user: user._id, // Store user ID
    orderItems: orderItems.map(item => item._id), // Store array of OrderItem IDs
    totalPrice: cart.totalPrice,
    totalDiscountedPrice: cart.totalDiscountedPrice,
    discounte: cart.discounte,
    totalItem: cart.totalItem,
    shippingAddress: address._id, // Store address ID
    orderStatus: "PENDING", // Start with a pending status
    paymentDetails: { status: "PENDING" } // Initialize payment details
    // Add deliveryDate, createdAt etc. as needed by your schema defaults
  });

  console.log('[Service: createOrder] Attempting createdOrder.save()');
  const savedOrder = await createdOrder.save();
  console.log('[Service: createOrder] Order saved successfully. Order ID:', savedOrder._id);
  console.log('--- [Service: createOrder] Exiting ---');


  return savedOrder; // Return the newly saved order document
}

// --- Other Service Functions (Keep as they were, findOrderById is used above) ---

async function findOrderById(orderId) {
  // Make sure paths match your Order Schema
  const order = await Order.findById(orderId)
    .populate("user") // Populate user details if needed
    .populate({
        path: "orderItems",
        populate: { path: "product" } // Populate product within orderItems
    })
    .populate("shippingAddress"); // Populate shipping address details
  if (!order) {
      throw new Error(`Order not found with ID: ${orderId}`);
  }
  return order;
}

// ... include all other exported functions: placeOrder, confirmOrder, etc. ...
// Make sure they use findOrderById which includes error handling if order not found
async function placeOrder(orderId) {
  const order = await findOrderById(orderId); // Uses the enhanced findOrderById
  order.orderStatus = "PLACED";
  order.paymentDetails.status = "COMPLETED"; // Assuming placing means payment is done
  return await order.save();
}

async function confirmOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "CONFIRMED";
  return await order.save();
}

async function shippedOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "SHIPPED";
  // Add tracking details here if applicable
  return await order.save();
}
async function DeliverOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "DELIVERED";
  // Update delivered timestamp
  return await order.save();
}
async function cancelOrder(orderId) {
  const order = await findOrderById(orderId);
  // Add logic here: Can only cancel if not shipped? Refund logic?
  order.orderStatus = "CANCELLED";
  return await order.save();
}

async function userOrderHistory(userId) {
  try {
    // Consider adding sorting, pagination
    const orders = await Order.find({ user: userId /* , orderStatus: "PLACED" */ }) // Maybe show all statuses?
      .populate({ path: "orderItems", populate: { path: "product" } })
      .populate("shippingAddress")
      .sort({ createdAt: -1 }) // Sort newest first
      .lean(); // Use lean for read-only history
    return orders;
  } catch (error) {
    console.error("Error fetching user order history:", error);
    throw new Error(error.message);
  }
}

async function getAllOrder() {
  // Consider adding sorting, pagination, filtering
  return await Order.find()
    .populate("user", "firstName lastName email") // Populate specific user fields
    .populate({ path: "orderItems", populate: { path: "product", select: "title brand" } }) // Specific fields
    .populate("shippingAddress")
    .sort({ createdAt: -1 })
    .lean(); // Use lean for read-only admin view
}
async function deleteOrder(orderId) {
  // Consider implications: Should orders be truly deleted? Or just marked inactive?
  const order = await findOrderById(orderId); // Check if exists first
  await Order.findByIdAndDelete(order._id);
  // Maybe delete related OrderItems too?
}


module.exports = {
  createOrder,
  placeOrder,
  confirmOrder,
  shippedOrder,
  DeliverOrder,
  cancelOrder,
  findOrderById,
  userOrderHistory,
  getAllOrder,
  deleteOrder,
};