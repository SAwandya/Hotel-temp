import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";

//API to create a new room for a hotel
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;
    const hotel = await Hotel.findOne({ owner: req.auth.userId });

    if (!hotel) {
      return res.json({ success: false, message: "Hotel not found" });
    }

    console.log(`Creating room for hotel: ${hotel.name} (${hotel._id})`);

    // Upload images to cloudinary
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });

    // Wait for all uploads to complete
    const images = await Promise.all(uploadImages);

    // Create the room with hotel ObjectId
    const newRoom = await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });

    console.log(`Room created successfully: ${newRoom._id}`);

    res.json({ success: true, message: "Room created successfully" });
  } catch (error) {
    console.error("Error in createRoom:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all rooms with optional filters
export const getRooms = async (req, res) => {
  try {
    const { city, minPrice, maxPrice } = req.query;

    console.log("Filter params:", { city, minPrice, maxPrice }); // Debug log

    // Build the filter query
    let filterQuery = {
      // Only include available rooms
      isAvailable: true,
    };

    // Add city filter if provided
    if (city) {
      const hotels = await Hotel.find({
        city: { $regex: new RegExp(city, "i") },
      });
      const hotelIds = hotels.map((hotel) => hotel._id);
      filterQuery.hotel = { $in: hotelIds };
    }

    // Add price range filters if provided
    if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
      filterQuery.pricePerNight = { $gte: parseInt(minPrice) };
    }

    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
      filterQuery.pricePerNight = {
        ...filterQuery.pricePerNight,
        $lte: parseInt(maxPrice),
      };
    }

    console.log("Final filter query:", JSON.stringify(filterQuery)); // Debug log

    // Get rooms that match the filter criteria
    const rooms = await Room.find(filterQuery)
      .populate({
        path: "hotel",
        select: "name address city contact",
      })
      .sort({ createdAt: -1 });

    console.log(`Found ${rooms.length} available rooms matching filters`);

    res.json({ success: true, rooms });
  } catch (error) {
    console.error("Error in getRooms:", error);
    res.json({ success: false, message: error.message });
  }
};

//Api to get all rooms for specific hotel owner
export const getOwnerRooms = async (req, res) => {
  try {
    const hotelData = await Hotel.findOne({ owner: req.auth.userId });

    if (!hotelData) {
      return res.json({
        success: false,
        message: "No hotel found for this owner.",
      });
    }

    const rooms = await Room.find({ hotel: hotelData._id }).populate({
      path: "hotel",
      select: "name address city contact",
    });

    console.log(`Found ${rooms.length} rooms for hotel owner`);

    res.json({ success: true, rooms });
  } catch (error) {
    console.error("Error in getOwnerRooms:", error);
    res.json({ success: false, message: error.message });
  }
};

//Api to toggle availability of a hotel
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    const roomData = await Room.findById(roomId);
    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();
    res.json({ success: true, message: "Room Availability Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get a single room by ID
export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id).populate({
      path: "hotel",
      populate: {
        path: "owner",
        select: "username image email",
      },
    });

    if (!room) {
      return res.json({ success: false, message: "Room not found" });
    }

    res.json({ success: true, room });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update an existing room
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomType, pricePerNight, amenities, existingImages } = req.body;

    // Find the room
    const room = await Room.findById(id);

    if (!room) {
      return res.json({ success: false, message: "Room not found" });
    }

    // Check if the user is the hotel owner
    const hotel = await Hotel.findById(room.hotel);

    if (hotel.owner.toString() !== req.auth.userId) {
      return res.json({
        success: false,
        message: "Not authorized to update this room",
      });
    }

    // Prepare update data
    const updateData = {
      roomType: roomType || room.roomType,
      pricePerNight: pricePerNight ? +pricePerNight : room.pricePerNight,
      amenities: amenities ? JSON.parse(amenities) : room.amenities,
    };

    // Handle images
    let newImages = [];

    // Keep existing images if specified
    if (existingImages) {
      newImages = JSON.parse(existingImages);
    }

    // Upload new images if any
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        return result.secure_url;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      newImages = [...newImages, ...uploadedImages];
    }

    // Only update images if we have new ones
    if (newImages.length > 0) {
      updateData.images = newImages;
    }

    // Update the room
    await Room.findByIdAndUpdate(id, updateData, { new: true });

    res.json({ success: true, message: "Room updated successfully" });
  } catch (error) {
    console.error("Error in updateRoom:", error);
    res.json({ success: false, message: error.message });
  }
};
