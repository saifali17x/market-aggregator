// scraper.js
const { chromium } = require("playwright");
const robotsParser = require("robots-parser");
const axios = require("axios");
const winston = require("winston");
const path = require("path");
const fs = require("fs").promises;

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "scraper.log" }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

class WebScraper {
  constructor(siteConfig, options = {}) {
    this.siteConfig = siteConfig;
    this.options = {
      delay: options.delay || 2000,
      maxRetries: options.maxRetries || 3,
      timeout: options.timeout || 30000,
      userAgent:
        options.userAgent || "Mozilla/5.0 (compatible; WebScraper/1.0)",
      proxy: process.env.PROXY_URL || options.proxy,
      apiEndpoint: options.apiEndpoint || process.env.API_ENDPOINT,
      apiKey: options.apiKey || process.env.API_KEY,
      ...options,
    };
    this.browser = null;
    this.robotsTxt = null;
    this.stats = {
      processed: 0,
      successful: 0,
      failed: 0,
      startTime: Date.now(),
    };
  }

  async initialize() {
    try {
      // Launch browser with proxy if configured
      const browserOptions = {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      };

      if (this.options.proxy) {
        browserOptions.proxy = {
          server: this.options.proxy,
        };
      }

      this.browser = await chromium.launch(browserOptions);
      logger.info("Browser initialized successfully");

      // Check robots.txt
      await this.checkRobotsTxt();
    } catch (error) {
      logger.error("Failed to initialize scraper:", error);
      throw error;
    }
  }

  async checkRobotsTxt() {
    try {
      const robotsUrl = new URL("/robots.txt", this.siteConfig.startUrl).href;
      const response = await axios.get(robotsUrl, {
        timeout: 10000,
        validateStatus: (status) => status < 500, // Accept 404s
      });

      if (response.status === 200) {
        this.robotsTxt = robotsParser(robotsUrl, response.data);
        logger.info("Robots.txt loaded and parsed");
      } else {
        logger.info("No robots.txt found, proceeding without restrictions");
      }
    } catch (error) {
      logger.warn("Could not fetch robots.txt:", error.message);
    }
  }

  isAllowedByRobots(url) {
    if (!this.robotsTxt) return true;
    return this.robotsTxt.isAllowed(url, this.options.userAgent);
  }

  async createPage() {
    const context = await this.browser.newContext({
      userAgent: this.options.userAgent,
      viewport: { width: 1920, height: 1080 },
    });

    const page = await context.newPage();

    // Set timeout
    page.setDefaultTimeout(this.options.timeout);

    // Block unnecessary resources to speed up scraping
    await page.route("**/*", (route) => {
      const resourceType = route.request().resourceType();
      if (["image", "font", "media"].includes(resourceType)) {
        route.abort();
      } else {
        route.continue();
      }
    });

    return page;
  }

  async extractProductData(page, url) {
    try {
      const products = [];
      const productElements = await page.$$(this.siteConfig.selectors.product);

      logger.info(`Found ${productElements.length} products on ${url}`);

      for (const element of productElements) {
        try {
          const product = await this.extractSingleProduct(element);
          if (this.validateProduct(product)) {
            products.push(product);
          }
        } catch (error) {
          logger.warn("Failed to extract product:", error.message);
        }
      }

      return products;
    } catch (error) {
      logger.error(`Failed to extract products from ${url}:`, error);
      return [];
    }
  }

  async extractSingleProduct(element) {
    const product = {
      scrapedAt: new Date().toISOString(),
      sourceUrl: this.siteConfig.startUrl,
    };

    // Extract title
    if (this.siteConfig.selectors.title) {
      const titleElement = await element.$(this.siteConfig.selectors.title);
      product.title = titleElement ? await titleElement.textContent() : null;
      product.title = this.normalizeText(product.title);
    }

    // Extract price
    if (this.siteConfig.selectors.price) {
      const priceElement = await element.$(this.siteConfig.selectors.price);
      const priceText = priceElement ? await priceElement.textContent() : null;
      product.price = this.normalizePrice(priceText);
    }

    // Extract image URL
    if (this.siteConfig.selectors.image) {
      const imageElement = await element.$(this.siteConfig.selectors.image);
      if (imageElement) {
        product.imageUrl =
          (await imageElement.getAttribute("src")) ||
          (await imageElement.getAttribute("data-src"));
        product.imageUrl = this.normalizeUrl(product.imageUrl);
      }
    }

    // Extract custom fields
    if (this.siteConfig.selectors.custom) {
      for (const [key, selector] of Object.entries(
        this.siteConfig.selectors.custom
      )) {
        const customElement = await element.$(selector);
        if (customElement) {
          product[key] = this.normalizeText(await customElement.textContent());
        }
      }
    }

    return product;
  }

  normalizeText(text) {
    if (!text) return null;
    return text.trim().replace(/\s+/g, " ");
  }

  normalizePrice(priceText) {
    if (!priceText) return null;

    // Remove currency symbols and extract numeric value
    const cleaned = priceText.replace(/[^\d.,]/g, "");
    const price = parseFloat(cleaned.replace(",", "."));

    return isNaN(price) ? null : price;
  }

