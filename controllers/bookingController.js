import { createCanvas, loadImage } from "canvas";
import streamifier from "streamifier"; // To convert buffer to a stream
import { v2 as cloudinary } from "cloudinary";
import Booking from "../models/booking.js";
import HotelBooking from "../models/hotelBooking.js";
import User from "../models/user.js";
// Helper function to generate a ticket PDF in memory

cloudinary.config({
  cloud_name: "dujrtefhp", // Replace with your Cloudinary cloud name
  api_key: "116945917351289", // Replace with your Cloudinary API key
  api_secret: "rQsJEIjbHJHzBUdpgojkzUqueoc", // Replace with your Cloudinary API secret
});

const generateTicket = async (selectedFlights, passengers, userId, email) => {
  return new Promise((resolve, reject) => {
    const width = 800;
    const height = 1500; // Adjusted height for better space distribution
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background: Clean, white background
    ctx.fillStyle = "#FFFFFF"; // Clean white background
    ctx.fillRect(0, 0, width, height);

    // Header Section - Airline Logo & Name
    loadImage(selectedFlights.airlineLogo)
      .then((logo) => {
        ctx.drawImage(logo, 40, 30, 100, 50); // Airline logo

        // Airline name next to the logo
        ctx.fillStyle = "#333";
        ctx.font = "30px 'Arial', sans-serif";
        ctx.fillText(selectedFlights.airlineName, 150, 60);

        // Flight number and departure time
        ctx.font = "20px 'Arial', sans-serif";
        ctx.fillText(
          `Flight: ${selectedFlights.itineraries[0].segments[0].carrierCode} ${selectedFlights.itineraries[0].segments[0].number}`,
          50,
          100
        );

        // Divider between header and content
        ctx.beginPath();
        ctx.moveTo(0, 120);
        ctx.lineTo(width, 120);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ddd";
        ctx.stroke();

        let yOffset = 140; // Start after the header

        // Outbound Flight Information Section
        ctx.fillStyle = "#f9f9f9"; // Light gray background
        ctx.fillRect(50, yOffset, width - 100, 200); // Box for outbound flight

        ctx.fillStyle = "#333";
        ctx.font = "22px 'Arial', sans-serif";
        ctx.fillText("Outbound Flight", 60, yOffset + 40);

        // Flight details (Departure, Arrival, Date, etc.)
        ctx.font = "18px 'Arial', sans-serif";
        ctx.fillText(
          `From: ${selectedFlights.itineraries[0].segments[0].departure.iataCode}`,
          60,
          yOffset + 70
        );
        ctx.fillText(
          `To: ${selectedFlights.itineraries[0].segments[0].arrival.iataCode}`,
          60,
          yOffset + 90
        );
        ctx.fillText(
          `Departure: ${selectedFlights.itineraries[0].segments[0].departure.at}`,
          60,
          yOffset + 110
        );
        ctx.fillText(
          `Arrival: ${selectedFlights.itineraries[0].segments[0].arrival.at}`,
          60,
          yOffset + 130
        );

        // Outbound Seat Assignments
        ctx.fillText("Seat Assignments:", 60, yOffset + 160);
        const outboundSeats = passengers.outboundSeats;
        let seatY = yOffset + 180;
        for (const [seat, passengerId] of Object.entries(outboundSeats)) {
          const passenger = passengers.adults
            .concat(passengers.children)
            .find((p) => p.travelerId === passengerId);
          if (passenger) {
            ctx.fillText(
              `${passenger.firstName} ${passenger.lastName} - Seat: ${seat}`,
              60,
              seatY
            );
            seatY += 20;
          }
        }

        // Update yOffset after outbound flight info
        yOffset += 300;

        // Return Flight Information Section (if applicable)
        if (selectedFlights.itineraries.length > 1) {
          ctx.fillStyle = "#f9f9f9"; // Light background for return flight
          ctx.fillRect(50, yOffset, width - 100, 200); // Box for return flight

          ctx.fillStyle = "#333";
          ctx.font = "22px 'Arial', sans-serif";
          ctx.fillText("Return Flight", 60, yOffset + 40);

          // Flight details (Departure, Arrival, Date, etc.)
          ctx.font = "18px 'Arial', sans-serif";
          ctx.fillText(
            `From: ${selectedFlights.itineraries[1].segments[0].departure.iataCode}`,
            60,
            yOffset + 70
          );
          ctx.fillText(
            `To: ${selectedFlights.itineraries[1].segments[0].arrival.iataCode}`,
            60,
            yOffset + 90
          );
          ctx.fillText(
            `Departure: ${selectedFlights.itineraries[1].segments[0].departure.at}`,
            60,
            yOffset + 110
          );
          ctx.fillText(
            `Arrival: ${selectedFlights.itineraries[1].segments[0].arrival.at}`,
            60,
            yOffset + 130
          );

          // Return Seat Assignments
          ctx.fillText("Seat Assignments:", 60, yOffset + 160);
          const returnSeats = passengers.returnSeats;
          let returnSeatY = yOffset + 180;
          for (const [seat, passengerId] of Object.entries(returnSeats)) {
            const passenger = passengers.adults
              .concat(passengers.children)
              .find((p) => p.travelerId === passengerId);
            if (passenger) {
              ctx.fillText(
                `${passenger.firstName} ${passenger.lastName} - Seat: ${seat}`,
                60,
                returnSeatY
              );
              returnSeatY += 20;
            }
          }

          // Update yOffset after return flight info
          yOffset += 300;
        }

        // Divider between flight info and pricing section
        ctx.beginPath();
        ctx.moveTo(0, yOffset + 10);
        ctx.lineTo(width, yOffset + 10);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ddd";
        ctx.stroke();

        // Pricing Information Section
        ctx.fillStyle = "#f9f9f9"; // Light background for pricing
        ctx.fillRect(50, yOffset + 20, width - 100, 140); // Pricing block

        ctx.fillStyle = "#333";
        ctx.font = "22px 'Arial', sans-serif";
        ctx.fillText("Price Breakdown", 60, yOffset + 50);
        ctx.font = "18px 'Arial', sans-serif";
        ctx.fillText(
          `Base Price: ${selectedFlights.price.base} ${selectedFlights.price.currency}`,
          60,
          yOffset + 80
        );
        ctx.fillText(
          `Taxes/Fees: ${
            selectedFlights.price.total - selectedFlights.price.base
          } ${selectedFlights.price.currency}`,
          60,
          yOffset + 100
        );
        ctx.fillText(
          `Total: ${selectedFlights.price.total} ${selectedFlights.price.currency}`,
          60,
          yOffset + 120
        );

        // Footer: Booking ID & Email
        ctx.fillStyle = "#f9f9f9";
        ctx.fillRect(50, yOffset + 160, width - 100, 100); // Footer block
        ctx.fillStyle = "#333";
        ctx.font = "18px 'Arial', sans-serif";
        ctx.fillText(`Booking ID: ${userId}`, 60, yOffset + 190);
        ctx.fillText(`Email: ${email}`, 60, yOffset + 220);

        // Convert canvas to a buffer
        const buffer = canvas.toBuffer();

        // Upload to Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "flight-tickets",
            public_id: `ticket-${userId}-${Date.now()}`,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url); // Return Cloudinary URL
            }
          }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
      })
      .catch((err) => {
        reject(err); // Handle errors
      });
  });
};

