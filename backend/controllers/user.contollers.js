import User from "../models/user.model"; // Import User model (MongoDB schema)

// Controller to get the currently logged-in user
export const getCurrentUser = async (req, res) => {
  try {
    // Get userId from request object (set by auth middleware)
    const userId = req.userId;

    // Find user in database by ID
    // .select("-password") → exclude password field for security
    const user = await User.findById(userId).select("-password");

    // If user does not exist in database
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If user found → send success response with user data
    return res.status(200).json({
      success: true,
      user, // sending user details (without password)
    });

  } catch (error) {
    // Handle server/database errors
    return res.status(500).json({
      success: false,
      message: "Error fetching current user",
      error: error.message, // send error message for debugging
    });
  }
};