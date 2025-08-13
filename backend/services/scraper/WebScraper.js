// backend/services/scraper/WebScraper.js
const { chromium } = require("playwright");
const robotsParser = require("robots-parser");
const axios = require("axios");

class WebScraper {
  constructor(siteConfig, options = {}, logger = console) {
    this.siteConfig = siteConfig;
    this.logger = logger;
    this.options = {
      delay: options.delay || 2000,
      maxRetries: options.maxRetries || 3,
      timeout: options.timeout || 30000,
      userAgent:
        options.userAgent || "Mozilla/5.0 (compatible; WebScraper/1.0)",
      proxy: process.env.PROXY_URL || options.proxy,
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
      const browserOptions = {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      };

      if (this.options.proxy) {
        browserOptions.proxy = { server: this.options.proxy };
      }

      this.browser = await chromium.launch(browserOptions);
      this.logger.info?.("Browser initialized successfully") ||
        console.log("Browser initialized successfully");

      await this.checkRobotsTxt();
    } catch (error) {
      this.logger.error?.("Failed to initialize scraper:", error) ||
        console.error("Failed to initialize scraper:", error);
      throw error;
    }
  }

  async checkRobotsTxt() {
    try {
      const robotsUrl = new URL("/robots.txt", this.siteConfig.startUrl).href;
      const response = await axios.get(robotsUrl, {
        timeout: 10000,
        validateStatus: (status) => status < 500,
      });

      if (response.status === 200) {
        this.robotsTxt = robotsParser(robotsUrl, response.data);
        this.logger.info?.("Robots.txt loaded and parsed") ||
          console.log("Robots.txt loaded and parsed");
      }
    } catch (error) {
      this.logger.warn?.("Could not fetch robots.txt:", error.message) ||
        console.warn("Could not fetch robots.txt:", error.message);
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
    page.setDefaultTimeout(this.options.timeout);

    // Block unnecessary resources
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

      this.logger.info?.(
        `Found ${productElements.length} products on ${url}`
      ) || console.log(`Found ${productElements.length} products on ${url}`);

      for (const element of productElements) {
        try {
          const product = await this.extractSingleProduct(element);
          if (this.validateProduct(product)) {
            products.push(product);
          }
        } catch (error) {
          this.logger.warn?.("Failed to extract product:", error.message) ||
            console.warn("Failed to extract product:", error.message);
        }
      }

      return products;
    } catch (error) {
      this.logger.error?.(`Failed to extract products from ${url}:`, error) ||
        console.error(`Failed to extract products from ${url}:`, error);
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

    const cleaned = priceText.replace(/[^\d.,]/g, "");
    const price = parseFloat(cleaned.replace(",", "."));

    return isNaN(price) ? null : price;
  }

  normalizeUrl(url) {
    if (!url) return null;

    try {
      return new URL(url, this.siteConfig.startUrl).href;
    } catch {
      return url;
    }
  }

  validateProduct(product) {
    return product && (product.title || product.price);
  }

  async crawlPage(url, retryCount = 0) {
    if (!this.isAllowedByRobots(url)) {
      this.logger.warn?.(`URL blocked by robots.txt: ${url}`) ||
        console.warn(`URL blocked by robots.txt: ${url}`);
      return [];
    }

    let page;
    try {
      page = await this.createPage();

      this.logger.info?.(`Crawling page: ${url}`) ||
        console.log(`Crawling page: ${url}`);
      await page.goto(url, { waitUntil: "domcontentloaded" });

      if (this.siteConfig.waitForSelector) {
        await page.waitForSelector(this.siteConfig.waitForSelector, {
          timeout: 10000,
        });
      }

      const products = await this.extractProductData(page, url);
      this.stats.processed += products.length;

      return products;
    } catch (error) {
      this.logger.error?.(`Error crawling ${url}:`, error.message) ||
        console.error(`Error crawling ${url}:`, error.message);

      if (retryCount < this.options.maxRetries) {
        this.logger.info?.(`Retrying ${url} (attempt ${retryCount + 1})`) ||
          console.log(`Retrying ${url} (attempt ${retryCount + 1})`);
        await this.delay(this.options.delay * (retryCount + 1));
        return this.crawlPage(url, retryCount + 1);
      } else {
        this.logger.error?.(`Max retries exceeded for ${url}`) ||
          console.error(`Max retries exceeded for ${url}`);
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
      this.logger.warn?.("Error finding next page:", error.message) ||
        console.warn("Error finding next page:", error.message);
    }

    return null;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async scrape(callback = null) {
    await this.initialize();

    try {
      const urlsToProcess = [this.siteConfig.startUrl];
      const processedUrls = new Set();
      const allProducts = [];

      while (urlsToProcess.length > 0) {
        const currentUrl = urlsToProcess.shift();

        if (processedUrls.has(currentUrl)) continue;
        processedUrls.add(currentUrl);

        if (processedUrls.size > 1) {
          await this.delay(this.options.delay);
        }

        const products = await this.crawlPage(currentUrl);

        if (products.length > 0) {
          allProducts.push(...products);

          // Call callback if provided (for real-time processing)
          if (callback && typeof callback === "function") {
            await callback(products);
          }

          this.logger.info?.(
            `Processed ${products.length} products from ${currentUrl}`
          ) ||
            console.log(
              `Processed ${products.length} products from ${currentUrl}`
            );
        }

        // Look for next page
        if (this.siteConfig.selectors.nextPage) {
          const page = await this.createPage();
          try {
            await page.goto(currentUrl, { waitUntil: "domcontentloaded" });
            const nextUrl = await this.getNextPageUrl(page);

            if (nextUrl && !processedUrls.has(nextUrl)) {
              urlsToProcess.push(nextUrl);
              this.logger.info?.(`Found next page: ${nextUrl}`) ||
                console.log(`Found next page: ${nextUrl}`);
            }
          } finally {
            await page.close();
          }
        }
      }

      this.logFinalStats();
      return allProducts;
    } catch (error) {
      this.logger.error?.("Scraping failed:", error) ||
        console.error("Scraping failed:", error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  logFinalStats() {
    const duration = (Date.now() - this.stats.startTime) / 1000;
    const stats = {
      duration: `${duration}s`,
      processed: this.stats.processed,
      successful: this.stats.successful,
      failed: this.stats.failed,
      successRate: `${(
        (this.stats.successful / this.stats.processed) *
        100
      ).toFixed(2)}%`,
    };

    this.logger.info?.("Scraping completed:", stats) ||
      console.log("Scraping completed:", stats);

    return stats;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.logger.info?.("Browser closed") || console.log("Browser closed");
    }
  }
}

module.exports = WebScraper;
