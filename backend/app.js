const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Basic routes - completely self-contained
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});

app.get("/api/products", (req, res) => {
  res.json({ success: true, data: [], message: "Products endpoint" });
});

app.get("/api/categories", (req, res) => {
  res.json({ success: true, data: [], message: "Categories endpoint" });
});

app.get("/api/sellers", (req, res) => {
  res.json({ success: true, data: [], message: "Sellers endpoint" });
});

// Start server if running directly
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
