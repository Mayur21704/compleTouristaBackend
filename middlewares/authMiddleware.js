import jwt from "jsonwebtoken";

// Middleware to verify JWT
export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from Authorization header

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.userId = decoded.uid; // Attach user information (uid) to request
    next(); // Proceed to the next middleware/route handler
  });
};
