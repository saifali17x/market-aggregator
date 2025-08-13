const { Price, Listing } = require("../models");
const { Op } = require("sequelize");

/**
 * Pricing Service for Currency Normalization
 * Handles currency conversion and price normalization
 */
class PricingService {
  constructor() {
    this.baseCurrency = process.env.BASE_CURRENCY || "USD";
    this.fxRates = this.loadFxRates();
    this.updateInterval = 24 * 60 * 60 * 1000; // 24 hours
    this.lastUpdate = null;
  }

  /**
   * Load FX rates from environment or database
   */
  loadFxRates() {
    try {
      // Try to load from environment first
      if (process.env.FX_JSON) {
        const envRates = JSON.parse(process.env.FX_JSON);
        console.log("Loaded FX rates from environment:", Object.keys(envRates));
        return envRates;
      }
    } catch (error) {
      console.warn("Failed to parse FX_JSON from environment:", error.message);
    }

    // Return default rates if environment not set
    return {
      USD: 1.0,
      EUR: 1.09,
      GBP: 1.27,
      PKR: 0.0036,
      INR: 0.012,
      CAD: 0.74,
      AUD: 0.66,
      JPY: 0.0067,
      CNY: 0.14,
      KRW: 0.00075,
    };
  }

  /**
   * Get current exchange rate for a currency
   */
  async getRate(currency) {
    if (!currency || currency.toUpperCase() === this.baseCurrency) {
      return 1.0;
    }

    try {
      // Try database first
      const dbRate = await Price.getRate(currency);
      if (dbRate) {
        return parseFloat(dbRate);
      }
    } catch (error) {
      console.warn("Database rate lookup failed:", error.message);
    }

    // Fall back to environment/default rates
    const upperCurrency = currency.toUpperCase();
    return this.fxRates[upperCurrency] || 1.0;
  }

  /**
   * Convert amount between currencies
   */
  async convertCurrency(amount, fromCurrency, toCurrency = this.baseCurrency) {
    if (!amount || isNaN(amount)) return null;
    
    const amountFloat = parseFloat(amount);
    
    if (fromCurrency === toCurrency) {
      return amountFloat;
    }

    try {
      if (toCurrency === this.baseCurrency) {
        // Convert to base currency
        const rate = await this.getRate(fromCurrency);
        return amountFloat * rate;
      } else {
        // Convert to USD first, then to target currency
        const usdAmount = await this.convertCurrency(amount, fromCurrency, this.baseCurrency);
        if (usdAmount === null) return null;

        const targetRate = await this.getRate(toCurrency);
        return targetRate ? usdAmount / targetRate : null;
      }
    } catch (error) {
      console.error("Currency conversion error:", error);
      return null;
    }
  }

  /**
   * Normalize listing price to base currency
   */
  async normalizeListingPrice(listing) {
    try {
      if (!listing.price || !listing.currency) {
        return null;
      }

      const priceBase = await this.convertCurrency(
        listing.price,
        listing.currency,
        this.baseCurrency
      );

      if (priceBase !== null) {
        // Update listing with normalized price
        await listing.update({ price_base: priceBase });
        return priceBase;
      }

      return null;
    } catch (error) {
      console.error("Error normalizing listing price:", error);
      return null;
    }
  }

  /**
   * Normalize multiple listings
   */
  async normalizeListings(listings) {
    const results = [];
    
    for (const listing of listings) {
      try {
        const normalizedPrice = await this.normalizeListingPrice(listing);
        results.push({
          listingId: listing.id,
          originalPrice: listing.price,
          originalCurrency: listing.currency,
          normalizedPrice,
          success: normalizedPrice !== null,
        });
      } catch (error) {
        results.push({
          listingId: listing.id,
          error: error.message,
          success: false,
        });
      }
    }

    return results;
  }

  /**
   * Get price statistics in base currency
   */
  async getPriceStats(filters = {}) {
    try {
      const whereClause = {
        availability_status: "available",
        price_base: {
          [Op.ne]: null,
        },
      };

      // Apply filters
      if (filters.categoryId) {
        whereClause.categoryId = filters.categoryId;
      }
      if (filters.source) {
        whereClause.source = filters.source;
      }
      if (filters.minPrice) {
        whereClause.price_base = {
          ...whereClause.price_base,
          [Op.gte]: filters.minPrice,
        };
      }
      if (filters.maxPrice) {
        whereClause.price_base = {
          ...whereClause.price_base,
          [Op.lte]: filters.maxPrice,
        };
      }

      const stats = await Listing.findAll({
        where: whereClause,
        attributes: [
          [require("sequelize").fn("COUNT", require("sequelize").col("id")), "count"],
          [require("sequelize").fn("AVG", require("sequelize").col("price_base")), "avgPrice"],
          [require("sequelize").fn("MIN", require("sequelize").col("price_base")), "minPrice"],
          [require("sequelize").fn("MAX", require("sequelize").col("price_base")), "maxPrice"],
          [require("sequelize").fn("STDDEV", require("sequelize").col("price_base")), "stdDev"],
        ],
        raw: true,
      });

      const result = stats[0];
      return {
        count: parseInt(result.count),
        averagePrice: parseFloat(result.avgPrice) || 0,
        minPrice: parseFloat(result.minPrice) || 0,
        maxPrice: parseFloat(result.maxPrice) || 0,
        stdDev: parseFloat(result.stdDev) || 0,
        currency: this.baseCurrency,
      };
    } catch (error) {
      console.error("Error getting price stats:", error);
      return null;
    }
  }

