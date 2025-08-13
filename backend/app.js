const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const morgan = require("morgan");

// Import routes
const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");
const sellerRoutes = require("./routes/sellers");
const categoryRoutes = require("./routes/categories");
const importRoutes = require("./routes/import");
const productRoutes = require("./routes/products");
const searchRoutes = require("./routes/search");
const healthRoutes = require("./routes/health");
// Temporarily disabled to get basic API running
// const scraperRoutes = require("./routes/scraper");
const trackingRoutes = require("./routes/tracking");
const adminRoutes = require("./routes/admin");
// Temporarily disabled to get basic API running
// const adminScrapingRoutes = require("./routes/admin/scraping");
// Temporarily disabled to get basic API running
// const adminQueuesRoutes = require("./routes/admin/queues");

// Import middleware
const errorHandler = require("./middleware/errorHandler");
const { sanitizeInput } = require("./middleware/validation");
const { cacheAdminMiddleware } = require("./middleware/cache");

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:5173",
          ],
    credentials: true,
  })
);

// Compression middleware
app.use(
  compression({
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
    threshold: 1024,
  })
);

// Logging middleware
const logFormat =
  process.env.NODE_ENV === "production"
    ? "combined"
    : ":method :url :status :response-time ms - :res[content-length]";

app.use(morgan(logFormat));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Input sanitization middleware
app.use(sanitizeInput);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    version: process.env.npm_package_version || "1.0.0",
  });
});

// API info endpoint
app.get("/api", (req, res) => {
  res.json({
    name: "Marketplace Aggregator API",
    version: "1.0.0",
    description: "RESTful API for marketplace listing search and aggregation",
    endpoints: {
      products: {
        getAll: "GET /api/products",
        getById: "GET /api/products/:id",
        search: "GET /api/products?category=&search=&minPrice=&maxPrice=&sortBy=",
      },
      categories: {
        getAll: "GET /api/categories",
        getPopular: "GET /api/categories/popular",
        getById: "GET /api/categories/:id",
      },
      sellers: {
        getAll: "GET /api/sellers",
        getById: "GET /api/sellers/:id",
        getProducts: "GET /api/sellers/:id/products",
      },
      search: {
        search: "GET /api/search?q=&category=&minPrice=&maxPrice=&sortBy=",
        suggestions: "GET /api/search/suggestions?q=",
      },
      listings: {
        search: "GET /api/listings",
        grouped: "GET /api/listings/grouped",
        getById: "GET /api/listings/:id",
        suggestions: "GET /api/listings/search/suggestions",
        categories: "GET /api/listings/categories/popular",
        stats: "GET /api/listings/stats/overview",
      },
      admin: {
        cache: "GET /api/admin/cache",
        scraping: "GET /api/admin/scraping/jobs",
        sellers: "GET /api/admin/sellers",
        dashboard: "GET /api/admin/dashboard/stats",
      },
      health: "GET /api/health",
    },
    documentation: "https://github.com/saifali/market-aggregator",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/import", importRoutes);
app.use("/api/products", productRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/health", healthRoutes);
// Temporarily disabled to get basic API running
// app.use("/api/scraper", scraperRoutes);
app.use("/api/track", trackingRoutes);
app.use("/api/admin", adminRoutes);
// Temporarily disabled to get basic API running
// app.use("/api/admin/scraping", adminScrapingRoutes);
// Temporarily disabled to get basic API running
// app.use("/admin/queues", adminQueuesRoutes);

// Admin routes (cache management)
app.get("/api/admin/cache", cacheAdminMiddleware);

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint not found: ${req.method} ${req.path}`,
    code: "ENDPOINT_NOT_FOUND",
    availableEndpoints: [
      "GET /api/products",
      "GET /api/products/:id",
      "GET /api/categories",
      "GET /api/categories/popular",
      "GET /api/sellers",
      "GET /api/sellers/:id",
      "GET /api/search?q=",
      "GET /api/health",
      "GET /api/listings",
      "GET /api/listings/grouped",
      "GET /api/listings/:id",
      "GET /api/listings/search/suggestions",
      "GET /api/listings/categories/popular",
      "GET /api/listings/stats/overview",
      "GET /api/admin/cache",
      "GET /api/admin/scraping/jobs",
      "GET /api/admin/sellers",
      "GET /api/admin/dashboard/stats",
    ],
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server only if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  });
}

// Export for Vercel serverless
module.exports = app;
