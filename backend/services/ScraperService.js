// backend/services/ScraperService.js
const WebScraperEngine = require("./WebScraperEngine");
const Product = require("../models/product");
const fs = require("fs").promises;
const path = require("path");

class ScraperService {
  constructor(options = {}) {
    this.database = options.database || null;
    this.logger = options.logger || console;
    this.activeScrapes = new Map();
    this.configsPath = path.join(__dirname, "..", "config", "sites");
  }

  async loadSiteConfig(siteName) {
    try {
      const configPath = path.join(this.configsPath, `${siteName}.json`);
      const configFile = await fs.readFile(configPath, "utf-8");
      const config = JSON.parse(configFile);

      // Validate required fields
      if (!config.startUrl || !config.selectors?.product) {
        throw new Error(
          `Invalid configuration: missing startUrl or product selector`
        );
      }

      return config;
    } catch (error) {
      this.logger.error?.(
        `Failed to load site config '${siteName}':`,
        error.message
      ) ||
        console.error(
          `Failed to load site config '${siteName}':`,
          error.message
        );
      throw new Error(`Site configuration '${siteName}' not found or invalid`);
    }
  }

  async getAllConfigs() {
    try {
      const files = await fs.readdir(this.configsPath);
      const configs = [];

      for (const file of files.filter((f) => f.endsWith(".json"))) {
        const siteName = file.replace(".json", "");
        try {
          const config = await this.loadSiteConfig(siteName);
          configs.push({
            name: siteName,
            displayName: config.name || siteName,
            description: config.description || "",
            startUrl: config.startUrl,
            status: this.getScrapingStatus(siteName).active
              ? "active"
              : "inactive",
          });
        } catch (error) {
          this.logger.warn?.(`Skipping invalid config: ${file}`) ||
            console.warn(`Skipping invalid config: ${file}`);
        }
      }

      return configs;
    } catch (error) {
      this.logger.error?.("Failed to load configurations:", error) ||
        console.error("Failed to load configurations:", error);
      return [];
    }
  }

