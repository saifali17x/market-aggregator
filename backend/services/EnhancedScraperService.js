const { chromium } = require("playwright");
const robotsParser = require("robots-parser");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const { ScrapingJob, Product, Seller, Listing } = require("../models");
const ProductMatchingService = require("./ProductMatchingService");

/**
 * Enhanced Scraper Service
 * Handles multi-platform scraping with scheduling and product matching
 */
class EnhancedScraperService {
  constructor() {
    this.browser = null;
    this.isRunning = false;
    this.activeJobs = new Map();
    this.scheduledJobs = new Map();
    this.initializeScheduler();
  }

  /**
   * Initialize the cron scheduler
   */
  async initializeScheduler() {
    try {
      // Load scheduled jobs from database
      const jobs = await ScrapingJob.getScheduledJobs();
      
      for (const job of jobs) {
        if (job.schedule) {
          this.scheduleJob(job);
        }
      }

      console.log(`📅 Scheduled ${jobs.length} scraping jobs`);
    } catch (error) {
      console.error("Error initializing scheduler:", error);
    }
  }

  /**
   * Schedule a scraping job
   * @param {Object} job - Scraping job object
   */
  scheduleJob(job) {
    if (this.scheduledJobs.has(job.id)) {
      this.scheduledJobs.get(job.id).destroy();
    }

    const task = cron.schedule(job.schedule, () => {
      this.runScheduledJob(job.id);
    }, {
      scheduled: true,
      timezone: "UTC"
    });

    this.scheduledJobs.set(job.id, task);
    console.log(`📅 Scheduled job: ${job.name} (${job.schedule})`);
  }

  /**
   * Run a scheduled scraping job
   * @param {string} jobId - Job ID to run
   */
  async runScheduledJob(jobId) {
    try {
      const job = await ScrapingJob.findByPk(jobId);
      if (!job || !job.canRun()) return;

      await this.runScrapingJob(job);
    } catch (error) {
      console.error(`Error running scheduled job ${jobId}:`, error);
    }
  }

  /**
   * Run a scraping job
   * @param {Object} job - Scraping job object
   */
  async runScrapingJob(job) {
    if (this.isRunning) {
      throw new Error("Scraper is already running");
    }

    try {
      // Update job status
      await job.update({
        status: "running",
        lastRun: new Date(),
      });

      this.isRunning = true;
      console.log(`🚀 Starting scraping job: ${job.name}`);

      // Initialize browser if not already done
      if (!this.browser) {
        await this.initializeBrowser();
      }

      // Load site configuration
      const siteConfig = await this.loadSiteConfig(job.platform);
      if (!siteConfig) {
        throw new Error(`Site configuration not found for ${job.platform}`);
      }

      // Run the scraper
      const results = await this.scrapeSite(siteConfig, job.config || {});

      // Update job with results
      await job.update({
        status: "completed",
        results: {
          timestamp: new Date().toISOString(),
          productsFound: results.products.length,
          listingsCreated: results.listings.length,
          errors: results.errors,
        },
        nextRun: this.calculateNextRun(job.schedule),
      });

      console.log(`✅ Scraping job completed: ${job.name}`);
      return results;

    } catch (error) {
      console.error(`❌ Scraping job failed: ${job.name}`, error);
      
      await job.update({
        status: "failed",
        errorMessage: error.message,
      });

      throw error;
    } finally {
      this.isRunning = false;
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

      console.log("🌐 Browser initialized successfully");
    } catch (error) {
      console.error("Error initializing browser:", error);
      throw error;
    }
  }

  /**
   * Load site configuration
   * @param {string} platform - Platform name
   * @returns {Object} - Site configuration
   */
  async loadSiteConfig(platform) {
    try {
      const configPath = path.join(__dirname, "../config/sites", `${platform}.json`);
      
      if (!fs.existsSync(configPath)) {
        throw new Error(`Configuration file not found: ${configPath}`);
      }

      const configData = fs.readFileSync(configPath, "utf8");
      return JSON.parse(configData);
    } catch (error) {
      console.error(`Error loading site config for ${platform}:`, error);
      return null;
    }
  }

