import express from "express";
import {
  registerUser,
  loginUser,
  googleLogin,
} from "../controllers/authController.js";

const router = express.Router();

// Route for registering a user (both email/password and Google)
router.post("/register", registerUser);

// Route for logging in a user (both email/password and Google)
router.post("/signIn", loginUser);

router.post("/signInwithGoogle", googleLogin);

export default router;
