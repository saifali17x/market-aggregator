// backend/controllers/scraperController.js
const ScraperService = require("../services/ScraperService");

class ScraperController {
  constructor(database = null, logger = console) {
    this.scraperService = new ScraperService({ database, logger });
    this.logger = logger;
  }

  // GET /api/scraper/configs
  async getConfigs(req, res) {
    try {
      const configs = await this.scraperService.getAllConfigs();

      res.json({
        success: true,
        data: configs,
        message: `Found ${configs.length} site configurations`,
      });
    } catch (error) {
      this.logger.error?.("Error fetching configs:", error) ||
        console.error("Error fetching configs:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch site configurations",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // POST /api/scraper/start/:siteName
  async startScraping(req, res) {
    try {
      const { siteName } = req.params;
      const options = req.body || {};

      // Validate site name
      if (!siteName || typeof siteName !== "string") {
        return res.status(400).json({
          success: false,
          message: "Site name is required",
        });
      }

      this.logger.info?.(`Starting scraping request for: ${siteName}`) ||
        console.log(`Starting scraping request for: ${siteName}`);

      const result = await this.scraperService.startScraping(siteName, options);

      res.json({
        success: true,
        data: result,
        message: `Scraping completed successfully for ${siteName}`,
      });
    } catch (error) {
      this.logger.error?.("Error starting scraping:", error) ||
        console.error("Error starting scraping:", error);

      const statusCode = error.message?.includes("already active")
        ? 409
        : error.message?.includes("not found")
        ? 404
        : 500;

      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to start scraping",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  }

  // GET /api/scraper/status/:siteName
  async getScrapingStatus(req, res) {
    try {
      const { siteName } = req.params;

      if (!siteName) {
        return res.status(400).json({
          success: false,
          message: "Site name is required",
        });
      }

      const status = this.scraperService.getScrapingStatus(siteName);

      res.json({
        success: true,
        data: {
          siteName,
          ...status,
        },
      });
    } catch (error) {
      this.logger.error?.("Error fetching scraping status:", error) ||
        console.error("Error fetching scraping status:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch scraping status",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // POST /api/scraper/stop/:siteName
  async stopScraping(req, res) {
    try {
      const { siteName } = req.params;

      if (!siteName) {
        return res.status(400).json({
          success: false,
          message: "Site name is required",
        });
      }

      const result = await this.scraperService.stopScraping(siteName);

      const statusCode = result.success ? 200 : 400;
      res.status(statusCode).json(result);
    } catch (error) {
      this.logger.error?.("Error stopping scraping:", error) ||
        console.error("Error stopping scraping:", error);

      res.status(500).json({
        success: false,
        message: "Failed to stop scraping",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // POST /api/scraper/test/:siteName
  async testConfig(req, res) {
    try {
      const { siteName } = req.params;
      const { testUrl } = req.body || {};

      if (!siteName) {
        return res.status(400).json({
          success: false,
          message: "Site name is required",
        });
      }

      this.logger.info?.(`Testing configuration for: ${siteName}`) ||
        console.log(`Testing configuration for: ${siteName}`);

      const result = await this.scraperService.testSiteConfig(
        siteName,
        testUrl
      );

      const statusCode = result.success ? 200 : 400;
      res.status(statusCode).json(result);
    } catch (error) {
      this.logger.error?.("Error testing configuration:", error) ||
        console.error("Error testing configuration:", error);

      res.status(500).json({
        success: false,
        message: "Failed to test configuration",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // GET /api/scraper/active
  async getActiveScrapings(req, res) {
    try {
      const activeScrapings = this.scraperService.getAllActiveScrapings();

      res.json({
        success: true,
        data: {
          active: activeScrapings,
          count: activeScrapings.length,
        },
        message: `Found ${activeScrapings.length} active scraping operations`,
      });
    } catch (error) {
      this.logger.error?.("Error fetching active scrapings:", error) ||
        console.error("Error fetching active scrapings:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch active scrapings",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // GET /api/scraper/history
  async getScrapingHistory(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;

      const history = await this.scraperService.getScrapingHistory(
        parseInt(limit)
      );

      res.json({
        success: true,
        data: {
          history,
          pagination: {
            limit: parseInt(limit),
            offset: parseInt(offset),
            total: history.length,
          },
        },
      });
    } catch (error) {
      this.logger.error?.("Error fetching scraping history:", error) ||
        console.error("Error fetching scraping history:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch scraping history",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // GET /api/scraper/products
  async getScrapedProducts(req, res) {
    try {
      const {
        siteName,
        limit = 50,
        offset = 0,
        sortBy = "scrapedAt",
        sortOrder = "desc",
        minPrice,
        maxPrice,
        search,
      } = req.query;

      // This method would depend on your database implementation
      // Here's a generic example that you'd customize for your DB

      let query = {};
      let sort = {};

      // Build query filters
      if (siteName) {
        query.siteName = siteName;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
        ];
      }

      // Build sort
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;

      let products, total;

      // MongoDB example
      if (req.app.get("database")?.collection) {
        const db = req.app.get("database");
        products = await db
          .collection("products")
          .find(query)
          .sort(sort)
          .limit(parseInt(limit))
          .skip(parseInt(offset))
          .toArray();

        total = await db.collection("products").countDocuments(query);
      }
      // SQL example
      else if (req.app.get("database")?.query) {
        // You'd build SQL query here based on filters
        const db = req.app.get("database");
        const result = await db.query(
          "SELECT * FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2",
          [parseInt(limit), parseInt(offset)]
        );
        products = result.rows;

        const countResult = await db.query("SELECT COUNT(*) FROM products");
        total = parseInt(countResult.rows[0].count);
      } else {
        throw new Error("Database not properly configured");
      }

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            total,
            limit: parseInt(limit),
            offset: parseInt(offset),
            pages: Math.ceil(total / parseInt(limit)),
            currentPage: Math.floor(parseInt(offset) / parseInt(limit)) + 1,
            hasMore: parseInt(offset) + parseInt(limit) < total,
          },
          filters: {
            siteName,
            minPrice,
            maxPrice,
            search,
            sortBy,
            sortOrder,
          },
        },
      });
    } catch (error) {
      this.logger.error?.("Error fetching products:", error) ||
        console.error("Error fetching products:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch products",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // DELETE /api/scraper/products/:siteName
  async deleteProductsBySite(req, res) {
    try {
      const { siteName } = req.params;

      if (!siteName) {
        return res.status(400).json({
          success: false,
          message: "Site name is required",
        });
      }

      let deletedCount = 0;

      // MongoDB example
      if (req.app.get("database")?.collection) {
        const result = await req.app
          .get("database")
          .collection("products")
          .deleteMany({ siteName });
        deletedCount = result.deletedCount;
      }
      // SQL example
      else if (req.app.get("database")?.query) {
        const result = await req.app
          .get("database")
          .query("DELETE FROM products WHERE site_name = $1", [siteName]);
        deletedCount = result.rowCount;
      }

      res.json({
        success: true,
        message: `Deleted ${deletedCount} products from ${siteName}`,
        data: { deletedCount, siteName },
      });
    } catch (error) {
      this.logger.error?.("Error deleting products:", error) ||
        console.error("Error deleting products:", error);

      res.status(500).json({
        success: false,
        message: "Failed to delete products",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

module.exports = ScraperController;
