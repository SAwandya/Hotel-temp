import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  createRoom,
  getOwnerRooms,
  getRoomById,
  getRooms,
  toggleRoomAvailability,
  updateRoom,
} from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post("/", upload.array("images", 4), protect, createRoom);
roomRouter.get("/", getRooms);
roomRouter.get("/owner", protect, getOwnerRooms); // Keep this before the /:id route
roomRouter.get("/:id", getRoomById);
roomRouter.post("/toggle-availability", protect, toggleRoomAvailability);
roomRouter.put("/:id", upload.array("images", 4), protect, updateRoom);

export default roomRouter;
