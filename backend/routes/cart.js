const express = require("express");
const router = express.Router();

// Mock cart data (replace with real database later)
let mockCart = {
  items: [
    {
      id: 1,
      productId: 1,
      name: "iPhone 15 Pro",
      price: 999.99,
      quantity: 1,
      image: "/images/iphone.jpg"
    }
  ],
  total: 999.99,
  itemCount: 1
};

// Get cart
router.get("/", (req, res) => {
  try {
    res.json({
      success: true,
      data: mockCart,
      message: "Cart retrieved successfully"
    });
  } catch (error) {
    console.error("Error in cart route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch cart",
      message: error.message
    });
  }
});

// Add item to cart
router.post("/", (req, res) => {
  try {
    const { productId, name, price, quantity = 1, image } = req.body;
    
    const newItem = {
      id: Date.now(),
      productId,
      name,
      price,
      quantity,
      image
    };
    
    mockCart.items.push(newItem);
    mockCart.itemCount = mockCart.items.reduce((sum, item) => sum + item.quantity, 0);
    mockCart.total = mockCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      success: true,
      data: mockCart,
      message: "Item added to cart"
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add item to cart",
      message: error.message
    });
  }
});

module.exports = router;