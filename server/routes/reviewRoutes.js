import express from "express";
import {
  createReview,
  getRoomReviews,
  getUserReviews,
  getHotelReviews,
  updateReview,
  deleteReview,
  getFeaturedReviews,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const reviewRouter = express.Router();

// Create a new review
reviewRouter.post("/", protect, createReview);

// Get reviews for a specific room
reviewRouter.get("/room/:roomId", getRoomReviews);

// Get featured reviews
reviewRouter.get("/featured", getFeaturedReviews);

// Get reviews by the logged-in user
reviewRouter.get("/user", protect, getUserReviews);

// Get reviews for a specific hotel
reviewRouter.get("/hotel", protect, getHotelReviews);

// Update a review
reviewRouter.put("/:id", protect, updateReview);

// Delete a review
reviewRouter.delete("/:id", protect, deleteReview);

export default reviewRouter;
