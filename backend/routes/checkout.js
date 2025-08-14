const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");

// In-memory order storage (replace with database in production)
const userOrders = new Map();

// POST /api/checkout - Process checkout
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id || 1;
    const { 
      cartItems, 
      shippingAddress, 
      billingAddress, 
      paymentMethod, 
      paymentDetails 
    } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Cart is empty"
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        error: "Shipping address is required"
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        error: "Payment method is required"
      });
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 9.99; // Fixed shipping cost
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    // Create order
    const order = {
      id: Date.now(),
      orderNumber: `ORD-${Date.now()}`,
      userId,
      status: "pending",
      items: cartItems,
      subtotal,
      shipping,
      tax,
      total,
      currency: "USD",
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      paymentDetails,
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };

    // Store order
    if (!userOrders.has(userId)) {
      userOrders.set(userId, []);
    }
    userOrders.get(userId).push(order);

    // In a real application, you would:
    // 1. Process payment with payment gateway
    // 2. Update inventory
    // 3. Send confirmation emails
    // 4. Create shipping labels

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        estimatedDelivery: order.estimatedDelivery
      }
    });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process checkout"
    });
  }
});

// GET /api/checkout/shipping-options - Get available shipping options
router.get("/shipping-options", async (req, res) => {
  try {
    const shippingOptions = [
      {
        id: "standard",
        name: "Standard Shipping",
        price: 9.99,
        estimatedDays: "5-7 business days",
        description: "Standard ground shipping"
      },
      {
        id: "express",
        name: "Express Shipping",
        price: 19.99,
        estimatedDays: "2-3 business days",
        description: "Faster delivery option"
      },
      {
        id: "overnight",
        name: "Overnight Shipping",
        price: 39.99,
        estimatedDays: "1 business day",
        description: "Next day delivery"
      }
    ];

    res.json({
      success: true,
      data: shippingOptions
    });
  } catch (error) {
    console.error("Error getting shipping options:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get shipping options"
    });
  }
});

// POST /api/checkout/validate-address - Validate shipping address
router.post("/validate-address", async (req, res) => {
  try {
    const { address } = req.body;
    
    // For now, just return success - you can integrate with address validation service later
    const isValid = address && address.street && address.city && address.state && address.zipCode;
    
    res.json({
      success: true,
      data: {
        isValid,
        suggestions: isValid ? [] : [
          "Please provide a complete street address",
          "City is required",
          "State is required",
          "ZIP code is required"
        ]
      }
    });
  } catch (error) {
    console.error("Error validating address:", error);
    res.status(500).json({
      success: false,
      error: "Failed to validate address"
    });
  }
});

// POST /api/checkout/calculate-tax - Calculate tax for order
router.post("/calculate-tax", async (req, res) => {
  try {
    const { subtotal, shippingAddress } = req.body;
    
    // For now, use a simple tax calculation - you can integrate with tax service later
    const taxRate = 0.08; // 8% tax rate
    const tax = subtotal * taxRate;
    
    res.json({
      success: true,
      data: {
        taxRate,
        tax,
        total: subtotal + tax
      }
    });
  } catch (error) {
    console.error("Error calculating tax:", error);
    res.status(500).json({
      success: false,
      error: "Failed to calculate tax"
    });
  }
});

module.exports = router;
