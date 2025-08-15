const express = require("express");
const cors = require("cors");

const app = express();

// Enable trust proxy for Vercel
app.set('trust proxy', 1);

// Basic middleware only
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? ["https://seezymart.vercel.app"] 
    : "*",
  credentials: true
}));

app.use(express.json());

// Import routes
const healthRoutes = require("./routes/health");
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const sellersRoutes = require("./routes/sellers");
const cartRoutes = require("./routes/cart");
const profileRoutes = require("./routes/profile");
const ordersRoutes = require("./routes/orders");
const checkoutRoutes = require("./routes/checkout");

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/sellers", sellersRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/checkout", checkoutRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Market Aggregator Backend API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/api/health",
      detailedHealth: "/api/health/detailed",
      categories: "/api/categories",
      categoriesPopular: "/api/categories/popular",
      products: "/api/products",
      productById: "/api/products/:id",
      sellers: "/api/sellers", 
      sellerById: "/api/sellers/:id",
      sellerProducts: "/api/sellers/:id/products"
    },
    timestamp: new Date().toISOString()
  });
});

// API info route
app.get("/api", (req, res) => {
  res.json({
    message: "Market Aggregator API",
    version: "1.0.0",
    endpoints: [
      "GET /api/health",
      "GET /api/health/detailed",
      "GET /api/categories",
      "GET /api/categories/popular",
      "GET /api/categories/:id"
    ]
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production" 
      ? "Internal server error" 
      : err.message
  });
});

module.exports = app;