  /**
   * Scrape a specific site
   * @param {Object} siteConfig - Site configuration
   * @param {Object} options - Scraping options
   * @returns {Object} - Scraping results
   */
  async scrapeSite(siteConfig, options = {}) {
    const {
      maxPages = 10,
      searchQuery = "",
      filters = {},
      delay = 2000,
    } = options;

    const results = {
      products: [],
      listings: [],
      errors: [],
      startTime: new Date(),
    };

    try {
      const context = await this.browser.newContext({
        userAgent: siteConfig.metadata?.userAgent || "Mozilla/5.0 (compatible; WebScraper/1.0)",
        viewport: siteConfig.metadata?.viewport || { width: 1920, height: 1080 },
      });

      const page = await context.newPage();

      // Check robots.txt if required
      if (siteConfig.rateLimiting?.respectRobotsTxt) {
        await this.checkRobotsTxt(page, siteConfig.baseUrl);
      }

      // Navigate to search page
      const searchUrl = this.buildSearchUrl(siteConfig, searchQuery, filters);
      await page.goto(searchUrl, { waitUntil: "networkidle" });

      let currentPage = 1;
      let hasNextPage = true;

      while (currentPage <= maxPages && hasNextPage) {
        console.log(`📄 Scraping page ${currentPage} of ${siteConfig.name}`);

        // Extract products from current page
        const pageProducts = await this.extractProducts(page, siteConfig);
        results.products.push(...pageProducts);

        // Check if there's a next page
        hasNextPage = await this.hasNextPage(page, siteConfig);

        if (hasNextPage && currentPage < maxPages) {
          await this.goToNextPage(page, siteConfig);
          await this.delay(delay);
          currentPage++;
        } else {
          break;
        }
      }

      // Process extracted products
      for (const productData of results.products) {
        try {
          const result = await this.processProduct(productData, siteConfig);
          if (result) {
            results.listings.push(result);
          }
        } catch (error) {
          results.errors.push({
            product: productData.title,
            error: error.message,
          });
        }
      }

      await context.close();
      console.log(`✅ Scraping completed: ${results.products.length} products found`);

    } catch (error) {
      results.errors.push({
        step: "scraping",
        error: error.message,
      });
      console.error("Error during scraping:", error);
    }

    results.endTime = new Date();
    results.duration = results.endTime - results.startTime;

    return results;
  }

