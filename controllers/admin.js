import FlightBooking from "../models/booking.js"; // assuming you have a FlightBooking model
import HotelBooking from "../models/hotelBooking.js"; // assuming you have a HotelBooking model
import User from "../models/user.js"; // assuming you have a HotelBooking model

const getSixMonthsAgo = () => {
  const today = new Date();
  today.setMonth(today.getMonth() - 6);
  return today;
};

const getHighestBookedFlight = async () => {
  try {
    const bookings = await FlightBooking.find();
    const flightCountByPrice = {}; // Group flights by total price

    // Loop through all bookings and count how many times each flight with the same price is booked
    bookings.forEach((booking) => {
      const flight = booking.selectedFlights; // The whole flight details
      const flightId = flight.id; // Flight ID
      const totalPrice = flight.price.total; // Total price of the flight

      if (!flightCountByPrice[totalPrice]) {
        flightCountByPrice[totalPrice] = {}; // Initialize if not present
      }

      if (!flightCountByPrice[totalPrice][flightId]) {
        flightCountByPrice[totalPrice][flightId] = {
          count: 0, // Initialize the count for this flightId
          flightDetails: flight, // Store the full flight details
        };
      }
      flightCountByPrice[totalPrice][flightId].count++; // Increment the booking count for this flight
    });

    let highestBookedFlight = null;
    let maxBookings = 0;

    // Loop through all prices and find the flight with the highest combined bookings
    for (let totalPrice in flightCountByPrice) {
      const flights = flightCountByPrice[totalPrice];
      let combinedBookings = 0;
      let selectedFlight = null;

      // Sum the bookings for each flight within the same price group
      for (let flightId in flights) {
        combinedBookings += flights[flightId].count;
        selectedFlight = flights[flightId]; // Track the flight with the highest bookings
      }

      // If the combined bookings are greater than the current max, select this group
      if (combinedBookings > maxBookings) {
        maxBookings = combinedBookings;
        highestBookedFlight = selectedFlight.flightDetails; // Store full flight details
      }
    }

    // Return an object with the highest booked flight and its count
    return {
      flightDetails: highestBookedFlight,
      bookingsCount: maxBookings, // Return the count of bookings for the highest booked flight
    };
  } catch (error) {
    console.error("Error fetching highest booked flight:", error);
    throw new Error("Error fetching highest booked flight");
  }
};

const getHighestBookedHotel = async () => {
  try {
    const bookings = await HotelBooking.find(); // Fetch hotel bookings
    const hotelCount = {}; // Group hotels by hotelId

    // Loop through all bookings and count how many times each hotel is booked
    bookings.forEach((booking) => {
      const hotel = booking.selectedRoomWithHotel.hotel; // Hotel details
      const hotelId = hotel.hotelId; // Unique hotel identifier
      const totalPrice = booking.selectedRoomWithHotel.offer.price.total; // The total price of the booking (you can change this if you prefer to use another price attribute)

      if (!hotelCount[hotelId]) {
        hotelCount[hotelId] = {
          count: 0, // Initialize count for this hotelId
          hotelDetails: hotel, // Store full hotel details
          totalPrice, // Store total price for potential future use
        };
      }
      hotelCount[hotelId].count++; // Increment the booking count for this hotel
    });

    let highestBookedHotel = null;
    let maxBookings = 0;

    // Loop through all hotels and find the hotel with the highest number of bookings
    for (let hotelId in hotelCount) {
      const hotelData = hotelCount[hotelId];
      const combinedBookings = hotelData.count;

      // If the combined bookings are greater than the current max, select this hotel
      if (combinedBookings > maxBookings) {
        maxBookings = combinedBookings;
        highestBookedHotel = hotelData.hotelDetails; // Store the full hotel details
      }
    }

    // Return an object with the highest booked hotel and its booking count
    return {
      hotelDetails: highestBookedHotel,
      bookingsCount: maxBookings, // Return the count of bookings for the highest booked hotel
    };
  } catch (error) {
    console.error("Error fetching highest booked hotel:", error);
    throw new Error("Error fetching highest booked hotel");
  }
};

// Function to calculate total flight booking revenue (without date filter)
const getTotalFlightRevenue = async () => {
  try {
    const bookings = await FlightBooking.find();
    let totalRevenue = 0;

    bookings.forEach((booking) => {
      totalRevenue += parseInt(booking.selectedFlights.price.total);
    });

    return totalRevenue;
  } catch (error) {
    console.error("Error fetching total flight bookings revenue:", error);
    throw new Error("Error fetching total flight bookings revenue");
  }
};

