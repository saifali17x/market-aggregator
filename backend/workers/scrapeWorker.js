const { Worker } = require("bullmq");
const { chromium } = require("playwright");
const robotsParser = require("robots-parser");
const { queueManager } = require("../jobs/queue");
const { logger } = require("../utils/logger");
const MatchingService = require("../services/matchingService");
const PricingService = require("../services/pricingService");
const { ScrapingJob, Product, Seller, Listing } = require("../models");

/**
 * Scraping Worker
 * Processes scraping jobs from the queue
 */
class ScrapeWorker {
  constructor() {
    this.browser = null;
    this.matchingService = new MatchingService();
    this.pricingService = new PricingService();
    this.isRunning = false;
  }

  /**
   * Initialize the worker
   */
  async initialize() {
    try {
      // Initialize browser
      await this.initializeBrowser();
      
      // Create worker
      this.worker = new Worker(
        "scraping",
        async (job) => {
          return await this.processScrapingJob(job);
        },
        {
          connection: queueManager.redis,
          concurrency: parseInt(process.env.BULLMQ_CONCURRENCY) || 5,
          removeOnComplete: 100,
          removeOnFail: 50,
        }
      );

      // Set up worker event handlers
      this.worker.on("completed", (job) => {
        logger.info(`Scraping job ${job.id} completed successfully`);
      });

      this.worker.on("failed", (job, err) => {
        logger.error(`Scraping job ${job.id} failed:`, err.message);
      });

      this.worker.on("error", (err) => {
        logger.error("Scraping worker error:", err);
      });

      logger.info("Scraping worker initialized successfully");
      return true;
    } catch (error) {
      logger.error("Failed to initialize scraping worker:", error);
      throw error;
    }
  }

