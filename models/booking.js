import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true, // Make it optional
    },
    email: {
      type: String,
      required: true, // Make it optional
    },
    selectedFlights: {
      type: Object,
      required: true,
    },
    passengers: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    ticketUrl: {
      type: String,
      required: true,
    },
    cancellationDate: {
      type: Date, 
      default: null,
    },
    refundStatus: {
      type: String,
      enum: ["pending", "processed", "failed"],
      default: "pending", 
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
