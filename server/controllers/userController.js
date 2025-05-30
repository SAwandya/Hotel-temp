import User from "../models/User.js";

//GET /api/user/

export const getUserData = async (req, res) => {
  try {
    const role = req.user.role;
    const recentSearchedCities = req.user.recentSearchedCities;
    res.json({ success: true, role, recentSearchedCities });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//store user recent searched city
export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body;
    const user = await req.user;

    if (user.recentSearchedCities.length < 3) {
      user.recentSearchedCities.push(recentSearchedCity);
    } else {
      user.recentSearchedCities.shift();
      user.recentSearchedCities.push(recentSearchedCity);
    }
    await user.save();
    res.json({ success: true, message: "City stored successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      _id: user._id,
      username: user.username,
      email: user.email,
      image: user.image,
      role: user.role,
      recentSearchedCities: user.recentSearchedCities || [],
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Add a city to recent searches
export const addRecentSearch = async (req, res) => {
  try {
    const { city } = req.body;
    const userId = req.auth.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Add city to recent searches if not already present
    if (!user.recentSearchedCities.includes(city)) {
      // Keep only the 5 most recent searches
      const updatedCities = [city, ...user.recentSearchedCities.slice(0, 4)];
      user.recentSearchedCities = updatedCities;
      await user.save();
    }

    res.json({
      success: true,
      message: "Search saved successfully",
      recentSearchedCities: user.recentSearchedCities,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
