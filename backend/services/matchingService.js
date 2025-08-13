const { Product, Listing, Category } = require("../models");
const { Op } = require("sequelize");

/**
 * Production-Ready Product Matching Service
 * Uses deterministic algorithms with configurable thresholds
 */
class MatchingService {
  constructor() {
    this.matchThreshold = parseFloat(process.env.MATCH_THRESHOLD) || 0.82;
    this.brands = this.loadBrands();
    this.stopWords = this.loadStopWords();
    this.units = this.loadUnits();
  }

  /**
   * Load brand configurations
   */
  loadBrands() {
    try {
      const brandsConfig = require("../config/brands.json");
      return new Map(Object.entries(brandsConfig));
    } catch (error) {
      console.warn("Brands config not found, using default brands");
      return new Map([
        ["apple", { aliases: ["iphone", "ipad", "macbook"], category: "electronics" }],
        ["samsung", { aliases: ["galaxy", "note"], category: "electronics" }],
        ["sony", { aliases: ["playstation", "xperia"], category: "electronics" }],
        ["nike", { aliases: ["air", "jordan"], category: "clothing" }],
        ["adidas", { aliases: ["boost", "yeezy"], category: "clothing" }],
      ]);
    }
  }

  /**
   * Load stop words for text normalization
   */
  loadStopWords() {
    return new Set([
      "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
      "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
      "will", "would", "could", "should", "may", "might", "can", "this", "that", "these", "those",
      "new", "used", "refurbished", "original", "genuine", "authentic", "brand", "model", "version"
    ]);
  }

  /**
   * Load unit mappings for normalization
   */
  loadUnits() {
    return new Map([
      ["gb", "GB"], ["gigabyte", "GB"], ["gigabytes", "GB"],
      ["mb", "MB"], ["megabyte", "MB"], ["megabytes", "MB"],
      ["tb", "TB"], ["terabyte", "TB"], ["terabytes", "TB"],
      ["ml", "ML"], ["milliliter", "ML"], ["milliliters", "ML"],
      ["l", "L"], ["liter", "L"], ["liters", "L"],
      ["kg", "KG"], ["kilogram", "KG"], ["kilograms", "KG"],
      ["g", "G"], ["gram", "G"], ["grams", "G"],
      ["cm", "CM"], ["centimeter", "CM"], ["centimeters", "CM"],
      ["mm", "MM"], ["millimeter", "MM"], ["millimeters", "MM"],
    ]);
  }

  /**
   * Normalize text for comparison
   */
  normalize(text) {
    if (!text) return "";
    
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ") // Remove punctuation
      .replace(/\s+/g, " ") // Normalize whitespace
      .split(" ")
      .filter(word => word.length > 2 && !this.stopWords.has(word))
      .map(word => this.normalizeUnit(word))
      .join(" ")
      .trim();
  }

  /**
   * Normalize units to standard format
   */
  normalizeUnit(word) {
    const lowerWord = word.toLowerCase();
    for (const [unit, standard] of this.units) {
      if (lowerWord.includes(unit)) {
        return word.replace(new RegExp(unit, "gi"), standard);
      }
    }
    return word;
  }

  /**
   * Extract brand and model from title
   */
  extractBrandModel(title) {
    const normalizedTitle = this.normalize(title);
    const words = normalizedTitle.split(" ");
    
    let brand = null;
    let model = null;
    
    // Find brand
    for (const [brandName, brandInfo] of this.brands) {
      if (normalizedTitle.includes(brandName.toLowerCase())) {
        brand = brandName;
        
        // Look for model patterns
        const modelPatterns = brandInfo.aliases || [];
        for (const pattern of modelPatterns) {
          if (normalizedTitle.includes(pattern.toLowerCase())) {
            model = pattern;
            break;
          }
        }
        
        // Look for numeric models (e.g., iPhone 14, Galaxy S23)
        const numericMatch = normalizedTitle.match(new RegExp(`${brandName.toLowerCase()}\\s*(\\d+[a-z]*)`, "i"));
        if (numericMatch) {
          model = numericMatch[1];
        }
        
        break;
      }
    }
    
    return { brand, model };
  }

