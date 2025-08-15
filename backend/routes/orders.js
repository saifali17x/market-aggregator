const express = require("express");
const router = express.Router();

// Mock orders data (replace with real database later)
const mockOrders = [
  {
    id: 1,
    orderNumber: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 999.99,
    items: [
      {
        id: 1,
        name: "iPhone 15 Pro",
        price: 999.99,
        quantity: 1,
        image: "/images/iphone.jpg"
      }
    ]
  },
  {
    id: 2,
    orderNumber: "ORD-002", 
    date: "2024-01-10",
    status: "shipped",
    total: 179.99,
    items: [
      {
        id: 3,
        name: "Nike Air Jordan",
        price: 179.99,
        quantity: 1,
        image: "/images/shoes.jpg"
      }
    ]
  }
];

// Get orders
router.get("/", (req, res) => {
  try {
    res.json({
      success: true,
      data: mockOrders,
      total: mockOrders.length,
      message: "Orders retrieved successfully"
    });
  } catch (error) {
    console.error("Error in orders route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
      message: error.message
    });
  }
});

module.exports = router;