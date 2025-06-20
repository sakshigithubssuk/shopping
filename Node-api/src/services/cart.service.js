// --- cart.service.js ---

const Cart = require("../model/cart.model");
const CartItem = require("../model/cartItem.model");
const Product = require("../model/product.model");

// Function to create a cart (seems okay, added improved error handling)
async function createCart(user) {
    console.log(`--- [Service: createCart] Entering for User ID: ${user ? user._id : 'undefined'} ---`);
    try {
        // Ensure user object/ID is valid before creating
        if (!user || !user._id) {
             throw new Error("Invalid user data provided to createCart.");
        }
        const cart = new Cart({ user: user._id }); // Store user ID
        const createdCart = await cart.save();
        console.log(`[Service: createCart] Cart created successfully. Cart ID: ${createdCart._id}`);
        console.log(`--- [Service: createCart] Exiting ---`);
        return createdCart;
    } catch (error) {
        console.error(`!!! [Service: createCart] ERROR for User ID: ${user ? user._id : 'undefined'} !!!`);
        console.error("[Service: createCart] Error:", error); // Log the full error
        // Re-throw the original error to preserve stack trace
        throw error;
    }
}

// Corrected function to find user cart and calculate totals
async function findUserCart(userId) {
    console.log(`--- [Service: findUserCart] Entering for User ID: ${userId} ---`);
    try {
        // 1. Find the cart and populate its items, and the product within each item
        console.log(`[Service: findUserCart] Attempting to find Cart for User ID: ${userId} and populate items/products...`);
        let cart = await Cart.findOne({ user: userId })
            .populate({
                path: 'cartItems', // Field name in Cart schema linking to CartItems
                populate: {
                    path: 'product' // Field name in CartItem schema linking to Product
                }
            });
            // .lean(); // Consider adding .lean() if you ONLY read data and don't need Mongoose docs

        // 2. Handle case where cart doesn't exist
        if (!cart) {
            console.log(`[Service: findUserCart] No cart found for User ID: ${userId}.`);
            // throw new Error(`Cart not found for user ${userId}.`);
            // OR: Return null or an empty-like structure if the calling code can handle it
            // Let's return null, and the calling code (createOrder) should check for this.
            console.log(`--- [Service: findUserCart] Exiting (Cart Not Found) ---`);
            return null;
        }

        console.log(`[Service: findUserCart] Cart found. ID: ${cart._id}. Calculating totals...`);

        // 3. Calculate totals (Corrected Logic)
        let totalPrice = 0;
        let totalDiscountedPrice = 0;
        let totalItem = 0; // Initialize count

        // Ensure cart.cartItems exists and is an array before iterating
        if (cart.cartItems && Array.isArray(cart.cartItems)) {
             for (const item of cart.cartItems) {
                 // Add checks: ensure item and item.product exist after population
                 if (item && item.product) {
                     totalPrice += item.price * item.quantity; // Price per item * quantity
                     totalDiscountedPrice += item.discountedPrice * item.quantity; // Discounted price * quantity
                     totalItem += item.quantity; // Sum up quantities
                 } else {
                      console.warn(`[Service: findUserCart] Skipping item due to missing data: ${JSON.stringify(item)}`);
                 }
             }
        } else {
             console.log(`[Service: findUserCart] Cart ${cart._id} has no cartItems to process.`);
        }


        // 4. Assign calculated totals to the cart object (These are NOT saved to DB here)
        cart.totalPrice = totalPrice;
        cart.totalItem = totalItem;
        cart.totalDiscountedPrice = totalDiscountedPrice;
        cart.discounte = totalPrice - totalDiscountedPrice; // Correct property name? Schema likely has 'discount'

        console.log(`[Service: findUserCart] Calculation complete. Total Price: ${totalPrice}, Total Items: ${totalItem}`);
        console.log(`--- [Service: findUserCart] Exiting (Success) ---`);
        return cart; // Return the cart object with populated items and calculated totals

    } catch (error) {
        console.error(`!!! [Service: findUserCart] ERROR for User ID: ${userId} !!!`);
        console.error("[Service: findUserCart] Error Name:", error.name);
        console.error("[Service: findUserCart] Error Message:", error.message);
        console.error("[Service: findUserCart] Error Stack:", error.stack);
        console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        // Re-throw the original error
        throw error;
    }
}


// Function to add item (added improved error handling)
async function addCartItem(userId, req) {
    console.log(`--- [Service: addCartItem] Entering for User ID: ${userId} ---`);
    console.log(`[Service: addCartItem] Request body: ${JSON.stringify(req)}`);
    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw new Error(`Cart not found for user ${userId}. Cannot add item.`);
        }
        if (!req.productId) {
             throw new Error("Product ID is missing in the request.");
        }
        const product = await Product.findById(req.productId);
        if (!product) {
            throw new Error(`Product not found with ID: ${req.productId}. Cannot add item.`);
        }

        const isPresent = await CartItem.findOne({ cart: cart._id, product: product._id, userId: userId, size: req.size }); // Check size too

        if (!isPresent) {
            console.log(`[Service: addCartItem] Item not present. Creating new CartItem.`);
            const cartItem = new CartItem({
                product: product._id,
                cart: cart._id,
                quantity: 1, // Default quantity
                userId: userId,
                price: product.price, // Price from product
                size: req.size,
                discountedPrice: product.discountedPrice // Discounted price from product
            });
            const createdCartItem = await cartItem.save();

            // Add reference to the Cart document
            cart.cartItems.push(createdCartItem._id); // Push the ID reference
            await cart.save(); // Save the parent Cart document

            console.log(`[Service: addCartItem] Item added successfully. CartItem ID: ${createdCartItem._id}`);
            console.log(`--- [Service: addCartItem] Exiting ---`);
            return createdCartItem; // Success message
        } else {
            console.log(`[Service: addCartItem] Item already present in cart. CartItem ID: ${isPresent._id}`);
             // Optionally: Update quantity instead of doing nothing?
             // isPresent.quantity += 1;
             // await isPresent.save();
             // return "Item quantity updated";
            console.log(`--- [Service: addCartItem] Exiting (Item already present) ---`);
             return isPresent; // Indicate item exists
        }
    } catch (error) {
        console.error(`!!! [Service: addCartItem] ERROR for User ID: ${userId} !!!`);
        console.error("[Service: addCartItem] Error:", error);
        // Re-throw original error
        throw error;
    }
}


module.exports = { createCart, findUserCart, addCartItem };