import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: String, ref: "User", required: true },
    room: { type: String, ref: "Room", required: true },
    hotel: { type: String, ref: "Hotel", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    stayDate: { type: Date, required: true },
  },
  { timestamps: true }
);

// Prevent user from reviewing the same room multiple times
reviewSchema.index({ user: 1, room: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
