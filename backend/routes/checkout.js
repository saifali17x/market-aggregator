const express = require("express");
const router = express.Router();

// Mock shipping options (replace with real shipping API later)
const mockShippingOptions = [
  {
    id: 1,
    name: "Standard Shipping",
    price: 5.99,
    estimatedDays: "5-7 business days",
    description: "Regular ground shipping"
  },
  {
    id: 2,
    name: "Express Shipping", 
    price: 12.99,
    estimatedDays: "2-3 business days",
    description: "Faster delivery option"
  },
  {
    id: 3,
    name: "Overnight Shipping",
    price: 24.99,
    estimatedDays: "1 business day",
    description: "Next day delivery"
  }
];

// Get shipping options
router.get("/shipping-options", (req, res) => {
  try {
    res.json({
      success: true,
      data: mockShippingOptions,
      message: "Shipping options retrieved successfully"
    });
  } catch (error) {
    console.error("Error in shipping options route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch shipping options", 
      message: error.message
    });
  }
});

// Process checkout
router.post("/", (req, res) => {
  try {
    const { cart, shipping, payment } = req.body;
    
    // Mock successful checkout
    const order = {
      id: Date.now(),
      orderNumber: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: "confirmed",
      total: cart?.total || 0,
      date: new Date().toISOString(),
      shipping: shipping,
      items: cart?.items || []
    };
    
    res.json({
      success: true,
      data: order,
      message: "Order placed successfully"
    });
  } catch (error) {
    console.error("Error in checkout route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process checkout",
      message: error.message
    });
  }
});

module.exports = router;