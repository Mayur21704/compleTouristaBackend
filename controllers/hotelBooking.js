import Booking from "../models/hotelBooking.js";
import User from "../models/user.js";
import nodemailer from "nodemailer";

export const createHotelBooking = async (req, res) => {
  try {
    const { selectedRoomWithHotel, guests, userId: uid } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "userId is required." });
    }

    const user = await User.findOne({ uid: uid });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Step 2: Save the booking with the selected room and hotel
    const newBooking = new Booking({
      userId: uid,
      selectedRoomWithHotel,
      guests,
      status: "confirmed",
      createdAt: Date.now(),
    });

    await newBooking.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const guestDetails = guests.adults[0];

    // Prepare the email content
    const emailHtml = `
  <h1>Booking Confirmation</h1>
  <p>Dear ${guestDetails.firstName} ${guestDetails.lastName},</p>
  <p>Your booking at <strong>${
    selectedRoomWithHotel.hotel.name
  }</strong> has been confirmed.</p>
  
  <h3>Hotel Details:</h3>
  <p><strong>Hotel:</strong> ${selectedRoomWithHotel.hotel.name}</p>
  <p><strong>Hotel Address:</strong> ${
    selectedRoomWithHotel.hotel.address || "Address not available"
  }</p>
  <p><strong>Location:</strong> ${
    selectedRoomWithHotel.hotel.geoCode.latitude
  }, ${selectedRoomWithHotel.hotel.geoCode.longitude}</p>
  <p><a href="https://www.openstreetmap.org/?mlat=${
    selectedRoomWithHotel.hotel.geoCode.latitude
  }&mlon=${selectedRoomWithHotel.hotel.geoCode.longitude}#map=15/${
      selectedRoomWithHotel.hotel.geoCode.latitude
    }/${
      selectedRoomWithHotel.hotel.geoCode.longitude
    }" target="_blank">View on OpenStreetMap</a></p>
  
  <h3>Room Details:</h3>
  <p><strong>Room Type:</strong> ${selectedRoomWithHotel.room.roomType}</p>
  <p><strong>Bed Type:</strong> ${selectedRoomWithHotel.room.bedType}</p>
  <p><strong>Room Size:</strong> ${selectedRoomWithHotel.room.roomSize}</p>
  <p><strong>Highlights:</strong> ${selectedRoomWithHotel.room.highlights.join(
    ", "
  )}</p>

  <h3>Booking Details:</h3>
  <p><strong>Booking Date:</strong> ${new Date(
    newBooking.createdAt
  ).toLocaleDateString()}</p>
  <p><strong>Total Guests:</strong> ${
    guests.adults.length + (guests.children?.length || 0)
  }</p>
  
  <h3>Price Breakdown:</h3>
  <p><strong>Room Charges:</strong> ₹${
    selectedRoomWithHotel.offer.price.discounted
  }</p>
  <p><strong>Taxes & Fees:</strong> ₹${
    selectedRoomWithHotel.offer.price.taxesAndFees
  }</p>
  <p><strong>Total Amount Paid:</strong> ₹${
    selectedRoomWithHotel.offer.price.total
  }</p>
  <p><strong>Cancellation Policy:</strong> ${
    selectedRoomWithHotel.offer.cancellationPolicy
  }</p>

  <h3>Amenities:</h3>
  <ul>
    ${selectedRoomWithHotel.hotel.amenities
      .map((amenity) => `<li>${amenity}</li>`)
      .join("")}
  </ul>

  <p>We hope you have a pleasant stay!</p>

  <p>Best regards,</p>
  <p>The ${selectedRoomWithHotel.hotel.name} Team</p>
`;

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: guests.email, // Recipient email (guest's email)
      subject: `Booking Confirmation - ${selectedRoomWithHotel.hotel.name}`,
      html: emailHtml,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Send a successful response
    res.status(201).json({
      message: "Booking created successfully and confirmation email sent!",
      bookingData: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
};
