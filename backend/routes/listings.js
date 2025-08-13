const express = require("express");
const router = express.Router();
const { Listing, sequelize } = require("../models");
const { validateSearchParams } = require("../middleware/validation");
const { cacheMiddleware } = require("../middleware/cache");
const rateLimit = require("express-rate-limit");
const { requireAdmin } = require("../middleware/auth");
const ProductMatchingService = require("../services/ProductMatchingService");

// Rate limiting for search API
const searchRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many search requests, please try again later.",
    code: "RATE_LIMIT_EXCEEDED",
  },
});

// Cache settings for search results
const searchCacheOptions = {
  duration: 5 * 60, // 5 minutes
  keyGenerator: (req) => {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      location,
      sortBy,
      sortOrder,
      page,
      limit,
    } = req.query;
    return `search:${q || ""}:${category || ""}:${minPrice || ""}:${
      maxPrice || ""
    }:${location || ""}:${sortBy || ""}:${sortOrder || ""}:${page || 1}:${
      limit || 20
    }`;
  },
};

/**
 * GET /api/listings/grouped
 * Get grouped products for price comparison
 * Query parameters:
 * - q: Search query
 * - category: Category filter
 * - minPrice: Minimum price filter
 * - maxPrice: Maximum price filter
 * - location: Location filter
 * - condition: Product condition
 * - verifiedOnly: Show only verified sellers
 * - platforms: Comma-separated platform list
 */
router.get(
  "/grouped",
  searchRateLimit,
  validateSearchParams,
  cacheMiddleware({ duration: 10 * 60 }), // 10 minutes cache
  async (req, res) => {
    try {
      const {
        q = "",
        category = "",
        minPrice = 0,
        maxPrice = null,
        location = "",
        condition = "",
        verifiedOnly = false,
        platforms = "",
      } = req.query;

      // Convert and validate numeric parameters
      const parsedMinPrice = Math.max(0, parseFloat(minPrice) || 0);
      const parsedMaxPrice = maxPrice
        ? Math.max(0, parseFloat(maxPrice))
        : null;

      // Parse platforms filter
      const platformList = platforms
        ? platforms.split(",").map((p) => p.trim())
        : [];

      // Build filters object
      const filters = {
        verifiedOnly: verifiedOnly === "true",
        platforms: platformList,
        category: category.trim(),
        minPrice: parsedMinPrice,
        maxPrice: parsedMaxPrice,
        location: location.trim(),
        condition: condition.trim(),
      };

      // Get grouped products
      const groupedProducts = await ProductMatchingService.getGroupedProducts(
        q.trim(),
        filters
      );

      // Calculate statistics
      const stats = {
        totalProducts: groupedProducts.length,
        totalListings: groupedProducts.reduce(
          (sum, group) => sum + group.totalListings,
          0
        ),
        totalSellers: new Set(
          groupedProducts.flatMap((group) =>
            group.listings.map((listing) => listing.seller?.id).filter(Boolean)
          )
        ).size,
        verifiedSellers: groupedProducts.reduce(
          (sum, group) => sum + group.verifiedSellers,
          0
        ),
        averagePrice:
          groupedProducts.length > 0
            ? groupedProducts.reduce(
                (sum, group) => sum + (group.priceRange.min || 0),
                0
              ) / groupedProducts.length
            : 0,
      };

      res.json({
        success: true,
        data: groupedProducts,
        stats,
        meta: {
          searchTime: Date.now() - req.startTime,
          totalResults: groupedProducts.length,
          hasFilters: !!(
            q ||
            category ||
            parsedMinPrice > 0 ||
            parsedMaxPrice ||
            location ||
            condition ||
            verifiedOnly === "true" ||
            platforms
          ),
        },
      });
    } catch (error) {
      console.error("Grouped search error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error during grouped search",
        code: "GROUPED_SEARCH_ERROR",
      });
    }
  }
);