  normalizeUrl(url) {
    if (!url) return null;

    // Convert relative URLs to absolute
    try {
      return new URL(url, this.siteConfig.startUrl).href;
    } catch {
      return url;
    }
  }

  validateProduct(product) {
    // Basic validation - customize as needed
    return product && (product.title || product.price);
  }

  async saveToDatabase(products) {
    if (!products.length) return;

    try {
      if (this.options.apiEndpoint) {
        await this.saveViaAPI(products);
      } else {
        logger.warn("No API endpoint configured, skipping database save");
      }
    } catch (error) {
      logger.error("Failed to save to database:", error);
      throw error;
    }
  }

  async saveViaAPI(products) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (this.options.apiKey) {
      headers["Authorization"] = `Bearer ${this.options.apiKey}`;
    }

    for (const product of products) {
      try {
        const response = await axios.post(
          `${this.options.apiEndpoint}/products/upsert`,
          product,
          { headers, timeout: 10000 }
        );

        if (response.status >= 200 && response.status < 300) {
          this.stats.successful++;
          logger.debug(`Successfully saved product: ${product.title}`);
        } else {
          this.stats.failed++;
          logger.warn(`Failed to save product: ${response.status}`);
        }
      } catch (error) {
        this.stats.failed++;
        logger.error(`API error saving product:`, error.message);
      }
    }
  }

  async crawlPage(url, retryCount = 0) {
    if (!this.isAllowedByRobots(url)) {
      logger.warn(`URL blocked by robots.txt: ${url}`);
      return [];
    }

    let page;
    try {
      page = await this.createPage();

      logger.info(`Crawling page: ${url}`);
      await page.goto(url, { waitUntil: "domcontentloaded" });

      // Wait for products to load
      if (this.siteConfig.waitForSelector) {
        await page.waitForSelector(this.siteConfig.waitForSelector, {
          timeout: 10000,
        });
      }

      const products = await this.extractProductData(page, url);
      this.stats.processed += products.length;

      return products;
    } catch (error) {
      logger.error(`Error crawling ${url}:`, error.message);

      if (retryCount < this.options.maxRetries) {
        logger.info(`Retrying ${url} (attempt ${retryCount + 1})`);
        await this.delay(this.options.delay * (retryCount + 1));
        return this.crawlPage(url, retryCount + 1);
      } else {
        logger.error(`Max retries exceeded for ${url}`);
        return [];
      }
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  async getNextPageUrl(page) {
    if (!this.siteConfig.selectors.nextPage) return null;

    try {
      const nextElement = await page.$(this.siteConfig.selectors.nextPage);
      if (nextElement) {
        const href = await nextElement.getAttribute("href");
        return href ? this.normalizeUrl(href) : null;
      }
    } catch (error) {
      logger.warn("Error finding next page:", error.message);
    }

    return null;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async scrape() {
    await this.initialize();

    try {
      const urlsToProcess = [this.siteConfig.startUrl];
      const processedUrls = new Set();

      while (urlsToProcess.length > 0) {
        const currentUrl = urlsToProcess.shift();

        if (processedUrls.has(currentUrl)) continue;
        processedUrls.add(currentUrl);

        // Respect rate limiting
        if (processedUrls.size > 1) {
          await this.delay(this.options.delay);
        }

        const products = await this.crawlPage(currentUrl);

        if (products.length > 0) {
          await this.saveToDatabase(products);
          logger.info(
            `Processed ${products.length} products from ${currentUrl}`
          );
        }

        // Look for next page if pagination is configured
        if (this.siteConfig.selectors.nextPage) {
          const page = await this.createPage();
          try {
            await page.goto(currentUrl, { waitUntil: "domcontentloaded" });
            const nextUrl = await this.getNextPageUrl(page);

            if (nextUrl && !processedUrls.has(nextUrl)) {
              urlsToProcess.push(nextUrl);
              logger.info(`Found next page: ${nextUrl}`);
            }
          } finally {
            await page.close();
          }
        }
      }

      this.logFinalStats();
    } catch (error) {
      logger.error("Scraping failed:", error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  logFinalStats() {
    const duration = (Date.now() - this.stats.startTime) / 1000;
    logger.info("Scraping completed:", {
      duration: `${duration}s`,
      processed: this.stats.processed,
      successful: this.stats.successful,
      failed: this.stats.failed,
      successRate: `${(
        (this.stats.successful / this.stats.processed) *
        100
      ).toFixed(2)}%`,
    });
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      logger.info("Browser closed");
    }
  }
}

// Main execution function
async function main() {
  // Load site configuration
  const configPath = process.argv[2] || "./site-config.json";

  try {
    const configFile = await fs.readFile(configPath, "utf-8");
    const siteConfig = JSON.parse(configFile);

    // Create and run scraper
    const scraper = new WebScraper(siteConfig, {
      delay: parseInt(process.env.SCRAPE_DELAY) || 2000,
      apiEndpoint: process.env.API_ENDPOINT,
      apiKey: process.env.API_KEY,
      proxy: process.env.PROXY_URL,
    });

    await scraper.scrape();
  } catch (error) {
    logger.error("Script failed:", error);
    process.exit(1);
  }
}

// Export for use as module
module.exports = { WebScraper };

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
