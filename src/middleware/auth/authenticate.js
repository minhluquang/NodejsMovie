require("dotenv").config();
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Assumes the token is sent as Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Access denied, token missing!" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodes the token and gets user info (userId, role, etc.)
    req.user = decoded; // Attach user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token!" });
  }
};

module.exports = { authenticate };