/**
 * GET /api/listings
 * Search listings with filters and pagination
 * Query parameters:
 * - q: Search query (full-text search)
 * - category: Category filter (slug or name)
 * - minPrice: Minimum price filter
 * - maxPrice: Maximum price filter
 * - location: Location filter (city, state, or country)
 * - condition: Product condition (new, used, refurbished)
 * - sortBy: Sort field (price, created_at, views_count, favorites_count, seller_rating, relevance)
 * - sortOrder: Sort order (ASC, DESC)
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 */
router.get(
  "/",
  searchRateLimit,
  validateSearchParams,
  cacheMiddleware(searchCacheOptions),
  async (req, res) => {
    try {
      const {
        q = "",
        category = "",
        minPrice = 0,
        maxPrice = null,
        location = "",
        condition = "",
        sortBy = "created_at",
        sortOrder = "DESC",
        page = 1,
        limit = 20,
      } = req.query;

      // Convert and validate numeric parameters
      const parsedPage = Math.max(1, parseInt(page, 10));
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10)));
      const parsedMinPrice = Math.max(0, parseFloat(minPrice) || 0);
      const parsedMaxPrice = maxPrice
        ? Math.max(0, parseFloat(maxPrice))
        : null;

      // Simple search without complex associations
      const offset = (parsedPage - 1) * parsedLimit;
      const where = {};

      // Build where clause
      where.availabilityStatus = "available";

      if (q.trim()) {
        where[sequelize.Op.or] = [
          { title: { [sequelize.Op.iLike]: `%${q.trim()}%` } },
          { description: { [sequelize.Op.iLike]: `%${q.trim()}%` } },
        ];
      }

      if (parsedMinPrice > 0) {
        where.price = { [sequelize.Op.gte]: parsedMinPrice };
      }

      if (parsedMaxPrice && parsedMaxPrice > 0) {
        where.price = { ...where.price, [sequelize.Op.lte]: parsedMaxPrice };
      }

      if (location.trim()) {
        where[sequelize.Op.or] = [
          { location: { [sequelize.Op.iLike]: `%${location.trim()}%` } },
          { city: { [sequelize.Op.iLike]: `%${location.trim()}%` } },
          { state: { [sequelize.Op.iLike]: `%${location.trim()}%` } },
          { country: { [sequelize.Op.iLike]: `%${location.trim()}%` } },
        ];
      }

      if (condition.trim()) {
        where.condition = condition.trim();
      }

      // Build order clause
      const order = [];
      const allowedSortFields = {
        price: "price",
        created_at: "createdAt",
        updated_at: "updatedAt",
        views_count: "viewsCount",
        favorites_count: "favoritesCount",
      };

      const sortField = allowedSortFields[sortBy] || "createdAt";
      const orderDirection = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";
      order.push([sortField, orderDirection]);

      // Execute query with simple includes
      const { count, rows: listings } = await Listing.findAndCountAll({
        where,
        include: [
          {
            model: sequelize.models.Seller,
            as: "seller",
            attributes: ["id", "name", "rating", "totalRatings", "isVerified"],
          },
          {
            model: sequelize.models.Product,
            as: "product",
            attributes: ["id", "title", "brand", "model"],
          },
        ],
        order,
        limit: parsedLimit,
        offset,
      });

      // Format response
      const formattedListings = listings.map((listing) => ({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: parseFloat(listing.price),
        originalPrice: listing.originalPrice
          ? parseFloat(listing.originalPrice)
          : null,
        currency: listing.currency,
        location: listing.location,
        city: listing.city,
        state: listing.state,
        country: listing.country,
        condition: listing.condition,
        availabilityStatus: listing.availabilityStatus,
        images: listing.images,
        metadata: listing.metadata,
        viewsCount: listing.viewsCount,
        favoritesCount: listing.favoritesCount,
        externalSource: listing.externalSource,
        externalUrl: listing.externalUrl,
        createdAt: listing.createdAt,
        updatedAt: listing.updatedAt,
        seller: listing.seller
          ? {
              id: listing.seller.id,
              name: listing.seller.name,
              rating: listing.seller.rating || 0,
              totalRatings: listing.seller.totalRatings || 0,
              isVerified: listing.seller.isVerified || false,
            }
          : null,
        product: listing.product
          ? {
              id: listing.product.id,
              title: listing.product.title,
              brand: listing.product.brand,
              model: listing.product.model,
            }
          : null,
      }));

      const response = {
        success: true,
        data: formattedListings,
        pagination: {
          currentPage: parsedPage,
          totalPages: Math.ceil(count / parsedLimit),
          totalItems: count,
          itemsPerPage: parsedLimit,
          hasNextPage: parsedPage < Math.ceil(count / parsedLimit),
          hasPrevPage: parsedPage > 1,
        },
        filters: {
          query: q || null,
          category: category || null,
          minPrice: parsedMinPrice > 0 ? parsedMinPrice : null,
          maxPrice: parsedMaxPrice,
          location: location || null,
          condition: condition || null,
          sortBy,
          sortOrder,
        },
        meta: {
          searchTime: Date.now() - req.startTime,
          totalResults: count,
          hasFilters: !!(
            q ||
            category ||
            parsedMinPrice > 0 ||
            parsedMaxPrice ||
            location ||
            condition
          ),
        },
      };

      res.json(response);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        code: "SEARCH_ERROR",
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  }
);

/**
 * GET /api/listings/:id
 * Get specific listing by ID
 */
router.get(
  "/:id",
  cacheMiddleware({ duration: 10 * 60 }), // 10 minutes cache
  async (req, res) => {
    try {
      const { id } = req.params;

      // Validate UUID format
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        return res.status(400).json({
          success: false,
          error: "Invalid listing ID format",
          code: "INVALID_ID",
        });
      }

      const listing = await Listing.findById(id);

      if (!listing) {
        return res.status(404).json({
          success: false,
          error: "Listing not found",
          code: "LISTING_NOT_FOUND",
        });
      }

      // Increment view count asynchronously
      Listing.incrementViews(id).catch((err) =>
        console.error("Failed to increment view count:", err)
      );

      // Get similar listings
      const similarListings = await Listing.getSimilar(id, 6);

      res.json({
        success: true,
        data: listing,
        similar: similarListings,
        meta: {
          viewIncremented: true,
        },
      });
    } catch (error) {
      console.error("Get listing error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
        code: "FETCH_ERROR",
      });
    }
  }
);

