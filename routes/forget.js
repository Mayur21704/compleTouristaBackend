// routes/authRoutes.js
import express from "express";
import { forgetPassword } from "../controllers/forget.js";

const router = express.Router();

router.post("/forgotPassword", forgetPassword);

export default router;
