const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Simple login endpoint for development
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // For development, accept any email/password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Generate a simple token
    const token = jwt.sign(
      {
        userId: 1,
        username: email.split("@")[0],
        role: "user",
        isAdmin: false,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: 1,
          email,
          username: email.split("@")[0],
          role: "user",
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
});

// Simple register endpoint for development
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: "Email, password, and name are required",
      });
    }

    // Generate a simple token
    const token = jwt.sign(
      {
        userId: Date.now(),
        username: name,
        role: "user",
        isAdmin: false,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: Date.now(),
          email,
          username: name,
          role: "user",
        },
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: "Registration failed",
    });
  }
});

// GET /api/auth/me - Get current user profile
router.get("/me", async (req, res) => {
  try {
    // For now, return mock data - you can integrate with your user database later
    const user = {
      id: 1,
      email: "user@example.com",
      username: "user",
      role: "user",
      isAdmin: false,
      createdAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get user profile",
    });
  }
});

// POST /api/auth/logout - User logout (client-side token removal)
router.post("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

module.exports = router;