/**
 * GET /api/listings/search/suggestions
 * Get search suggestions based on query
 */
router.get("/search/suggestions", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: [],
        message: "Query too short for suggestions",
      });
    }

    // Simple implementation - in production, you might want to use a dedicated search service
    const suggestionsQuery = `
      SELECT DISTINCT 
        ts_headline('english', title, plainto_tsquery('english', $1)) as highlighted_title,
        title,
        COUNT(*) as frequency
      FROM listings
      WHERE 
        availability_status = 'available' 
        AND search_vector @@ plainto_tsquery('english', $1)
      GROUP BY title
      ORDER BY frequency DESC, title
      LIMIT 10
    `;

    const { sequelize } = require("../config/database");
    const result = await sequelize.query(suggestionsQuery, {
      bind: [q.trim()],
      type: sequelize.QueryTypes.SELECT,
    });

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        title: row.title,
        highlightedTitle: row.highlighted_title,
        frequency: parseInt(row.frequency),
      })),
    });
  } catch (error) {
    console.error("Search suggestions error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get search suggestions",
      code: "SUGGESTIONS_ERROR",
    });
  }
});

/**
 * GET /api/listings/categories/popular
 * Get popular categories with listing counts
 */
router.get(
  "/categories/popular",
  cacheMiddleware({ duration: 30 * 60 }), // 30 minutes cache
  async (req, res) => {
    try {
      const categoriesQuery = `
        SELECT 
          c.id,
          c.name,
          c.slug,
          c.description,
          COUNT(l.id) as listing_count,
          AVG(l.price) as avg_price
        FROM categories c
        LEFT JOIN listings l ON c.id = l.category_id AND l.availability_status = 'available'
        GROUP BY c.id, c.name, c.slug, c.description
        HAVING COUNT(l.id) > 0
        ORDER BY listing_count DESC, c.name
        LIMIT 20
      `;

      const { sequelize } = require("../config/database");
      const result = await sequelize.query(categoriesQuery, {
        type: sequelize.QueryTypes.SELECT,
      });

      res.json({
        success: true,
        data: result.rows.map((row) => ({
          id: row.id,
          name: row.name,
          slug: row.slug,
          description: row.description,
          listingCount: parseInt(row.listing_count),
          averagePrice: row.avg_price ? parseFloat(row.avg_price) : 0,
        })),
      });
    } catch (error) {
      console.error("Popular categories error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get popular categories",
        code: "CATEGORIES_ERROR",
      });
    }
  }
);

/**
 * GET /api/listings/stats/overview
 * Get marketplace statistics
 */
router.get(
  "/stats/overview",
  cacheMiddleware({ duration: 15 * 60 }), // 15 minutes cache
  async (req, res) => {
    try {
      const { sequelize } = require("../config/database");

      const statsQuery = `
        SELECT 
          COUNT(*) as total_listings,
          COUNT(DISTINCT seller_id) as total_sellers,
          COUNT(DISTINCT category_id) as total_categories,
          AVG(price) as average_price,
          MIN(price) as min_price,
          MAX(price) as max_price,
          SUM(views_count) as total_views,
          COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as new_today,
          COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as new_this_week
        FROM listings
        WHERE availability_status = 'available'
      `;

      const result = await sequelize.query(statsQuery, {
        type: sequelize.QueryTypes.SELECT,
      });
      const stats = result.rows[0];

      res.json({
        success: true,
        data: {
          totalListings: parseInt(stats.total_listings),
          totalSellers: parseInt(stats.total_sellers),
          totalCategories: parseInt(stats.total_categories),
          averagePrice: stats.average_price
            ? parseFloat(stats.average_price)
            : 0,
          priceRange: {
            min: stats.min_price ? parseFloat(stats.min_price) : 0,
            max: stats.max_price ? parseFloat(stats.max_price) : 0,
          },
          totalViews: parseInt(stats.total_views),
          newListings: {
            today: parseInt(stats.new_today),
            thisWeek: parseInt(stats.new_this_week),
          },
        },
      });
    } catch (error) {
      console.error("Stats overview error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get marketplace statistics",
        code: "STATS_ERROR",
      });
    }
  }
);

// Existing routes for admin functionality
router.post("/", requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      currency,
      condition,
      availability,
      images,
      url,
      productId,
      sellerId,
    } = req.body;

    // Validate required fields
    if (!title || !price || !productId || !sellerId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: title, price, productId, sellerId",
      });
    }

    // Create listing
    const listing = await Listing.create({
      title,
      description,
      price: parseFloat(price),
      currency: currency || "USD",
      condition: condition || "new",
      availability_status: availability || "available",
      images: images || [],
      url,
      productId,
      sellerId,
      source: "admin",
    });

    res.status(201).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error("Create listing error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create listing",
    });
  }
});

module.exports = router;
