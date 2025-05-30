import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { roomId, rating, comment, stayDate } = req.body;
    const userId = req.user._id;

    // Verify this user has booked this room before
    const booking = await Booking.findOne({
      user: userId,
      room: roomId,
      status: "confirmed",
    });

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: "You can only review rooms you've stayed in",
      });
    }

    // Get hotel ID from room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check if user has already reviewed this room
    const existingReview = await Review.findOne({
      user: userId,
      room: roomId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this room",
      });
    }

    // Create the review
    const review = await Review.create({
      user: userId,
      room: roomId,
      hotel: room.hotel,
      rating,
      comment,
      stayDate: new Date(stayDate),
    });

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message,
    });
  }
};

// Get reviews for a specific room
export const getRoomReviews = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Get reviews for this room
    const reviews = await Review.find({ room: roomId })
      .populate("user", "username image")
      .sort({ createdAt: -1 });

    // Calculate statistics
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    // Count reviews by rating
    const ratingCounts = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    res.status(200).json({
      success: true,
      reviews,
      stats: {
        totalReviews,
        averageRating,
        ratingCounts,
      },
    });
  } catch (error) {
    console.error("Error fetching room reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// Get reviews by a specific user
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;

    const reviews = await Review.find({ user: userId })
      .populate("room", "roomType images")
      .populate("hotel", "name address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// Get reviews for a hotel owner's hotel
export const getHotelReviews = async (req, res) => {
  try {
    const ownerId = req.user._id;

    // Find hotel owned by this user
    const hotel = await Hotel.findOne({ owner: ownerId });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    // Find all reviews for this hotel
    const reviews = await Review.find({ hotel: hotel._id })
      .populate("user", "username image")
      .populate("room", "roomType")
      .sort({ createdAt: -1 });

    // Calculate statistics
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    res.status(200).json({
      success: true,
      reviews,
      stats: {
        totalReviews,
        averageRating,
      },
    });
  } catch (error) {
    console.error("Error fetching hotel reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// Update an existing review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    // Find the review
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if the review belongs to the user
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own reviews",
      });
    }

    // Update the review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find the review
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if the review belongs to the user
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own reviews",
      });
    }

    // Delete the review
    await Review.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

// Get featured reviews (Top rated and recent)
export const getFeaturedReviews = async (req, res) => {
  try {
    // Get top reviews (high rating and recent)
    const reviews = await Review.find({ rating: { $gte: 4 } })
      .populate("user", "username image")
      .populate("room", "roomType _id")
      .populate("hotel", "name address")
      .sort({ rating: -1, createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching featured reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured reviews",
      error: error.message,
    });
  }
};
