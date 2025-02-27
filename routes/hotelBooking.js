// routes/bookingRoutes.js
import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createHotelBooking } from "../controllers/hotelBooking.js";

const router = express.Router();

// Route to create a booking
router.post("/createhotel", verifyToken, createHotelBooking);

// Route to get all bookings for a user
// router.get("/:userId", verifyToken, getUserBookings);

export default router;
