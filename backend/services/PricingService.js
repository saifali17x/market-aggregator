// backend/services/PricingService.js
let Price;
try {
  const models = require("../models");
  Price = models.Price;
} catch (error) {
  // For testing environments where models might not be available
  Price = null;
}

class PricingService {
  constructor() {
    this.exchangeRates = {};
    this.baseCurrency = process.env.BASE_CURRENCY || "USD";
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      await this.loadFxRates();
      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize PricingService:", error);
      // Use default rates if loading fails
      this.exchangeRates = {
        USD: 1,
        EUR: 1.1,
        GBP: 1.25,
        CAD: 0.8,
        AUD: 0.75,
        JPY: 0.007,
        PKR: 0.0036,
        INR: 0.012,
      };
      this.initialized = true;
    }
  }

  async loadFxRates() {
    try {
      // Try to load from database first if Price model is available
      if (Price && typeof Price.findAll === "function") {
        const prices = await Price.findAll({
          where: { isActive: true },
          order: [["fetchedAt", "DESC"]],
        });

        if (prices && prices.length > 0) {
          this.exchangeRates = {};
          prices.forEach((price) => {
            this.exchangeRates[price.currency] = price.rateToUsd;
          });
          this.exchangeRates.USD = 1; // Base currency
          return this.exchangeRates;
        }
      }

      // Fallback to environment variable
      if (process.env.FX_JSON) {
        this.exchangeRates = JSON.parse(process.env.FX_JSON);
        return this.exchangeRates;
      }

      // Default rates
      this.exchangeRates = {
        USD: 1,
        EUR: 1.1,
        GBP: 1.25,
        CAD: 0.8,
        AUD: 0.75,
        JPY: 0.007,
        PKR: 0.0036,
        INR: 0.012,
      };

      return this.exchangeRates;
    } catch (error) {
      console.error("Error loading FX rates:", error);
      // Use default rates if loading fails
      this.exchangeRates = {
        USD: 1,
        EUR: 1.1,
        GBP: 1.25,
        CAD: 0.8,
        AUD: 0.75,
        JPY: 0.007,
        PKR: 0.0036,
        INR: 0.012,
      };
      return this.exchangeRates;
    }
  }

  getRate(currency) {
    if (!this.initialized) {
      throw new Error(
        "PricingService not initialized. Call initialize() first."
      );
    }

    const upperCurrency = currency.toUpperCase();
    return this.exchangeRates[upperCurrency] || null;
  }

  getRates() {
    if (!this.initialized) {
      throw new Error(
        "PricingService not initialized. Call initialize() first."
      );
    }

    return { ...this.exchangeRates };
  }

  convertCurrency(amount, fromCurrency, toCurrency = this.baseCurrency) {
    if (!this.initialized) {
      throw new Error(
        "PricingService not initialized. Call initialize() first."
      );
    }

    if (typeof amount !== "number" || isNaN(amount)) {
      return null;
    }

    const fromRate = this.getRate(fromCurrency);
    const toRate = this.getRate(toCurrency);

    if (!fromRate || !toRate) {
      return null;
    }

    // Convert to base currency first, then to target currency
    // The rates represent how many USD one unit of the currency is worth
    // So to convert from currency to USD: amount * rate
    // To convert from USD to currency: amount / rate
    const baseAmount = amount * fromRate;
    return baseAmount / toRate;
  }

  convertToBase(amount, fromCurrency) {
    return this.convertCurrency(amount, fromCurrency, this.baseCurrency);
  }

  setRates(rates) {
    this.exchangeRates = { ...rates };
    this.initialized = true;
  }

  updateExchangeRates(rates) {
    this.exchangeRates = { ...this.exchangeRates, ...rates };
  }

  isValidCurrency(currency) {
    if (!currency || typeof currency !== "string") return false;
    return this.exchangeRates.hasOwnProperty(currency.toUpperCase());
  }

  normalizeListingPrice(listing) {
    if (!listing.price || !listing.currency) {
      return listing;
    }

    const basePrice = this.convertToBase(listing.price, listing.currency);

    return {
      ...listing,
      price_base: basePrice,
      currency: this.baseCurrency,
    };
  }

  normalizeListings(listings) {
    return listings.map((listing) => this.normalizeListingPrice(listing));
  }

  getPriceStats(prices) {
    if (!Array.isArray(prices) || prices.length === 0) {
      return { min: 0, max: 0, avg: 0 };
    }

    const validPrices = prices.filter(
      (p) => typeof p === "number" && !isNaN(p)
    );

    if (validPrices.length === 0) {
      return { min: 0, max: 0, avg: 0 };
    }

    const min = Math.min(...validPrices);
    const max = Math.max(...validPrices);
    const avg =
      validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length;

    return { min, max, avg: Math.round(avg * 100) / 100 };
  }

  getPriceDistribution(prices) {
    if (!Array.isArray(prices) || prices.length === 0) {
      return [];
    }

    const validPrices = prices.filter(
      (p) => typeof p === "number" && !isNaN(p)
    );

    if (validPrices.length === 0) {
      return [];
    }

    // Create price ranges
    const min = Math.min(...validPrices);
    const max = Math.max(...validPrices);
    const range = max - min;
    const bucketCount = Math.min(10, Math.ceil(validPrices.length / 2));
    const bucketSize = range / bucketCount;

    const distribution = [];
    for (let i = 0; i < bucketCount; i++) {
      const bucketStart = min + i * bucketSize;
      const bucketEnd = bucketStart + bucketSize;
      const count = validPrices.filter(
        (price) =>
          price >= bucketStart &&
          price < (i === bucketCount - 1 ? bucketEnd + 0.01 : bucketEnd)
      ).length;

      distribution.push({
        range: `${bucketStart.toFixed(2)} - ${bucketEnd.toFixed(2)}`,
        count,
        percentage: Math.round((count / validPrices.length) * 100),
      });
    }

    return distribution;
  }

  formatPrice(amount, currency = this.baseCurrency) {
    if (typeof amount !== "number" || isNaN(amount)) {
      return "Invalid amount";
    }

    const currencyInfo = this.getCurrencyInfo(currency);
    if (!currencyInfo) {
      return `${amount.toFixed(2)} ${currency}`;
    }

    return `${currencyInfo.symbol}${amount.toFixed(2)}`;
  }

  getCurrencyInfo(currency) {
    const currencyMap = {
      USD: { symbol: "$", code: "USD", name: "US Dollar" },
      EUR: { symbol: "€", code: "EUR", name: "Euro" },
      GBP: { symbol: "£", code: "GBP", name: "British Pound" },
      CAD: { symbol: "C$", code: "CAD", name: "Canadian Dollar" },
      AUD: { symbol: "A$", code: "AUD", name: "Australian Dollar" },
      JPY: { symbol: "¥", code: "JPY", name: "Japanese Yen" },
      PKR: { symbol: "₨", code: "PKR", name: "Pakistani Rupee" },
      INR: { symbol: "₹", code: "INR", name: "Indian Rupee" },
    };

    return currencyMap[currency.toUpperCase()] || null;
  }

  getStatus() {
    return {
      baseCurrency: this.baseCurrency,
      supportedCurrencies: Object.keys(this.exchangeRates),
      lastUpdated: new Date().toISOString(),
      initialized: this.initialized,
      rateCount: Object.keys(this.exchangeRates).length,
    };
  }
}

module.exports = PricingService;