// Function to calculate flight booking revenue for the last 6 months
const getFlightRevenue = async () => {
  try {
    const sixMonthsAgo = getSixMonthsAgo();
    const bookings = await FlightBooking.find({
      createdAt: { $gte: sixMonthsAgo },
    });

    let totalRevenue = 0;

    bookings.forEach((booking) => {
      totalRevenue += parseInt(booking.selectedFlights.price.total);
    });

    return totalRevenue;
  } catch (error) {
    console.error("Error fetching flight bookings revenue:", error);
    throw new Error("Error fetching flight bookings revenue");
  }
};

// Function to calculate total hotel booking revenue (without date filter)
const getTotalHotelRevenue = async () => {
  try {
    const bookings = await HotelBooking.find();
    let totalRevenue = 0;

    bookings.forEach((booking) => {
      totalRevenue += parseFloat(
        booking.selectedRoomWithHotel.offer.price.total
      );
    });

    return totalRevenue;
  } catch (error) {
    console.error("Error fetching total hotel bookings revenue:", error);
    throw new Error("Error fetching total hotel bookings revenue");
  }
};

// Function to calculate hotel booking revenue for the last 6 months
const getHotelRevenue = async () => {
  try {
    const sixMonthsAgo = getSixMonthsAgo();
    const bookings = await HotelBooking.find({
      createdAt: { $gte: sixMonthsAgo },
    });

    let totalRevenue = 0;

    bookings.forEach((booking) => {
      totalRevenue += parseFloat(
        booking.selectedRoomWithHotel.offer.price.total
      );
    });

    return totalRevenue;
  } catch (error) {
    console.error("Error fetching hotel bookings revenue:", error);
    throw new Error("Error fetching hotel bookings revenue");
  }
};

// Function to get total flight bookings count (without date filter)
const getTotalFlightBookingsCount = async () => {
  try {
    const bookings = await FlightBooking.find();
    return bookings.length; // Simply return the total number of bookings
  } catch (error) {
    console.error("Error fetching total flight bookings count:", error);
    throw new Error("Error fetching total flight bookings count");
  }
};

// Function to get flight bookings count for the last 6 months
const getFlightBookingsCount = async () => {
  try {
    const sixMonthsAgo = getSixMonthsAgo();
    const bookings = await FlightBooking.find({
      createdAt: { $gte: sixMonthsAgo },
    });
    return bookings.length;
  } catch (error) {
    console.error("Error fetching flight bookings count:", error);
    throw new Error("Error fetching flight bookings count");
  }
};

// Function to get total hotel bookings count (without date filter)
const getTotalHotelBookingsCount = async () => {
  try {
    const bookings = await HotelBooking.find();
    return bookings.length;
  } catch (error) {
    console.error("Error fetching total hotel bookings count:", error);
    throw new Error("Error fetching total hotel bookings count");
  }
};

// Function to get hotel bookings count for the last 6 months
const getHotelBookingsCount = async () => {
  try {
    const sixMonthsAgo = getSixMonthsAgo();
    const bookings = await HotelBooking.find({
      createdAt: { $gte: sixMonthsAgo },
    });
    return bookings.length;
  } catch (error) {
    console.error("Error fetching hotel bookings count:", error);
    throw new Error("Error fetching hotel bookings count");
  }
};

// Controller function for 6-month flight booking analytics (percentage-based)
const flightAnalytics = async (req, res) => {
  try {
    // Get revenues and booking counts
    const totalFlightRevenue = await getTotalFlightRevenue();
    const flightRevenue = await getFlightRevenue();
    const totalFlightBookings = await getTotalFlightBookingsCount();
    const flightBookings = await getFlightBookingsCount();

    // Calculate percentages
    const flightRevenuePercentage = (
      (flightRevenue / totalFlightRevenue) *
      100
    ).toFixed(2);
    const flightBookingsPercentage = (
      (flightBookings / totalFlightBookings) *
      100
    ).toFixed(2);

    res.status(200).json({
      totalRevenue: totalFlightRevenue,
      lastSixMonthsRevenue: flightRevenue,
      revenuePercentage: flightRevenuePercentage, // Percentage of total revenue from the last 6 months
      totalBookings: totalFlightBookings,
      lastSixMonthsBookings: flightBookings,
      bookingsPercentage: flightBookingsPercentage, // Percentage of total bookings from the last 6 months
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching flight analytics",
      error: error.message,
    });
  }
};

