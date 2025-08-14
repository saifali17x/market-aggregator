const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");

// GET /api/orders - Get user orders
router.get("/", authenticateToken, async (req, res) => {
  try {
    // For now, return mock data - you can integrate with your orders database later
    const orders = [
      {
        id: 1,
        orderNumber: "ORD-2024-001",
        status: "delivered",
        total: 299.99,
        currency: "USD",
        items: [
          {
            id: 1,
            name: "Wireless Bluetooth Headphones",
            price: 99.99,
            quantity: 2,
            image:
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop",
          },
          {
            id: 2,
            name: "Smart Watch",
            price: 199.99,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop",
          },
        ],
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
        },
        createdAt: "2024-01-15T10:30:00Z",
        deliveredAt: "2024-01-20T14:00:00Z",
      },
      {
        id: 2,
        orderNumber: "ORD-2024-002",
        status: "processing",
        total: 149.99,
        currency: "USD",
        items: [
          {
            id: 3,
            name: "Laptop Stand",
            price: 49.99,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop",
          },
          {
            id: 4,
            name: "USB-C Cable",
            price: 19.99,
            quantity: 5,
            image:
              "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&h=150&fit=crop",
          },
        ],
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
        },
        createdAt: "2024-01-25T09:15:00Z",
      },
    ];

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get orders",
    });
  }
});

// GET /api/orders/:id - Get specific order
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;

    // For now, return mock data - you can integrate with your orders database later
    const order = {
      id: orderId,
      orderNumber: `ORD-2024-${orderId.padStart(3, "0")}`,
      status: "delivered",
      total: 299.99,
      currency: "USD",
      items: [
        {
          id: 1,
          name: "Wireless Bluetooth Headphones",
          price: 99.99,
          quantity: 2,
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop",
        },
        {
          id: 2,
          name: "Smart Watch",
          price: 199.99,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop",
        },
      ],
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      createdAt: "2024-01-15T10:30:00Z",
      deliveredAt: "2024-01-20T14:00:00Z",
    };

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get order",
    });
  }
});

// POST /api/orders - Create new order
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // For now, just return success - you can integrate with your orders database later
    const newOrder = {
      id: Math.floor(Math.random() * 1000) + 1,
      orderNumber: `ORD-2024-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      status: "pending",
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      currency: "USD",
      items: items,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      createdAt: new Date().toISOString(),
    };

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create order",
    });
  }
});

module.exports = router;
