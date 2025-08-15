const express = require("express");
const router = express.Router();

// Mock user profile (replace with real database later)
const mockProfile = {
  id: 1,
  name: "John Doe", 
  email: "john@example.com",
  phone: "+1 234 567 8900",
  address: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001"
  },
  joinedDate: "2023-01-15",
  verified: true
};

// Get profile
router.get("/", (req, res) => {
  try {
    res.json({
      success: true,
      data: mockProfile,
      message: "Profile retrieved successfully"
    });
  } catch (error) {
    console.error("Error in profile route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch profile",
      message: error.message
    });
  }
});

module.exports = router;