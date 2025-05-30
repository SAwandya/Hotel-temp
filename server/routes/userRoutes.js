import express from "express";
import {
  getUserProfile,
  addRecentSearch,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/", protect, getUserProfile);
userRouter.post("/recent-search", protect, addRecentSearch);

export default userRouter;
