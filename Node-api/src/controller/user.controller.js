const userservice = require('../services/user.service');

const getUserProfile = async (req, res) => {
  const authHeader = req.headers.authorization;
  const jwt = authHeader?.split(" ")[1]; // Corrected split by space
  console.log("jwt",jwt);
    try {
        
       

        if (!jwt) {
            return res.status(404).send({ error: "token not found" });
        }

        const user = await userservice.getUserProfileByToken(jwt);
        return res.status(200).send(user);
    } catch (error) {
        console.error("Error getting user profile:", error); // Added logging
        return res.status(500).send({ error: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await userservice.getAllUsers();
        return res.status(200).send(users);
    } catch (error) {
        console.error("Error getting all users:", error); // Added logging
        return res.status(500).send({ error: error.message });
    }
}

module.exports = { getAllUsers, getUserProfile };