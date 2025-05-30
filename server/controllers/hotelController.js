import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id;

    //check if user already registered
    const hotel = await Hotel.findOne({ owner });
    if (hotel) {
      return res.json({ success: false, message: "Hotel Already Registered" });
    }

    await Hotel.create({ name, address, contact, city, owner });

    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.json({ success: true, message: "Hotel registered successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Create new hotel
export const createHotel = async (req, res) => {
  try {
    const { name, address, contact, city, destination, location } = req.body;
    const owner = req.user._id;

    if (!name || !address || !contact || !city) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const hotelExists = await Hotel.findOne({ name, owner });
    if (hotelExists) {
      return res.status(400).json({
        success: false,
        message: "You have already registered a hotel with this name",
      });
    }

    const newHotel = await Hotel.create({
      name,
      address,
      contact,
      city,
      owner,
      destination: destination || "",
      // Add location if provided
      location: location || { lat: 0, lng: 0 },
    });

    // Update user's role to hotelOwner
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.status(201).json({
      success: true,
      message: "Hotel registered successfully!",
      hotel: newHotel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to register hotel",
      error: error.message,
    });
  }
};

// Get hotel profile for the logged-in owner
export const getHotelProfile = async (req, res) => {
  try {
    const owner = req.auth.userId;
    const hotel = await Hotel.findOne({ owner });

    if (!hotel) {
      return res.json({
        success: false,
        message: "Hotel not found. Please register a hotel first.",
      });
    }

    res.json({
      success: true,
      hotel,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update hotel profile
export const updateHotel = async (req, res) => {
  try {
    const { name, address, contact, city, destination, location } = req.body;
    const owner = req.user._id;

    if (!name && !address && !contact && !city && !destination && !location) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update",
      });
    }

    const hotel = await Hotel.findOne({ owner });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (contact) updateData.contact = contact;
    if (city) updateData.city = city;
    if (destination !== undefined) updateData.destination = destination;

    // Ensure location is properly stored as an object with lat, lng properties
    if (location) {
      updateData.location = {
        lat: parseFloat(location.lat) || 0,
        lng: parseFloat(location.lng) || 0,
      };
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(hotel._id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Hotel profile updated successfully",
      hotel: updatedHotel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update hotel profile",
      error: error.message,
    });
  }
};

// Get all hotels with optional filtering
export const getAllHotels = async (req, res) => {
  try {
    const { city } = req.query;

    // Build query object
    let query = {};
    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    const hotels = await Hotel.find(query).populate("owner", "username image");

    res.json({
      success: true,
      hotels,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get hotel dashboard data
export const getHotelDashboard = async (req, res) => {
  try {
    // Access userId from either req.user._id or req.auth.userId
    const userId = req.user?._id || req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in request. Authentication required.",
      });
    }

    // Find hotel owned by user
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

    // Get all bookings for this hotel
    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("user", "username email")
      .populate("room", "roomType pricePerNight images")
      .sort({ createdAt: -1 });

    // Calculate statistics
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
    const paidBookings = bookings.filter((b) => b.isPaid).length;
    const unpaidBookings = bookings.filter((b) => !b.isPaid).length;

    // Calculate total revenue (only from confirmed bookings that are paid)
    const totalRevenue = bookings
      .filter((b) => b.status === "confirmed" && b.isPaid)
      .reduce((total, booking) => total + booking.totalPrice, 0);

    res.status(200).json({
      success: true,
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      paidBookings,
      unpaidBookings,
      totalRevenue,
      roomsCount: rooms.length,
      bookings: bookings.map((booking) => ({
        _id: booking._id,
        user: booking.user,
        room: booking.room,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        totalPrice: booking.totalPrice,
        guests: booking.guests,
        status: booking.status,
        isPaid: booking.isPaid,
        createdAt: booking.createdAt,
      })),
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message,
    });
  }
};
