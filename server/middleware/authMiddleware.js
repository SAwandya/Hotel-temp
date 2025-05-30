import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token, authorization denied" });
    }

    try {
      // For Clerk token handling
      // This ensures compatibility with your controllers that expect req.user._id
      const payload = jwt.decode(token);

      // Add user ID to both common locations
      req.user = { _id: payload.sub };
      req.auth = { userId: payload.sub };

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ success: false, message: "Token is not valid" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin middleware
export const admin = (req, res, next) => {
  // ... existing code ...
};

// Original Clerk middleware (as fallback)
export const clerkAuth = ClerkExpressRequireAuth();
