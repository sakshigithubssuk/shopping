const jwtProvider = require('../config/jwtProvider.js');
const userService = require('../services/user.service.js');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization; // Get header first for clarity
        if (!authHeader || !authHeader.startsWith('Bearer ')) { // Check format
            return res.status(401).send({ error: "Valid authorization token required (Bearer format)." });
        }

        const token = authHeader.split(" ")[1]; // Now safe to split

        const userId = jwtProvider.getUserIdFromToken(token); // Assuming this throws error on invalid token
        if (!userId) { // Or if it returns null/undefined on invalid
             return res.status(401).send({ error: "Invalid token." });
        }

        const user = await userService.findUserById(userId);
        if (!user) { // Check if user was found
             return res.status(404).send({ error: "User associated with token not found." });
        }

        req.user = user;
        next(); // Call next() ONLY if everything succeeded

    } catch (error) {
        // Catch errors from jwtProvider or userService
        console.error("Authentication Error:", error); // Log the actual error for debugging
        return res.status(401).send({ error: "Authentication failed." }); // Use 401 for general auth errors too
    }
    // Remove next() from here if it was outside the try/catch
}

module.exports = authenticate;