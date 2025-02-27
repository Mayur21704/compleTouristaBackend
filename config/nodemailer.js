// utils/nodemailer.js
import nodemailer from "nodemailer";

const sendResetPasswordEmail = async (userEmail, resetToken) => {
  // Set up the Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can also use other services like SendGrid, etc.
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASSWORD, // Your email password or app password
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`; // URL for the frontend reset page

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Password Reset Request",
    text: `You requested a password reset. Click the following link to reset your password: ${resetUrl}`,
    html: `<p>You requested a password reset. Click the following link to reset your password:</p><a href="${resetUrl}">Reset Password</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send password reset email.");
  }
};

export default sendResetPasswordEmail;
