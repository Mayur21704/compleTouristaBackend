// routes/bookingRoutes.js
import express from "express";
import {
  createBooking,
  getUserBookings,
  cancelBooking,
} from "../controllers/bookingController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to create a booking
router.post("/create", verifyToken, createBooking);

// Route to get all bookings for a user
router.get("/:userId", verifyToken, getUserBookings);

router.post("/cancel/:bookingId", verifyToken, cancelBooking);

export default router;
