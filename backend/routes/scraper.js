// backend/routes/scraper.js
const express = require("express");
const ScraperController = require("../controllers/scraperController");

const router = express.Router();

// Middleware to initialize controller with database and logger
router.use((req, res, next) => {
  if (!req.scraperController) {
    const database = req.app.get("database");
    const logger = req.app.get("logger") || console;
    req.scraperController = new ScraperController(database, logger);
  }
  next();
});

// Configuration routes
router.get("/configs", (req, res) =>
  req.scraperController.getConfigs(req, res)
);

// Scraping control routes
router.post("/start/:siteName", (req, res) =>
  req.scraperController.startScraping(req, res)
);
router.get("/status/:siteName", (req, res) =>
  req.scraperController.getScrapingStatus(req, res)
);
router.post("/stop/:siteName", (req, res) =>
  req.scraperController.stopScraping(req, res)
);

// Testing routes
router.post("/test/:siteName", (req, res) =>
  req.scraperController.testConfig(req, res)
);

// Monitoring routes
router.get("/active", (req, res) =>
  req.scraperController.getActiveScrapings(req, res)
);
router.get("/history", (req, res) =>
  req.scraperController.getScrapingHistory(req, res)
);

// Product data routes
router.get("/products", (req, res) =>
  req.scraperController.getScrapedProducts(req, res)
);
router.delete("/products/:siteName", (req, res) =>
  req.scraperController.deleteProductsBySite(req, res)
);

module.exports = router;
