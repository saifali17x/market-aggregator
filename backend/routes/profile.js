const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");

// GET /api/profile - Get user profile
router.get("/", authenticateToken, async (req, res) => {
  try {
    // For now, return mock data - you can integrate with your user database later
    const profile = {
      id: req.user.id || 1,
      name: "John Doe",
      email: "john@example.com",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      phone: "+1 (555) 123-4567",
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      preferences: {
        notifications: true,
        newsletter: false,
        language: "en",
      },
      createdAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get profile",
    });
  }
});

// PUT /api/profile - Update user profile
router.put("/", authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address, preferences } = req.body;

    // For now, just return success - you can integrate with your user database later
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: req.user.id || 1,
        name: name || "John Doe",
        email: email || "john@example.com",
        phone: phone || "+1 (555) 123-4567",
        address: address || {},
        preferences: preferences || {},
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update profile",
    });
  }
});

module.exports = router;