// Controller function for 6-month hotel booking analytics (percentage-based)
const hotelAnalytics = async (req, res) => {
  try {
    // Get revenues and booking counts
    const totalHotelRevenue = await getTotalHotelRevenue();
    const hotelRevenue = await getHotelRevenue();
    const totalHotelBookings = await getTotalHotelBookingsCount();
    const hotelBookings = await getHotelBookingsCount();

    // Calculate percentages
    const hotelRevenuePercentage = (
      (hotelRevenue / totalHotelRevenue) *
      100
    ).toFixed(2);
    const hotelBookingsPercentage = (
      (hotelBookings / totalHotelBookings) *
      100
    ).toFixed(2);

    res.status(200).json({
      totalRevenue: totalHotelRevenue,
      lastSixMonthsRevenue: hotelRevenue,
      revenuePercentage: hotelRevenuePercentage, // Percentage of total revenue from the last 6 months
      totalBookings: totalHotelBookings,
      lastSixMonthsBookings: hotelBookings,
      bookingsPercentage: hotelBookingsPercentage, // Percentage of total bookings from the last 6 months
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching hotel analytics",
      error: error.message,
    });
  }
};

const overallAnalytics = async (req, res) => {
  try {
    // Flight Analytics
    const totalFlightRevenue = await getTotalFlightRevenue();
    const flightRevenue = await getFlightRevenue();
    const totalFlightBookings = await getTotalFlightBookingsCount();
    const flightBookings = await getFlightBookingsCount();
    const HighestBookedFlight = await getHighestBookedFlight();
    const HighestBookedHotel = await getHighestBookedHotel();

    // Hotel Analytics
    const totalHotelRevenue = await getTotalHotelRevenue();
    const hotelRevenue = await getHotelRevenue();
    const totalHotelBookings = await getTotalHotelBookingsCount();
    const hotelBookings = await getHotelBookingsCount();

    // Calculate percentages for Flight
    const flightRevenuePercentage = (
      (flightRevenue / totalFlightRevenue) *
      100
    ).toFixed(2);
    const flightBookingsPercentage = (
      (flightBookings / totalFlightBookings) *
      100
    ).toFixed(2);

    // Calculate percentages for Hotel
    const hotelRevenuePercentage = (
      (hotelRevenue / totalHotelRevenue) *
      100
    ).toFixed(2);
    const hotelBookingsPercentage = (
      (hotelBookings / totalHotelBookings) *
      100
    ).toFixed(2);

    const totalRevenue = totalFlightRevenue + totalHotelRevenue;
    const lastSixMonthsRevenue = flightRevenue + hotelRevenue;

    res.status(200).json({
      totalRevenue,
      lastSixMonthsRevenue,
      revenuePercentage: ((lastSixMonthsRevenue / totalRevenue) * 100).toFixed(
        2
      ), // Total revenue percentage in the last 6 months

      totalFlightRevenue,
      flightRevenuePercentage,
      totalFlightBookings,
      flightBookingsPercentage,
      HighestBookedFlight,
      HighestBookedHotel,
      totalHotelRevenue,
      hotelRevenuePercentage,
      totalHotelBookings,
      hotelBookingsPercentage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching overall analytics",
      error: error.message,
    });
  }
};

// Get the total number of users
const getTotalUsers = async () => {
  try {
    const users = await User.find();
    return users.length; // Return the total count of users
  } catch (error) {
    console.error("Error fetching total users:", error);
    throw new Error("Error fetching total users");
  }
};

// Get the total number of flight bookings
const getTotalFlightBookings = async () => {
  try {
    const flightBookings = await FlightBooking.countDocuments();
    return flightBookings;
  } catch (error) {
    console.error("Error fetching total flight bookings:", error);
    throw new Error("Error fetching total flight bookings");
  }
};

// Get the total number of hotel bookings
const getTotalHotelBookings = async () => {
  try {
    const hotelBookings = await HotelBooking.countDocuments();
    return hotelBookings;
  } catch (error) {
    console.error("Error fetching total hotel bookings:", error);
    throw new Error("Error fetching total hotel bookings");
  }
};