  /**
   * Calculate Jaro-Winkler similarity between two strings
   */
  jaroWinkler(s1, s2) {
    if (s1 === s2) return 1.0;
    if (s1.length === 0 || s2.length === 0) return 0.0;
    
    const matchWindow = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;
    if (matchWindow < 0) return 0.0;
    
    const s1Matches = new Array(s1.length).fill(false);
    const s2Matches = new Array(s2.length).fill(false);
    
    let matches = 0;
    let transpositions = 0;
    
    // Find matches
    for (let i = 0; i < s1.length; i++) {
      const start = Math.max(0, i - matchWindow);
      const end = Math.min(i + matchWindow + 1, s2.length);
      
      for (let j = start; j < end; j++) {
        if (s2Matches[j] || s1[i] !== s2[j]) continue;
        
        s1Matches[i] = true;
        s2Matches[j] = true;
        matches++;
        break;
      }
    }
    
    if (matches === 0) return 0.0;
    
    // Find transpositions
    let k = 0;
    for (let i = 0; i < s1.length; i++) {
      if (!s1Matches[i]) continue;
      
      while (!s2Matches[k]) k++;
      if (s1[i] !== s2[k]) transpositions++;
      k++;
    }
    
    transpositions /= 2;
    
    // Calculate Jaro distance
    const jaro = (matches / s1.length + matches / s2.length + (matches - transpositions) / matches) / 3;
    
    // Calculate Winkler modification
    let prefix = 0;
    for (let i = 0; i < Math.min(4, Math.min(s1.length, s2.length)); i++) {
      if (s1[i] === s2[i]) prefix++;
      else break;
    }
    
    return jaro + 0.1 * prefix * (1 - jaro);
  }

