import express from "express";
import { createPayment } from "../controllers/payment.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST request to create a Stripe Checkout session
router.post("/create", verifyToken, createPayment);

export default router;
