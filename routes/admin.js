import express from "express";
import {
  getUsers,
  overallAnalytics,
  userAnalytics,
} from "../controllers/admin.js";
import { isAdmin } from "../middlewares/adminMiddleware.js"; // Your isAdmin middleware

const router = express.Router();

// Get all users (only accessible by admins) /admin/
router.get("/overview", isAdmin, overallAnalytics);

// Delete a user (only accessible by admins)
router.get("/analytics", isAdmin, userAnalytics);

router.get("/users", isAdmin, getUsers);

export default router;
