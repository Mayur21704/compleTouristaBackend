import User from "../models/user.js"; // Import your user model
import crypto from "crypto"; // To generate a token
import sendResetPasswordEmail from "../config/nodemailer.js";

export const forgetPassword = async (req, res) => {
  const {
    email: { email },
  } = req.body; // Assumes email is directly passed in body

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save the reset token and its expiration time to the user model
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send the reset email
    await sendResetPasswordEmail(user.email, resetToken);

    return res.status(200).json({ message: "Password reset link sent!" });
  } catch (error) {
    console.error("Error occurred during forgotPassword route:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