export const createBooking = async (req, res) => {
  try {
    const { selectedFlights, passengers, userId: uid, email } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: "userId and email are required." });
    }

    const user = await User.findOne({ uid: uid });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const ticketUrl = await generateTicket(
      selectedFlights,
      passengers,
      uid,
      email
    );

    const newBooking = new Booking({
      userId: uid,
      email: email,
      selectedFlights,
      passengers,
      status: "confirmed",
      ticketUrl: ticketUrl,
      createdAt: Date.now(),
    });

    newBooking
      .save()
      .then(() => {
        res.status(201).json({
          message: "Booking created successfully!",
          bookingData: newBooking,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: "Error saving booking to database",
          details: err,
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error, try again later." });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking by ObjectId
    const booking = await Booking.findById(bookingId);

    // If booking does not exist
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Update the booking status to "cancelled"
    booking.status = "cancelled";
    booking.cancellationDate = new Date();

    // Optionally, track refund status
    booking.refundStatus = "processed"; // You could implement refund logic separately

    // Save the changes
    await booking.save();

    // Send success response
    return res.json({
      success: true,
      message: "Booking successfully cancelled.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while cancelling the booking.",
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {

    const { userId } = req.params; // Assuming the userId is passed as a route parameter

    // Fetch all bookings where the userId matches the user's ObjectId
    const flightbookings = await Booking.find({ userId }).exec(); // No need to query the User model directly, just the Booking model
    const hotelbookings = await HotelBooking.find({ userId }).exec(); // No need to query the User model directly, just the Booking model

    const bookings = flightbookings.concat(hotelbookings);

    if (!bookings || bookings.length === 0) {
      return res
        .status(200)
        .json({ message: "No bookings found for this user" });
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error, try again later." });
  }
};