  /**
   * Initialize Playwright browser
   */
  async initializeBrowser() {
    try {
      this.browser = await chromium.launch({
        headless: process.env.HEADLESS === "true",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
        ],
      });

      logger.info("Browser initialized successfully");
    } catch (error) {
      logger.error("Failed to initialize browser:", error);
      throw error;
    }
  }

  /**
   * Process a scraping job
   */
  async processScrapingJob(job) {
    const { platform, searchQuery, maxPages, filters, priority } = job.data;
    
    try {
      logger.info(`Processing scraping job for ${platform}: ${searchQuery}`);
      
      // Update job status
      await this.updateJobStatus(job.id, "running");
      
      // Check compliance
      if (!this.isScrapingAllowed(platform)) {
        throw new Error(`Scraping not allowed for ${platform}`);
      }
      
      // Load site configuration
      const siteConfig = await this.loadSiteConfig(platform);
      if (!siteConfig) {
        throw new Error(`Site configuration not found for ${platform}`);
      }
      
      // Check robots.txt compliance
      if (!await this.checkRobotsCompliance(siteConfig)) {
        throw new Error(`Robots.txt compliance check failed for ${platform}`);
      }
      
      // Run the scraper
      const results = await this.scrapeSite(siteConfig, {
        searchQuery,
        maxPages: maxPages || 10,
        filters: filters || {},
      });
      
      // Process scraped data
      const processedResults = await this.processScrapedData(results, platform);
      
      // Update job status
      await this.updateJobStatus(job.id, "completed", {
        results: processedResults,
        timestamp: new Date().toISOString(),
      });
      
      logger.info(`Scraping job ${job.id} completed: ${processedResults.products.length} products found`);
      
      return processedResults;
      
    } catch (error) {
      logger.error(`Scraping job ${job.id} failed:`, error);
      
      // Update job status
      await this.updateJobStatus(job.id, "failed", {
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      
      throw error;
    }
  }

  /**
   * Check if scraping is allowed for the platform
   */
  isScrapingAllowed(platform) {
    const platformKey = `${platform.toUpperCase()}_SCRAPING_ENABLED`;
    const isEnabled = process.env[platformKey];
    
    if (isEnabled === "false") {
      return false;
    }
    
    // Check high-risk platforms
    const highRiskPlatforms = ["facebook", "instagram"];
    if (highRiskPlatforms.includes(platform.toLowerCase())) {
      return process.env.ENABLE_HIGH_RISK_SCRAPERS === "true" && 
             process.env.TOS_RISK_ACK === "true";
    }
    
    return true;
  }

  /**
   * Load site configuration
   */
  async loadSiteConfig(platform) {
    try {
      const configPath = require("path").join(__dirname, "../config/sites", `${platform}.json`);
      const fs = require("fs");
      
      if (!fs.existsSync(configPath)) {
        throw new Error(`Configuration file not found: ${configPath}`);
      }
      
      const configData = fs.readFileSync(configPath, "utf8");
      return JSON.parse(configData);
    } catch (error) {
      logger.error(`Error loading site config for ${platform}:`, error);
      return null;
    }
  }

  /**
   * Check robots.txt compliance
   */
  async checkRobotsCompliance(siteConfig) {
    if (process.env.OVERRIDE_ROBOTS === "true") {
      logger.warn("Robots.txt compliance overridden");
      return true;
    }
    
    if (!siteConfig.rateLimiting?.respectRobotsTxt) {
      return true;
    }
    
    try {
      const context = await this.browser.newContext();
      const page = await context.newPage();
      
      const robotsUrl = new URL("/robots.txt", siteConfig.baseUrl).toString();
      const response = await page.goto(robotsUrl, { timeout: 10000 });
      
      if (response.ok()) {
        const robotsText = await response.text();
        const robots = robotsParser(robotsUrl, robotsText);
        
        const isAllowed = robots.isAllowed(siteConfig.searchUrl, "WebScraper/1.0");
        
        await context.close();
        
        if (!isAllowed) {
          logger.warn(`Access denied by robots.txt for ${siteConfig.name}`);
          return false;
        }
      }
      
      await context.close();
      return true;
    } catch (error) {
      logger.warn("Robots.txt check failed:", error.message);
      return true; // Allow scraping if robots.txt check fails
    }
  }

  /**
   * Scrape a specific site
   */
  async scrapeSite(siteConfig, options) {
    const { searchQuery, maxPages, filters } = options;
    
    const results = {
      platform: siteConfig.platform,
      searchQuery,
      products: [],
      errors: [],
      startTime: new Date(),
    };
    
    try {
      const context = await this.browser.newContext({
        userAgent: siteConfig.metadata?.userAgent || "Mozilla/5.0 (compatible; WebScraper/1.0)",
        viewport: siteConfig.metadata?.viewport || { width: 1920, height: 1080 },
      });
      
      const page = await context.newPage();
      
      // Navigate to search page
      const searchUrl = this.buildSearchUrl(siteConfig, searchQuery, filters);
      await page.goto(searchUrl, { waitUntil: "networkidle", timeout: 30000 });
      
      let currentPage = 1;
      let hasNextPage = true;
      
      while (currentPage <= maxPages && hasNextPage) {
        logger.info(`Scraping page ${currentPage} of ${siteConfig.name}`);
        
        // Extract products from current page
        const pageProducts = await this.extractProducts(page, siteConfig);
        results.products.push(...pageProducts);
        
        // Check if there's a next page
        hasNextPage = await this.hasNextPage(page, siteConfig);
        
        if (hasNextPage && currentPage < maxPages) {
          await this.goToNextPage(page, siteConfig);
          await this.delay(parseInt(process.env.SCRAPE_DELAY) || 2000);
          currentPage++;
        } else {
          break;
        }
      }
      
      await context.close();
      
    } catch (error) {
      results.errors.push({
        step: "scraping",
        error: error.message,
      });
      logger.error("Error during scraping:", error);
    }
    
    results.endTime = new Date();
    results.duration = results.endTime - results.startTime;
    
    return results;
  }

  /**
   * Extract products from a page
   */
  async extractProducts(page, siteConfig) {
    const products = [];
    
    try {
      const productElements = await page.$$(siteConfig.selectors.product);
      
      for (const element of productElements) {
        try {
          const productData = await this.extractProductData(element, siteConfig);
          if (productData.title && productData.price) {
            products.push(productData);
          }
        } catch (error) {
          logger.warn("Error extracting product data:", error.message);
        }
      }
    } catch (error) {
      logger.error("Error extracting products:", error);
    }
    
    return products;
  }

  /**
   * Extract data from a single product element
   */
  async extractProductData(element, siteConfig) {
    const productData = {
      title: "",
      price: 0,
      description: "",
      imageUrl: "",
      productUrl: "",
      location: "",
      seller: "",
      condition: "unknown",
      source: siteConfig.platform,
      extractedAt: new Date(),
    };
    
    try {
      // Extract title
      if (siteConfig.selectors.title) {
        const titleElement = await element.$(siteConfig.selectors.title);
        if (titleElement) {
          productData.title = await titleElement.textContent();
        }
      }
      
      // Extract price
      if (siteConfig.selectors.price) {
        const priceElement = await element.$(siteConfig.selectors.price);
        if (priceElement) {
          const priceText = await priceElement.textContent();
          productData.price = this.extractPrice(priceText);
        }
      }
      
      // Extract other fields...
      // (Similar extraction logic for description, image, URL, etc.)
      
    } catch (error) {
      logger.warn("Error extracting product data:", error.message);
    }
    
    return productData;
  }

  /**
   * Process scraped data
   */
  async processScrapedData(results, platform) {
    const processed = {
      platform,
      products: [],
      listings: [],
      errors: [],
    };
    
    for (const productData of results.products) {
      try {
        // Find or create product match
        const matchResult = await this.matchingService.findOrCreateMatch({
          title: productData.title,
          brand: this.extractBrand(productData.title),
          model: this.extractModel(productData.title),
          description: productData.description,
          source: platform,
          externalId: productData.productUrl,
        });
        
        // Find or create seller
        let seller = null;
        if (productData.seller) {
          seller = await this.findOrCreateSeller({
            name: productData.seller,
            platform,
            platformUrl: productData.productUrl,
          });
        }
        
        // Create listing
        const listing = await Listing.create({
          title: productData.title,
          description: productData.description,
          price: productData.price,
          currency: "USD",
          condition: this.normalizeCondition(productData.condition),
          availabilityStatus: "available",
          images: productData.imageUrl ? [productData.imageUrl] : [],
          link: productData.productUrl,
          source: platform,
          productId: matchResult.product.id,
          sellerId: seller?.id,
          platformListingId: this.extractPlatformId(productData.productUrl),
          platformUrl: productData.productUrl,
          location: productData.location,
          status: "scraped",
          scrapedAt: new Date(),
        });
        
        // Normalize price
        await this.pricingService.normalizeListingPrice(listing);
        
        processed.listings.push(listing);
        processed.products.push(matchResult.product);
        
      } catch (error) {
        processed.errors.push({
          product: productData.title,
          error: error.message,
        });
        logger.error("Error processing product:", error);
      }
    }
    
    return processed;
  }

  /**
   * Update job status
   */
  async updateJobStatus(jobId, status, data = {}) {
    try {
      const job = await ScrapingJob.findOne({
        where: { id: jobId },
      });
      
      if (job) {
        await job.update({
          status,
          lastRun: new Date(),
          results: data.results || null,
          errorMessage: data.error || null,
        });
      }
    } catch (error) {
      logger.error("Failed to update job status:", error);
    }
  }

  /**
   * Utility methods
   */
  buildSearchUrl(siteConfig, query, filters) {
    let url = siteConfig.searchUrl;
    
    if (query && siteConfig.filters?.category) {
      url += siteConfig.filters.category.replace("{query}", encodeURIComponent(query));
    }
    
    return url;
  }
  
  hasNextPage(page, siteConfig) {
    // Implementation for checking next page
    return false;
  }
  
  goToNextPage(page, siteConfig) {
    // Implementation for navigating to next page
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  extractPrice(priceText) {
    if (!priceText) return 0;
    const match = priceText.match(/[\d,]+\.?\d*/);
    return match ? parseFloat(match[0].replace(/,/g, "")) : 0;
  }
  
  extractBrand(title) {
    // Implementation for brand extraction
    return null;
  }
  
  extractModel(title) {
    // Implementation for model extraction
    return null;
  }
  
  normalizeCondition(condition) {
    // Implementation for condition normalization
    return "unknown";
  }
  
  extractPlatformId(url) {
    // Implementation for platform ID extraction
    return null;
  }
  
  async findOrCreateSeller(sellerData) {
    // Implementation for seller creation
    return null;
  }

  /**
   * Shutdown worker
   */
  async shutdown() {
    try {
      if (this.worker) {
        await this.worker.close();
      }
      
      if (this.browser) {
        await this.browser.close();
      }
      
      logger.info("Scraping worker shutdown completed");
    } catch (error) {
      logger.error("Error during scraping worker shutdown:", error);
    }
  }
}

module.exports = ScrapeWorker;
