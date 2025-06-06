import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Clerk user ID
    username: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String },
    role: {
      type: String,
      enum: ["user", "hotelOwner", "admin"],
      default: "user",
    },
    recentSearchedCities: [{ type: String }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
