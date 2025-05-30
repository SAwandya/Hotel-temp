import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerHotel,
  getHotelProfile,
  updateHotel,
  getAllHotels,
  getHotelDashboard,
} from "../controllers/hotelController.js";

const hotelRouter = express.Router();

hotelRouter.post("/", protect, registerHotel);
hotelRouter.get("/profile", protect, getHotelProfile);
hotelRouter.put("/update", protect, updateHotel);
hotelRouter.get("/", getAllHotels);
hotelRouter.get("/dashboard", protect, getHotelDashboard);

export default hotelRouter;
