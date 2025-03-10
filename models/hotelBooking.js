import mongoose from "mongoose";
const Schema = mongoose.Schema;

const hotelBookingSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true, 
    },
    selectedRoomWithHotel: {
      type: Object,
      required: true,
    },
    guests: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const HotelBooking = mongoose.model("HotelBooking", hotelBookingSchema);
export default HotelBooking;
