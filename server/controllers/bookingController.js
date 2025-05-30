import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { processPayment, refundPayment } from "../services/paymentService.js";

//Function to check availability of room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });
    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.error(error.message);
  }
};

//API to check availibilty of room
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//API to create a new booking
// POST /api/bookings/book

export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;

    //before booking check availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available" });
    }

    //get totalPrice from Room
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    //calculate totalPrice based on nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights;
    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    res.json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to create booking" });
  }
};

//API to get all bookings for a user
//GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "hotel",
        select: "name address contact location destination city", // Make sure to include location
      })
      .populate({
        path: "room",
        select: "roomType pricePerNight images amenities",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch booking" });
  }
};

// Get all bookings for a hotel owner
export const getHotelBookings = async (req, res) => {
  try {
    const userId = req.auth.userId;

    // Get hotel owned by user
    const hotel = await Hotel.findOne({ owner: userId });

    if (!hotel) {
      return res.json({
        success: false,
        message: "No hotel found for this owner",
      });
    }

    // Get all rooms for this hotel
    const rooms = await Room.find({ hotel: hotel._id });
    const roomIds = rooms.map((room) => room._id);

    // Get all bookings for these rooms
    const bookings = await Booking.find({ room: { $in: roomIds } })
      .populate("user")
      .populate({
        path: "room",
        select: "roomType pricePerNight images isAvailable",
        populate: {
          path: "hotel",
          select: "name address city",
        },
      })
      .sort({ createdAt: -1 });

    // Calculate dashboard stats
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(
      (b) => b.status === "confirmed"
    ).length;
    const pendingBookings = bookings.filter(
      (b) => b.status === "pending"
    ).length;
    const cancelledBookings = bookings.filter(
      (b) => b.status === "cancelled"
    ).length;

    const totalRevenue = bookings
      .filter((b) => b.isPaid)
      .reduce((sum, booking) => sum + booking.totalPrice, 0);

    const paidBookings = bookings.filter((b) => b.isPaid).length;
    const unpaidBookings = bookings.filter((b) => !b.isPaid).length;

    // Important: Return bookings as a top-level property, not nested in dashboardData
    res.json({
      success: true,
      bookings: bookings, // Make this a top-level property
      dashboardData: {
        totalBookings,
        confirmedBookings,
        pendingBookings,
        cancelledBookings,
        totalRevenue,
        paidBookings,
        unpaidBookings,
        roomsCount: rooms.length,
      },
    });
  } catch (error) {
    console.error("Error in getHotelBookings:", error);
    res.json({ success: false, message: error.message, bookings: [] }); // Always provide empty bookings array on error
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status, isPaid } = req.body;

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    // Find the hotel owner
    const hotel = await Hotel.findById(booking.hotel);
    if (!hotel) {
      return res.json({ success: false, message: "Hotel not found" });
    }

    // Check if the current user is the hotel owner
    if (hotel.owner !== req.auth.userId) {
      return res.json({
        success: false,
        message: "Not authorized to update this booking",
      });
    }

    // Update the booking
    if (status) {
      booking.status = status;
    }

    if (isPaid !== undefined) {
      booking.isPaid = isPaid;
    }

    await booking.save();

    res.json({ success: true, message: "Booking updated successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Process payment for booking
export const processBookingPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;
    const userId = req.auth.userId;

    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    // Check if booking belongs to user
    if (booking.user !== userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // Check if already paid
    if (booking.isPaid) {
      return res.json({ success: false, message: "Booking is already paid" });
    }

    // Process payment
    const paymentResult = await processPayment(
      booking.totalPrice,
      paymentMethod
    );

    if (paymentResult.success) {
      // Update booking payment status
      booking.isPaid = true;
      booking.paymentMethod = paymentMethod;
      booking.status = "confirmed";
      await booking.save();

      return res.json({
        success: true,
        message: "Payment processed successfully",
      });
    } else {
      return res.json({
        success: false,
        message: paymentResult.message,
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Payment processing failed" });
  }
};