// Function to get the top destination by revenue and growth percentage
const getTopDestinations = async () => {
  try {
    const sixMonthsAgo = getSixMonthsAgo();

    // Fetch bookings in the last 6 months
    const flightBookings = await FlightBooking.find({
      createdAt: { $gte: sixMonthsAgo }, // Only include bookings within the last 6 months
    });

    const hotelBookings = await HotelBooking.find({
      createdAt: { $gte: sixMonthsAgo },
    });

    // Aggregate flight destinations
    const flightDestinationCounts = {};

    flightBookings.forEach((booking) => {
      const segments =
        booking.selectedFlights?.itineraries?.[0]?.segments || [];
      segments.forEach((segment) => {
        const departure = segment.departure?.iataCode;
        const arrival = segment.arrival?.iataCode;

        if (departure) {
          flightDestinationCounts[departure] =
            (flightDestinationCounts[departure] || 0) + 1;
        }
        if (arrival) {
          flightDestinationCounts[arrival] =
            (flightDestinationCounts[arrival] || 0) + 1;
        }
      });
    });

    // Aggregate hotel destinations
    const hotelDestinationCounts = {};

    hotelBookings.forEach((booking) => {
      const hotelName = booking.selectedRoomWithHotel?.hotel?.name;
      const hotelId = booking.selectedRoomWithHotel?.hotel?.hotelId;

      if (hotelName) {
        hotelDestinationCounts[hotelName] =
          (hotelDestinationCounts[hotelName] || 0) + 1;
      }
      if (hotelId) {
        hotelDestinationCounts[hotelId] =
          (hotelDestinationCounts[hotelId] || 0) + 1;
      }
    });

    // Combine flight and hotel destinations
    const combinedDestinationCounts = {
      ...flightDestinationCounts,
      ...hotelDestinationCounts,
    };

    // Convert destination counts into an array
    const destinationStats = Object.keys(combinedDestinationCounts).map(
      (destination) => ({
        name: destination,
        bookings: combinedDestinationCounts[destination],
        revenue: 0, // Optional: You can calculate revenue if you have that information
        growth: 0, // Optional: Calculate growth if needed
      })
    );

    // Sort destinations based on the number of bookings (descending order)
    destinationStats.sort((a, b) => b.bookings - a.bookings);

    // Return the top destinations (up to top 5)
    return destinationStats.slice(0, 5);
  } catch (error) {
    console.error("Error fetching top destinations:", error);
    throw new Error("Error fetching top destinations");
  }
};

// Function to get the range for the last 6 months (month-wise)
const getPreviousSixMonthsRanges = (includeCurrentMonth = false) => {
  const today = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Create array to store the date ranges for the previous 6 months (including current month)
  let ranges = [];

  // If include current month is true, start with the current month
  let currentMonthIndex = today.getMonth(); // Current month index (0 - 11)
  let currentYear = today.getFullYear();

  if (includeCurrentMonth) {
    ranges.push({
      start: new Date(currentYear, currentMonthIndex, 1),
      end: new Date(currentYear, currentMonthIndex + 1, 0), // End of the current month
      month: months[currentMonthIndex],
      year: currentYear,
    });
    currentMonthIndex--; // Move to the previous month
  }

  // Add the previous 5 months
  for (let i = 0; i < 5; i++) {
    if (currentMonthIndex < 0) {
      currentMonthIndex = 11; // December
      currentYear--; // Move to the previous year
    }
    ranges.push({
      start: new Date(currentYear, currentMonthIndex, 1),
      end: new Date(currentYear, currentMonthIndex + 1, 0),
      month: months[currentMonthIndex],
      year: currentYear,
    });
    currentMonthIndex--;
  }

  return ranges;
};

// Function to get new users for a specific month
const getNewUsersInDateRange = async (startDate, endDate) => {
  try {
    const users = await User.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });
    return users.length; // Returning the count of new users
  } catch (error) {
    console.error("Error fetching new users in date range:", error);
    throw new Error("Error fetching new users in date range");
  }
};

// Function to get active users for a specific month
const getActiveUsersInDateRange = async (startDate, endDate) => {
  try {
    const users = await User.find({
      lastActiveAt: { $gte: startDate, $lte: endDate }, // Assuming lastActiveAt is used to track active users
    });
    return users.length; // Returning the count of active users
  } catch (error) {
    console.error("Error fetching active users in date range:", error);
    throw new Error("Error fetching active users in date range");
  }
};

// Function to get flight bookings for a specific month
const getFlightBookingsForDateRange = async (startDate, endDate) => {
  try {
    const bookings = await FlightBooking.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });
    return bookings.length; // Returning the count of flight bookings
  } catch (error) {
    console.error("Error fetching flight bookings in date range:", error);
    throw new Error("Error fetching flight bookings in date range");
  }
};

// Function to get hotel bookings for a specific month
const getHotelBookingsForDateRange = async (startDate, endDate) => {
  try {
    const bookings = await HotelBooking.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });
    return bookings.length; // Returning the count of hotel bookings
  } catch (error) {
    console.error("Error fetching hotel bookings in date range:", error);
    throw new Error("Error fetching hotel bookings in date range");
  }
};

// const userAnalytics = async (req, res) => {
//   try {
//     // Get total users
//     const totalUsers = await getTotalUsers();
//     const newUsers = await getNewUsersLastSixMonths();
//     const activeUsers = await getActiveUsersLastSixMonths();

