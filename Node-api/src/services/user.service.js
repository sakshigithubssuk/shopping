const User = require("../model/user.model.js");
const bcrypt = require("bcrypt");
const jwtProvider = require("../config/jwtProvider.js");
const mongoose = require('mongoose');

const createUser = async (userData) => {
  try {
    let { firstName, lastName, email, password } = userData;

    if (!email || !password || !firstName || !lastName) {
        throw new Error("Missing required user data: firstName, lastName, email, or password");
    }

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      throw new Error(`User already exists with email: ${email}`);
    }

    password = await bcrypt.hash(password, 8);

    const user = await User.create({ firstName, lastName, email, password });

    return user;

  } catch (error) {
    console.error("Error in createUser:", error.message);
    throw error;
  }
};

const findUserById = async (userId) => {
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
         throw new Error(`Invalid user ID format: ${userId}`);
    }

    const user = await User.findById(userId);
        // .populate("address"); // If you need populate, uncomment this line

    if (!user) {
      throw new Error(`User not found with ID: ${userId}`);
    }
    return user;

  } catch (error) {
    console.error("Error in findUserById:", error.message);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
     if (!email) {
         throw new Error("Email must be provided to find user.");
     }

    const user = await User.findOne({ email });

    return user;

  } catch (error) {
    console.error("Error in getUserByEmail:", error.message);
    throw error;
  }
};

const getUserProfileByToken = async (token) => {
  try {
     // 1. Check if a token string was even passed in
     if (!token) {
        throw new Error("JWT token must be provided.");
     }
console.log("inside getuserProfile");
    const userId = jwtProvider.getUserIdFromToken(token);

     if (!userId) {
     
        throw new Error("Could not extract user ID from token.");
     }

  
    const user = await findUserById(userId); // Assumes findUserById throws if not found

    console.log("user",user);
    return user;

  } catch (error) {
  
    console.error("Error in getUserProfileByToken:", error.message); // Log the specific error message
    throw error; 
  }
};
const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.error("Error in getAllUsers:", error.message);
    throw error;
  }
};

module.exports = {
  createUser,
  findUserById,
  getUserByEmail,
  getUserProfileByToken,
  getAllUsers,
};