  /**
   * Calculate Jaccard similarity between two sets
   */
  jaccard(set1, set2) {
    if (set1.size === 0 && set2.size === 0) return 1.0;
    if (set1.size === 0 || set2.size === 0) return 0.0;
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  /**
   * Calculate numeric similarity for model numbers
   */
  numericSimilarity(str1, str2) {
    const num1 = str1.match(/\d+/);
    const num2 = str2.match(/\d+/);
    
    if (!num1 || !num2) return 0.0;
    
    const val1 = parseInt(num1[0]);
    const val2 = parseInt(num2[0]);
    
    if (val1 === val2) return 1.0;
    
    const max = Math.max(val1, val2);
    const diff = Math.abs(val1 - val2);
    
    return Math.max(0, 1 - diff / max);
  }

  /**
   * Calculate comprehensive similarity score
   */
  calculateSimilarity(product1, product2) {
    const scores = {
      title: 0,
      brand: 0,
      model: 0,
      category: 0,
      description: 0,
    };
    
    // Title similarity (40% weight)
    if (product1.title && product2.title) {
      const norm1 = this.normalize(product1.title);
      const norm2 = this.normalize(product2.title);
      
      const jaroWinklerScore = this.jaroWinkler(norm1, norm2);
      const jaccardScore = this.jaccard(new Set(norm1.split(" ")), new Set(norm2.split(" ")));
      
      scores.title = (jaroWinklerScore * 0.6) + (jaccardScore * 0.4);
    }
    
    // Brand similarity (25% weight)
    if (product1.brand && product2.brand) {
      if (product1.brand.toLowerCase() === product2.brand.toLowerCase()) {
        scores.brand = 1.0;
      } else {
        // Check for brand aliases
        const brand1 = this.brands.get(product1.brand.toLowerCase());
        const brand2 = this.brands.get(product2.brand.toLowerCase());
        
        if (brand1 && brand2 && brand1.aliases && brand2.aliases) {
          const hasCommonAlias = brand1.aliases.some(alias => 
            brand2.aliases.includes(alias)
          );
          scores.brand = hasCommonAlias ? 0.8 : 0.0;
        } else {
          scores.brand = 0.0;
        }
      }
    }
    
    // Model similarity (20% weight)
    if (product1.model && product2.model) {
      const norm1 = this.normalize(product1.model);
      const norm2 = this.normalize(product2.model);
      
      if (norm1 === norm2) {
        scores.model = 1.0;
      } else {
        const jaroScore = this.jaroWinkler(norm1, norm2);
        const numericScore = this.numericSimilarity(norm1, norm2);
        scores.model = Math.max(jaroScore, numericScore);
      }
    }
    
    // Category similarity (10% weight)
    if (product1.categoryId && product2.categoryId) {
      scores.category = product1.categoryId === product2.categoryId ? 1.0 : 0.0;
    }
    
    // Description similarity (5% weight)
    if (product1.description && product2.description) {
      const norm1 = this.normalize(product1.description);
      const norm2 = this.normalize(product2.description);
      
      const descWords1 = new Set(norm1.split(" ").filter(w => w.length > 3));
      const descWords2 = new Set(norm2.split(" ").filter(w => w.length > 3));
      
      scores.description = this.jaccard(descWords1, descWords2);
    }
    
    // Calculate weighted score
    const weights = { title: 0.4, brand: 0.25, model: 0.2, category: 0.1, description: 0.05 };
    let totalScore = 0;
    let totalWeight = 0;
    
    for (const [key, score] of Object.entries(scores)) {
      if (score > 0) {
        totalScore += score * weights[key];
        totalWeight += weights[key];
      }
    }
    
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  /**
   * Find or create product match
   */
  async findOrCreateMatch(listingData) {
    try {
      const { title, description, source, link, platformListingId } = listingData;
      
      // Check for existing listing to prevent duplicates
      const existingListing = await Listing.findOne({
        where: {
          [Op.or]: [
            { source, link },
            { source, platformListingId: platformListingId || null },
          ].filter(condition => condition.platformListingId !== null || condition.link),
        },
      });
      
      if (existingListing) {
        return {
          product: existingListing.product,
          confidenceScore: 1.0,
          matchType: "duplicate",
          matchedFields: ["source", "link"],
        };
      }
      
      // Extract brand and model
      const { brand, model } = this.extractBrandModel(title);
      
      // Find similar products
      const candidates = await this.findCandidates({
        title,
        brand,
        model,
        source,
        categoryId: listingData.categoryId,
      });
      
      if (candidates.length === 0) {
        // Create new product
        const newProduct = await Product.create({
          title,
          description,
          brand,
          model,
          source,
          keywords: this.extractKeywords(title, brand, model, description),
          categoryId: listingData.categoryId,
        });
        
        return {
          product: newProduct,
          confidenceScore: 1.0,
          matchType: "new",
          matchedFields: [],
        };
      }
      
      // Find best match
      let bestMatch = { product: null, score: 0, fields: [] };
      
      for (const candidate of candidates) {
        const score = this.calculateSimilarity(
          { title, brand, model, categoryId: listingData.categoryId },
          candidate
        );
        
        if (score > bestMatch.score) {
          bestMatch = { product: candidate, score, fields: this.getMatchedFields(score) };
        }
      }
      
      // Check if score meets threshold
      if (bestMatch.score >= this.matchThreshold) {
        return {
          product: bestMatch.product,
          confidenceScore: bestMatch.score,
          matchType: this.getMatchType(bestMatch.score),
          matchedFields: bestMatch.fields,
        };
      }
      
      // Create new product if no good match found
      const newProduct = await Product.create({
        title,
        description,
        brand,
        model,
        source,
        keywords: this.extractKeywords(title, brand, model, description),
        categoryId: listingData.categoryId,
      });
      
      return {
        product: newProduct,
        confidenceScore: bestMatch.score,
        matchType: "new",
        matchedFields: bestMatch.fields,
      };
      
    } catch (error) {
      console.error("Error in product matching:", error);
      throw error;
    }
  }

  /**
   * Find candidate products for matching
   */
  async findCandidates(criteria) {
    const { title, brand, model, source, categoryId } = criteria;
    const whereClause = { isActive: true };
    
    // Build search conditions
    const conditions = [];
    
    if (title) {
      const normalizedTitle = this.normalize(title);
      const titleWords = normalizedTitle.split(" ").filter(w => w.length > 2);
      
      if (titleWords.length > 0) {
        conditions.push({
          title: {
            [Op.iLike]: titleWords.map(word => `%${word}%`),
          },
        });
      }
    }
    
    if (brand) {
      conditions.push({
        brand: {
          [Op.iLike]: `%${brand}%`,
        },
      });
    }
    
    if (model) {
      conditions.push({
        model: {
          [Op.iLike]: `%${model}%`,
        },
      });
    }
    
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }
    
    if (conditions.length > 0) {
      whereClause[Op.or] = conditions;
    }
    
    // Exclude products from the same source
    whereClause.source = { [Op.ne]: source };
    
    return await Product.findAll({
      where: whereClause,
      limit: 20,
      order: [["createdAt", "DESC"]],
    });
  }

  /**
   * Extract keywords from product data
   */
  extractKeywords(title, brand, model, description) {
    const keywords = new Set();
    
    if (title) {
      const titleWords = this.normalize(title).split(" ").filter(w => w.length > 3);
      titleWords.forEach(word => keywords.add(word));
    }
    
    if (brand) keywords.add(brand.toLowerCase());
    if (model) keywords.add(model.toLowerCase());
    
    if (description) {
      const descWords = this.normalize(description).split(" ").filter(w => w.length > 4);
      descWords.slice(0, 10).forEach(word => keywords.add(word));
    }
    
    return Array.from(keywords).join(", ");
  }

  /**
   * Get matched fields based on score
   */
  getMatchedFields(score) {
    const fields = [];
    if (score >= 0.9) fields.push("exact");
    if (score >= 0.7) fields.push("title", "brand");
    if (score >= 0.5) fields.push("model");
    return fields;
  }

  /**
   * Get match type based on score
   */
  getMatchType(score) {
    if (score >= 0.9) return "exact";
    if (score >= 0.7) return "similar";
    if (score >= 0.5) return "partial";
    return "none";
  }

  /**
   * Get matching statistics
   */
  async getMatchingStats() {
    const totalProducts = await Product.count();
    const totalListings = await Listing.count();
    
    const matchTypes = await Product.findAll({
      attributes: [
        "source",
        [require("sequelize").fn("COUNT", require("sequelize").col("id")), "count"],
      ],
      group: ["source"],
      raw: true,
    });
    
    return {
      totalProducts,
      totalListings,
      matchTypes,
      threshold: this.matchThreshold,
    };
  }
}

module.exports = MatchingService;
