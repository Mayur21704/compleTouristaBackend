// routes/bookingRoutes.js
import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createHotelBooking } from "../controllers/hotelBooking.js";

const router = express.Router();

// Route to create a booking
router.post("/createhotel", verifyToken, createHotelBooking);

export default router;