//     // Get total flight and hotel bookings
//     const totalFlightBookings = await getTotalFlightBookings();
//     const totalHotelBookings = await getTotalHotelBookings();

//     // Get the top destinations
//     const topDestinations = await getTopDestinations();

//     // Calculate percentages
//     const newUsersPercentage = ((newUsers / totalUsers) * 100).toFixed(2); // Percentage of total users who are new
//     const activeUsersPercentage = ((activeUsers / totalUsers) * 100).toFixed(2); // Percentage of total users who are active

//     res.status(200).json({
//       totalUsers,
//       newUsers,
//       newUsersPercentage,
//       activeUsers,
//       activeUsersPercentage,
//       totalFlightBookings,
//       totalHotelBookings,
//       topDestinations, // Include top destinations in the response
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error fetching user analytics",
//       error: error.message,
//     });
//   }
// };

const userAnalytics = async (req, res) => {
  try {
    // Get the previous 6 months date ranges including the current month
    const previousSixMonthsRanges = getPreviousSixMonthsRanges(true); // Pass `true` to include the current month

    // Arrays to store monthly data
    const monthlyUserData = [];
    const monthlyFlightBookingsData = [];
    const monthlyHotelBookingsData = [];

    // Loop through each previous month (and current month) and fetch data
    for (let i = 0; i < previousSixMonthsRanges.length; i++) {
      const { start, end, month, year } = previousSixMonthsRanges[i];

      // Get new users for this month
      const newUsersForMonth = await getNewUsersInDateRange(start, end);

      // Get active users for this month
      const activeUsersForMonth = await getActiveUsersInDateRange(start, end);

      // Get flight bookings for this month
      const flightBookingsForMonth = await getFlightBookingsForDateRange(
        start,
        end
      );

      // Get hotel bookings for this month
      const hotelBookingsForMonth = await getHotelBookingsForDateRange(
        start,
        end
      );

      // Store the data for this month
      monthlyUserData.push({
        month, // Month name (January, February, etc.)
        year,
        newUsers: newUsersForMonth,
        activeUsers: activeUsersForMonth,
      });

      monthlyFlightBookingsData.push({
        month, // Month name (January, February, etc.)
        year,
        flightBookings: flightBookingsForMonth,
      });

      monthlyHotelBookingsData.push({
        month, // Month name (January, February, etc.)
        year,
        hotelBookings: hotelBookingsForMonth,
      });
    }

    // Get total users, flight bookings, and hotel bookings for all time
    const totalUsers = await getTotalUsers();
    const totalFlightBookings = await getTotalFlightBookings();
    const totalHotelBookings = await getTotalHotelBookings();

    // Get the top destinations
    const topDestinations = await getTopDestinations();

    // Calculate percentages for the overall new and active users
    const newUsersOverall = monthlyUserData.reduce(
      (total, data) => total + data.newUsers,
      0
    );
    const activeUsersOverall = monthlyUserData.reduce(
      (total, data) => total + data.activeUsers,
      0
    );

    const newUsersPercentage = ((newUsersOverall / totalUsers) * 100).toFixed(
      2
    ); // Percentage of total users who are new
    const activeUsersPercentage = (
      (activeUsersOverall / totalUsers) *
      100
    ).toFixed(2); // Percentage of total users who are active

    res.status(200).json({
      totalUsers,
      totalFlightBookings,
      totalHotelBookings,
      topDestinations,
      monthlyUserData, // Monthly new and active users for previous months (and current month)
      monthlyFlightBookingsData, // Monthly flight bookings for previous months (and current month)
      monthlyHotelBookingsData, // Monthly hotel bookings for previous months (and current month)
      newUsersPercentage, // Percentage of total new users in the last 6 months
      activeUsersPercentage, // Percentage of total active users in the last 6 months
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user analytics",
      error: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Get all users from the database
    const formattedUsers = users.map((user) => ({
      id: user._id, // MongoDB's _id is used as user ID
      name: user.displayName,
      email: user.email,
      phone: user.phone || "N/A", // Assuming you might store a phone number, use a default if not available
      avatar: user.photoURL, // Avatar image URL
      status: user.isAdmin ? "active" : "inactive", // Assuming active users are admins for demo purposes
      role: user.isAdmin ? "Admin" : "User", // Role based on isAdmin field
      lastActive: user.updatedAt.toLocaleDateString(), // You can adjust this to a specific format
    }));

    res.status(200).json({
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

export {
  flightAnalytics,
  hotelAnalytics,
  overallAnalytics,
  userAnalytics,
  getUsers,
};
