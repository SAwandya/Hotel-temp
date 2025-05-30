// Protect routes - requires authentication
export const protect = (req, res, next) => {
  try {
    // Check if user exists in request (added by clerk middleware)
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, please login",
      });
    }

    // If authentication passes, add user ID to req.user._id for compatibility
    // Also store the original auth object for additional user data access
    req.user = {
      _id: req.auth.userId,
      email: req.auth.email || null,
      firstName: req.auth.firstName || null,
      lastName: req.auth.lastName || null,
    };

    console.log(`User authenticated: ${req.auth.userId}`);
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// Role-based authorization middleware
export const authorize = (role) => {
  return async (req, res, next) => {
    try {
      // Get user from database to check role
      const userId = req.user._id;
      const user = await User.findOne({ clerkId: userId });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found in database",
        });
      }

      if (user.role !== role) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Not authorized.",
        });
      }

      // User has required role, proceed
      next();
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(500).json({
        success: false,
        message: "Authorization check failed",
      });
    }
  };
};