  async startScraping(siteName, options = {}) {
    try {
      // Check if scraping is already active for this site
      if (this.activeScrapes.has(siteName)) {
        throw new Error(`Scraping is already active for site: ${siteName}`);
      }

      const siteConfig = await this.loadSiteConfig(siteName);
      const scrapeOptions = {
        delay: options.delay || parseInt(process.env.SCRAPE_DELAY) || 2000,
        maxRetries: options.maxRetries || 3,
        maxPages: options.maxPages || 10,
        proxy: options.proxy || process.env.PROXY_URL,
        ...options,
      };

      const scraper = new WebScraperEngine(
        siteConfig,
        scrapeOptions,
        this.logger
      );
      this.activeScrapes.set(siteName, {
        scraper,
        startTime: new Date(),
        status: "running",
      });

      this.logger.info?.(`Starting scraping for site: ${siteName}`) ||
        console.log(`Starting scraping for site: ${siteName}`);

      // Start scraping with real-time product processing
      const products = await scraper.scrapeAllPages(async (batchProducts) => {
        try {
          await this.saveBatchProducts(batchProducts, siteName);
          this.logger.info?.(
            `Saved batch of ${batchProducts.length} products from ${siteName}`
          ) ||
            console.log(
              `Saved batch of ${batchProducts.length} products from ${siteName}`
            );
        } catch (error) {
          this.logger.error?.("Failed to save product batch:", error) ||
            console.error("Failed to save product batch:", error);
        }
      });

      const scrapingData = this.activeScrapes.get(siteName);
      scrapingData.status = "completed";
      scrapingData.endTime = new Date();
      scrapingData.results = {
        totalProducts: products.length,
        stats: scraper.getStats(),
      };

      // Clean up after completion
      setTimeout(() => {
        this.activeScrapes.delete(siteName);
      }, 60000); // Keep results for 1 minute

      return {
        success: true,
        siteName,
        totalProducts: products.length,
        stats: scraper.getStats(),
        duration: scrapingData.endTime - scrapingData.startTime,
      };
    } catch (error) {
      // Clean up on error
      this.activeScrapes.delete(siteName);
      this.logger.error?.(`Scraping failed for site ${siteName}:`, error) ||
        console.error(`Scraping failed for site ${siteName}:`, error);

      throw {
        success: false,
        siteName,
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  async saveBatchProducts(products, siteName) {
    if (!products || products.length === 0) return;

    try {
      if (this.database) {
        await this.saveToDatabase(products, siteName);
      } else {
        this.logger.warn?.("No database configured, products not saved") ||
          console.warn("No database configured, products not saved");
      }
    } catch (error) {
      this.logger.error?.("Failed to save products to database:", error) ||
        console.error("Failed to save products to database:", error);
      throw error;
    }
  }

  async saveToDatabase(products, siteName) {
    // This method should be customized based on your database type

    if (this.database.collection) {
      // MongoDB implementation
      await this.saveToMongoDB(products, siteName);
    } else if (this.database.query) {
      // SQL Database implementation
      await this.saveToSQL(products, siteName);
    } else if (Product.bulkCreate) {
      // Sequelize ORM implementation
      await this.saveWithSequelize(products, siteName);
    } else {
      throw new Error("Database type not supported");
    }
  }

  async saveToMongoDB(products, siteName) {
    const operations = products.map((product) => ({
      updateOne: {
        filter: {
          title: product.title,
          siteName: siteName,
          sourceUrl: product.sourceUrl,
        },
        update: {
          $set: {
            ...product,
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    const result = await this.database
      .collection("products")
      .bulkWrite(operations);
    this.logger.info?.(
      `MongoDB: Upserted ${result.upsertedCount} new products, modified ${result.modifiedCount}`
    ) ||
      console.log(
        `MongoDB: Upserted ${result.upsertedCount} new products, modified ${result.modifiedCount}`
      );
  }

  async saveToSQL(products, siteName) {
    const client = this.database;

    for (const product of products) {
      const query = `
        INSERT INTO products (
          title, price, currency, image_url, product_url, description,
          brand, category, availability, rating, review_count,
          source_url, site_name, scraped_at, metadata, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
        )
        ON CONFLICT (title, source_url, site_name) 
        DO UPDATE SET 
          price = EXCLUDED.price,
          currency = EXCLUDED.currency,
          image_url = EXCLUDED.image_url,
          product_url = EXCLUDED.product_url,
          description = EXCLUDED.description,
          brand = EXCLUDED.brand,
          category = EXCLUDED.category,
          availability = EXCLUDED.availability,
          rating = EXCLUDED.rating,
          review_count = EXCLUDED.review_count,
          metadata = EXCLUDED.metadata,
          updated_at = EXCLUDED.updated_at
      `;

      const values = [
        product.title,
        product.price,
        product.currency,
        product.imageUrl,
        product.productUrl,
        product.description,
        product.brand,
        product.category,
        product.availability,
        product.rating,
        product.reviewCount,
        product.sourceUrl,
        siteName,
        product.scrapedAt,
        JSON.stringify(product.metadata),
        new Date(),
        new Date(),
      ];

      await client.query(query, values);
    }

    this.logger.info?.(`SQL: Processed ${products.length} products`) ||
      console.log(`SQL: Processed ${products.length} products`);
  }

  async saveWithSequelize(products, siteName) {
    const productData = products.map((product) => ({
      ...product,
      siteName,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await Product.bulkCreate(productData, {
      updateOnDuplicate: ["price", "imageUrl", "availability", "updatedAt"],
      ignoreDuplicates: false,
    });

    this.logger.info?.(`Sequelize: Processed ${result.length} products`) ||
      console.log(`Sequelize: Processed ${result.length} products`);
  }

  getScrapingStatus(siteName) {
    const scrapeData = this.activeScrapes.get(siteName);

    if (!scrapeData) {
      return { active: false, status: "inactive" };
    }

    return {
      active: scrapeData.status === "running",
      status: scrapeData.status,
      startTime: scrapeData.startTime,
      endTime: scrapeData.endTime,
      stats: scrapeData.scraper?.getStats(),
      results: scrapeData.results,
    };
  }

  async stopScraping(siteName) {
    const scrapeData = this.activeScrapes.get(siteName);

    if (!scrapeData || scrapeData.status !== "running") {
      return {
        success: false,
        message: `No active scraping found for site: ${siteName}`,
      };
    }

    try {
      await scrapeData.scraper.cleanup();
      scrapeData.status = "stopped";
      scrapeData.endTime = new Date();

      this.logger.info?.(`Scraping stopped for site: ${siteName}`) ||
        console.log(`Scraping stopped for site: ${siteName}`);

      return {
        success: true,
        message: `Scraping stopped for site: ${siteName}`,
        duration: scrapeData.endTime - scrapeData.startTime,
      };
    } catch (error) {
      this.logger.error?.(`Error stopping scraping for ${siteName}:`, error) ||
        console.error(`Error stopping scraping for ${siteName}:`, error);

      return {
        success: false,
        message: `Error stopping scraping: ${error.message}`,
      };
    }
  }

  async testSiteConfig(siteName, testUrl = null) {
    try {
      const siteConfig = await this.loadSiteConfig(siteName);

      if (testUrl) {
        siteConfig.startUrl = testUrl;
      }

      const scraper = new WebScraperEngine(
        siteConfig,
        {
          delay: 1000,
          maxPages: 1,
        },
        this.logger
      );

      await scraper.initialize();
      const products = await scraper.scrapePage(siteConfig.startUrl);
      await scraper.cleanup();

      return {
        success: true,
        siteName,
        testUrl: siteConfig.startUrl,
        productsFound: products.length,
        sampleProducts: products.slice(0, 3).map((p) => ({
          title: p.title,
          price: p.price,
          imageUrl: p.imageUrl,
        })),
        message: `Configuration test successful: found ${products.length} products`,
      };
    } catch (error) {
      return {
        success: false,
        siteName,
        error: error.message,
        message: `Configuration test failed: ${error.message}`,
      };
    }
  }

  getAllActiveScrapings() {
    const active = [];

    for (const [siteName, scrapeData] of this.activeScrapes) {
      if (scrapeData.status === "running") {
        active.push({
          siteName,
          startTime: scrapeData.startTime,
          stats: scrapeData.scraper?.getStats(),
        });
      }
    }

    return active;
  }

  async getScrapingHistory(limit = 50) {
    // This would typically query your database for historical scraping data
    // Implementation depends on your database structure

    if (this.database?.collection) {
      // MongoDB example
      return await this.database
        .collection("scraping_history")
        .find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
    } else if (this.database?.query) {
      // SQL example
      const result = await this.database.query(
        "SELECT * FROM scraping_history ORDER BY created_at DESC LIMIT $1",
        [limit]
      );
      return result.rows;
    }

    return [];
  }
}

module.exports = ScraperService;