  /**
   * Get price distribution by range
   */
  async getPriceDistribution(filters = {}) {
    try {
      const whereClause = {
        availability_status: "available",
        price_base: {
          [Op.ne]: null,
        },
      };

      // Apply filters
      if (filters.categoryId) {
        whereClause.categoryId = filters.categoryId;
      }
      if (filters.source) {
        whereClause.source = filters.source;
      }

      // Define price ranges
      const ranges = [
        { min: 0, max: 10, label: "$0 - $10" },
        { min: 10, max: 25, label: "$10 - $25" },
        { min: 25, max: 50, label: "$25 - $50" },
        { min: 50, max: 100, label: "$50 - $100" },
        { min: 100, max: 250, label: "$100 - $250" },
        { min: 250, max: 500, label: "$250 - $500" },
        { min: 500, max: 1000, label: "$500 - $1000" },
        { min: 1000, max: null, label: "$1000+" },
      ];

      const distribution = [];

      for (const range of ranges) {
        const rangeWhere = { ...whereClause };
        
        if (range.min !== null) {
          rangeWhere.price_base = {
            ...rangeWhere.price_base,
            [Op.gte]: range.min,
          };
        }
        
        if (range.max !== null) {
          rangeWhere.price_base = {
            ...rangeWhere.price_base,
            [Op.lt]: range.max,
          };
        }

        const count = await Listing.count({ where: rangeWhere });
        
        distribution.push({
          range: range.label,
          min: range.min,
          max: range.max,
          count,
        });
      }

      return distribution;
    } catch (error) {
      console.error("Error getting price distribution:", error);
      return [];
    }
  }

  /**
   * Update exchange rates (stub for future FX API integration)
   */
  async updateExchangeRates() {
    try {
      // Check if we need to update
      if (this.lastUpdate && (Date.now() - this.lastUpdate) < this.updateInterval) {
        console.log("Exchange rates are still fresh, skipping update");
        return false;
      }

      console.log("Updating exchange rates...");
      
      // TODO: Integrate with real FX API (e.g., Fixer.io, ExchangeRate-API)
      // For now, we'll just update the timestamp
      this.lastUpdate = Date.now();
      
      // Update database rates if available
      try {
        await Price.updateRates(this.fxRates);
        console.log("Updated exchange rates in database");
      } catch (error) {
        console.warn("Failed to update database rates:", error.message);
      }

      return true;
    } catch (error) {
      console.error("Error updating exchange rates:", error);
      return false;
    }
  }

  /**
   * Get currency information
   */
  async getCurrencyInfo() {
    try {
      const currencies = await Price.findAll({
        attributes: ["currency", "rateToUsd", "fetchedAt", "source"],
        order: [["currency", "ASC"]],
      });

      return currencies.map(currency => ({
        currency: currency.currency,
        rateToUsd: parseFloat(currency.rateToUsd),
        fetchedAt: currency.fetchedAt,
        source: currency.source,
      }));
    } catch (error) {
      console.error("Error getting currency info:", error);
      return [];
    }
  }

  /**
   * Validate currency code
   */
  isValidCurrency(currency) {
    if (!currency || typeof currency !== "string") return false;
    
    const validCurrencies = new Set([
      "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR", "BRL",
      "KRW", "MXN", "SGD", "HKD", "NOK", "SEK", "DKK", "PLN", "CZK", "HUF",
      "RUB", "TRY", "ZAR", "PKR", "THB", "MYR", "IDR", "PHP", "VND", "BDT"
    ]);
    
    return validCurrencies.has(currency.toUpperCase());
  }

  /**
   * Format price with currency symbol
   */
  formatPrice(amount, currency = this.baseCurrency) {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "N/A";
    }

    const currencySymbols = {
      USD: "$", EUR: "€", GBP: "£", JPY: "¥", CAD: "C$", AUD: "A$",
      CHF: "CHF", CNY: "¥", INR: "₹", BRL: "R$", KRW: "₩", MXN: "$",
      SGD: "S$", HKD: "HK$", NOK: "kr", SEK: "kr", DKK: "kr", PLN: "zł",
      CZK: "Kč", HUF: "Ft", RUB: "₽", TRY: "₺", ZAR: "R", PKR: "₨",
      THB: "฿", MYR: "RM", IDR: "Rp", PHP: "₱", VND: "₫", BDT: "৳"
    };

    const symbol = currencySymbols[currency.toUpperCase()] || currency.toUpperCase();
    
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      baseCurrency: this.baseCurrency,
      fxRatesLoaded: Object.keys(this.fxRates).length > 0,
      lastUpdate: this.lastUpdate,
      updateInterval: this.updateInterval,
      currenciesSupported: Object.keys(this.fxRates).length,
    };
  }
}

module.exports = PricingService;
