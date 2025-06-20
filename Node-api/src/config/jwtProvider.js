const jwt = require("jsonwebtoken");

const SECRET_KEY = "jnasiuywhebruytyfghfytrujasjlkdiua0z9ujknwejhyiuyejhwjweui";

const generateToken = (userId) => {
    const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "48h" });
    return token;
};

const getUserIdFromToken = (token) => {
    console.log("inside getuseridfrom token");
    const decodedToken = jwt.verify(token, SECRET_KEY);
    console.log("decodetoken",decodedToken);
    return decodedToken.userId;
};

module.exports = { generateToken, getUserIdFromToken };