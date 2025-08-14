const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");

// In-memory cart storage (replace with database in production)
const userCarts = new Map();

// GET /api/cart - Get user cart
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id || 1;
    const cart = userCarts.get(userId) || { items: [], total: 0, itemCount: 0 };

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get cart",
    });
  }
});

// POST /api/cart/add - Add item to cart
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id || 1;
    const { productId, quantity = 1, product } = req.body;

    if (!productId || !product) {
      return res.status(400).json({
        success: false,
        error: "Product ID and product details are required",
      });
    }

    let cart = userCarts.get(userId);
    if (!cart) {
      cart = { items: [], total: 0, itemCount: 0 };
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex !== -1) {
      // Update quantity of existing item
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        id: Date.now(),
        productId,
        name: product.title || product.name, // Handle both title and name
        price: product.price,
        image: product.image,
        quantity,
        seller: product.seller,
      });
    }

    // Recalculate totals
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    userCarts.set(userId, cart);

    res.json({
      success: true,
      message: "Product added to cart",
      data: cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add to cart",
    });
  }
});

// PUT /api/cart/update/:itemId - Update cart item quantity
router.put("/update/:itemId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id || 1;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        error: "Quantity must be at least 1",
      });
    }

    let cart = userCarts.get(userId);
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex((item) => item.id == itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Item not found in cart",
      });
    }

    cart.items[itemIndex].quantity = quantity;

    // Recalculate totals
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    userCarts.set(userId, cart);

    res.json({
      success: true,
      message: "Cart updated",
      data: cart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update cart",
    });
  }
});

// DELETE /api/cart/remove/:itemId - Remove item from cart
router.delete("/remove/:itemId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id || 1;
    const { itemId } = req.params;

    let cart = userCarts.get(userId);
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Cart not found",
      });
    }

    cart.items = cart.items.filter((item) => item.id != itemId);

    // Recalculate totals
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    userCarts.set(userId, cart);

    res.json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({
      success: false,
      error: "Failed to remove from cart",
    });
  }
});

// DELETE /api/cart/clear - Clear entire cart
router.delete("/clear", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id || 1;

    const emptyCart = { items: [], total: 0, itemCount: 0 };
    userCarts.set(userId, emptyCart);

    res.json({
      success: true,
      message: "Cart cleared",
      data: emptyCart,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      error: "Failed to clear cart",
    });
  }
});

module.exports = router;
