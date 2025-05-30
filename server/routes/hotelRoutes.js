import express from "express";
import {
  registerHotel,
  getHotelProfile,
  updateHotel,
  getAllHotels,
  getHotelDashboard,
} from "../controllers/hotelController.js";
import { protect } from "../middleware/authMiddleware.js";

const hotelRouter = express.Router();

hotelRouter.post("/", protect, registerHotel);
hotelRouter.get("/profile", protect, getHotelProfile);
hotelRouter.put("/update", protect, updateHotel);
hotelRouter.get("/", getAllHotels);
hotelRouter.get(
  "/dashboard",
  protect,
  (req, res, next) => {
    if (!req.user && !req.auth) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. No user information available.",
      });
    }
    next();
  },
  getHotelDashboard
);

export default hotelRouter;