  /**
   * Extract products from a page
   * @param {Object} page - Playwright page object
   * @param {Object} siteConfig - Site configuration
   * @returns {Array} - Array of product data
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
          console.warn("Error extracting product data:", error.message);
        }
      }
    } catch (error) {
      console.error("Error extracting products:", error);
    }

    return products;
  }

  /**
   * Extract data from a single product element
   * @param {Object} element - Product DOM element
   * @param {Object} siteConfig - Site configuration
   * @returns {Object} - Product data
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

      // Extract description
      if (siteConfig.selectors.description) {
        const descElement = await element.$(siteConfig.selectors.description);
        if (descElement) {
          productData.description = await descElement.textContent();
        }
      }

      // Extract image
      if (siteConfig.selectors.image) {
        const imgElement = await element.$(siteConfig.selectors.image);
        if (imgElement) {
          productData.imageUrl = await imgElement.getAttribute("src") || 
                                 await imgElement.getAttribute("data-src");
        }
      }

      // Extract product URL
      if (siteConfig.selectors.productUrl) {
        const linkElement = await element.$(siteConfig.selectors.productUrl);
        if (linkElement) {
          productData.productUrl = await linkElement.getAttribute("href");
        }
      }

      // Extract location
      if (siteConfig.selectors.location) {
        const locationElement = await element.$(siteConfig.selectors.location);
        if (locationElement) {
          productData.location = await locationElement.textContent();
        }
      }

      // Extract seller
      if (siteConfig.selectors.seller) {
        const sellerElement = await element.$(siteConfig.selectors.seller);
        if (sellerElement) {
          productData.seller = await sellerElement.textContent();
        }
      }

      // Extract condition
      if (siteConfig.selectors.condition) {
        const conditionElement = await element.$(siteConfig.selectors.condition);
        if (conditionElement) {
          productData.condition = await conditionElement.textContent();
        }
      }

    } catch (error) {
      console.warn("Error extracting product data:", error.message);
    }

    return productData;
  }

  /**
   * Process extracted product data
   * @param {Object} productData - Raw product data
   * @param {Object} siteConfig - Site configuration
   * @returns {Object} - Created listing or null
   */
  async processProduct(productData, siteConfig) {
    try {
      // Find or create product match
      const matchResult = await ProductMatchingService.findOrCreateMatch({
        title: productData.title,
        brand: this.extractBrand(productData.title),
        model: this.extractModel(productData.title),
        description: productData.description,
        source: siteConfig.platform,
        externalId: productData.productUrl,
      });

      // Find or create seller
      let seller = null;
      if (productData.seller) {
        seller = await this.findOrCreateSeller({
          name: productData.seller,
          platform: siteConfig.platform,
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
        source: siteConfig.platform,
        productId: matchResult.product.id,
        sellerId: seller?.id,
        platformListingId: this.extractPlatformId(productData.productUrl),
        platformUrl: productData.productUrl,
        location: productData.location,
        status: "scraped",
        scrapedAt: new Date(),
      });

      return listing;

    } catch (error) {
      console.error("Error processing product:", error);
      return null;
    }
  }

  /**
   * Find or create seller
   * @param {Object} sellerData - Seller data
   * @returns {Object} - Seller object
   */
  async findOrCreateSeller(sellerData) {
    try {
      let seller = await Seller.findOne({
        where: {
          name: sellerData.name,
          platform: sellerData.platform,
        },
      });

      if (!seller) {
        seller = await Seller.create({
          name: sellerData.name,
          platform: sellerData.platform,
          platformUrl: sellerData.platformUrl,
          verified: false,
          status: "pending",
        });
      }

      return seller;
    } catch (error) {
      console.error("Error finding/creating seller:", error);
      return null;
    }
  }

  /**
   * Check if there's a next page
   * @param {Object} page - Playwright page object
   * @param {Object} siteConfig - Site configuration
   * @returns {boolean} - True if next page exists
   */
  async hasNextPage(page, siteConfig) {
    if (!siteConfig.selectors.nextPage) return false;

    try {
      const nextButton = await page.$(siteConfig.selectors.nextPage);
      return nextButton !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Navigate to next page
   * @param {Object} page - Playwright page object
   * @param {Object} siteConfig - Site configuration
   */
  async goToNextPage(page, siteConfig) {
    if (!siteConfig.selectors.nextPage) return;

    try {
      if (siteConfig.pagination.scrollBased) {
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await this.delay(1000);
      } else {
        await page.click(siteConfig.selectors.nextPage);
        await page.waitForLoadState("networkidle");
      }
    } catch (error) {
      console.warn("Error navigating to next page:", error.message);
    }
  }

  /**
   * Build search URL with filters
   * @param {Object} siteConfig - Site configuration
   * @param {string} query - Search query
   * @param {Object} filters - Search filters
   * @returns {string} - Complete search URL
   */
  buildSearchUrl(siteConfig, query, filters) {
    let url = siteConfig.searchUrl;

    if (query && siteConfig.filters.category) {
      url += siteConfig.filters.category.replace("{query}", encodeURIComponent(query));
    }

    if (filters.minPrice && siteConfig.filters.priceRange) {
      url += siteConfig.filters.priceRange
        .replace("{minPrice}", filters.minPrice)
        .replace("{maxPrice}", filters.maxPrice || "");
    }

    if (filters.location && siteConfig.filters.location) {
      url += siteConfig.filters.location.replace("{location}", encodeURIComponent(filters.location));
    }

    return url;
  }

  /**
   * Check robots.txt compliance
   * @param {Object} page - Playwright page object
   * @param {string} baseUrl - Base URL of the site
   */
  async checkRobotsTxt(page, baseUrl) {
    try {
      const robotsUrl = new URL("/robots.txt", baseUrl).toString();
      const response = await page.goto(robotsUrl);
      
      if (response.ok()) {
        const robotsText = await response.text();
        const robots = robotsParser(robotsUrl, robotsText);
        
        if (!robots.isAllowed(page.url(), "WebScraper/1.0")) {
          throw new Error("Access denied by robots.txt");
        }
      }
    } catch (error) {
      console.warn("Robots.txt check failed:", error.message);
    }
  }

  /**
   * Calculate next run time based on cron schedule
   * @param {string} cronExpression - Cron expression
   * @returns {Date} - Next run time
   */
  calculateNextRun(cronExpression) {
    if (!cronExpression) return null;
    
    try {
      const cronParser = require("cron-parser");
      const interval = cronParser.parseExpression(cronExpression);
      return interval.next().toDate();
    } catch (error) {
      console.error("Error parsing cron expression:", error);
      return null;
    }
  }

  /**
   * Utility methods
   */
  extractPrice(priceText) {
    if (!priceText) return 0;
    const match = priceText.match(/[\d,]+\.?\d*/);
    return match ? parseFloat(match[0].replace(/,/g, "")) : 0;
  }

  extractBrand(title) {
    if (!title) return null;
    const commonBrands = ["apple", "samsung", "sony", "lg", "nike", "adidas"];
    const titleLower = title.toLowerCase();
    return commonBrands.find(brand => titleLower.includes(brand)) || null;
  }

  extractModel(title) {
    if (!title) return null;
    const modelMatch = title.match(/(?:iphone|galaxy|xperia|g|air|pro|max|ultra|mini)\s*\d+/i);
    return modelMatch ? modelMatch[0] : null;
  }

  normalizeCondition(condition) {
    if (!condition) return "unknown";
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes("new")) return "new";
    if (conditionLower.includes("used")) return "used";
    if (conditionLower.includes("refurbished")) return "refurbished";
    if (conditionLower.includes("like new")) return "like_new";
    
    return "unknown";
  }

  extractPlatformId(url) {
    if (!url) return null;
    const match = url.match(/\/(\d+)(?:\/|$)/);
    return match ? match[1] : null;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    try {
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }

      // Stop all scheduled jobs
      for (const [jobId, task] of this.scheduledJobs) {
        task.destroy();
      }
      this.scheduledJobs.clear();

      console.log("🧹 Scraper service cleaned up");
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  }
}

module.exports = EnhancedScraperService;
