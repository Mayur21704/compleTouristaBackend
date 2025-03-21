import jwt from "jsonwebtoken"; // Assuming you're using JWT for authentication
import User from "../models/user.js"; // Adjust path as needed

export const isAdmin = async (req, res, next) => {
  try {
    // Assuming you send a token in the Authorization header
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure to use your JWT secret

    const user = await User.findOne({ uid: decoded.uid }); // Find user by 'uid'

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied, admin only" });
    }

    req.user = user; // Add user data to the request for later use
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
