import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    photoURL: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    password: {
      type: String, // Password field for email/password sign-in
      required: false, // Only required for email/password sign-up
    },
    resetToken: String, // Field to store the reset token
    resetTokenExpiration: Date, // Field to store token expiration time
    isAdmin: {
      type: Boolean,
      default: false, // Set to false by default
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Hash password before saving it to the database (for email/password sign-up)
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    // Hash the password only if it's a new user or the password has been modified
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
      console.log(this.password);
    }
  }
  next();
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Create a model for the User schema
const User = mongoose.model("User", userSchema);

export default User;
