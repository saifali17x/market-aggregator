const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const app = express();

// Security and performance middleware
app.use(helmet());
app.use(compression());

// Rate limiting - be careful with this on Vercel
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://seezymart.vercel.app"] // Your frontend domain
        : "*",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Import routes
const healthRoutes = require("./routes/health");
const categoriesRoutes = require("./routes/categories");

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/categories", categoriesRoutes);

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
    },
    timestamp: new Date().toISOString(),
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
      "GET /api/categories/:id",
    ],
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
