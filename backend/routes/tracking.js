const express = require("express");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const { ClickLog, Listing, Seller } = require("../models");

const router = express.Router();

// Rate limiting: 1 click per second per IP
const clickRateLimit = rateLimit({
  windowMs: 1000, // 1 second
  max: 1, // limit each IP to 1 request per windowMs
  message: {
    success: false,
    error: "Too many click requests, please wait a moment.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use IP address for rate limiting
    return (
      req.ip || req.connection.remoteAddress || req.headers["x-forwarded-for"]
    );
  },
});

// Helper function to extract IP address
const getClientIP = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.headers["x-real-ip"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.ip ||
    "unknown"
  );
};

// Helper function to extract listing and seller IDs from URL
const extractIdsFromUrl = async (url) => {
  try {
    // Try to find listing by URL
    const listing = await Listing.findOne({
      where: { link: url },
      attributes: ["id", "sellerId"],
    });

    if (listing) {
      return {
        listingId: listing.id,
        sellerId: listing.sellerId,
      };
    }

    // If no direct match, try to find by partial URL match
    const partialMatch = await Listing.findOne({
      where: {
        link: {
          [require("sequelize").Op.like]: `%${new URL(url).hostname}%`,
        },
      },
      attributes: ["id", "sellerId"],
    });

    return partialMatch
      ? {
          listingId: partialMatch.id,
          sellerId: partialMatch.sellerId,
        }
      : { listingId: null, sellerId: null };
  } catch (error) {
    console.error("Error extracting IDs from URL:", error);
    return { listingId: null, sellerId: null };
  }
};

// POST /api/track/click - Track outbound link clicks (standardized endpoint)
router.post(
  "/click",
  clickRateLimit,
  [
    body("url").isURL().withMessage("Valid URL is required").trim(),
    body("timestamp")
      .optional()
      .isISO8601()
      .withMessage("Timestamp must be a valid ISO 8601 date string"),
    body("source")
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Source must be a string with maximum 100 characters"),
    body("listingId")
      .optional()
      .isUUID()
      .withMessage("Listing ID must be a valid UUID"),
    body("sellerId")
      .optional()
      .isUUID()
      .withMessage("Seller ID must be a valid UUID"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const {
        url,
        timestamp,
        source = "frontend",
        listingId: providedListingId,
        sellerId: providedSellerId,
      } = req.body;

      const clientIP = getClientIP(req);
      const userAgent = req.headers["user-agent"];
      const sessionId = req.session?.id || null;

      // Extract listing and seller IDs if not provided
      let finalListingId = providedListingId;
      let finalSellerId = providedSellerId;

      if (!finalListingId || !finalSellerId) {
        const extractedIds = await extractIdsFromUrl(url);
        finalListingId = finalListingId || extractedIds.listingId;
        finalSellerId = finalSellerId || extractedIds.sellerId;
      }

      // Create click log entry
      const clickLog = await ClickLog.create({
        url,
        timestamp: timestamp || new Date(),
        referrerIp: clientIP,
        userAgent,
        sessionId,
        listingId: finalListingId,
        sellerId: finalSellerId,
        source,
      });

      // Log successful click tracking
      console.log(`📊 Click tracked: ${url} from IP: ${clientIP}`);

      res.status(201).json({
        success: true,
        message: "Click tracked successfully",
        data: {
          id: clickLog.id,
          url: clickLog.url,
          timestamp: clickLog.timestamp,
          source: clickLog.source,
        },
      });
    } catch (error) {
      console.error("Error tracking click:", error);
      res.status(500).json({
        success: false,
        error: "Failed to track click",
        code: "TRACKING_ERROR",
      });
    }
  }
);

// POST /api/track-click (Legacy endpoint for backward compatibility)
router.post("/track-click", clickRateLimit, async (req, res) => {
  // Log deprecation warning
  console.warn(
    "Legacy endpoint /api/track-click used. Please update to /api/track/click"
  );

  // Forward the request to the new endpoint
  req.url = "/api/track/click";
  return router.handle(req, res);
});

// GET /api/track/click/stats - Get click statistics (admin only)
router.get("/click/stats", async (req, res) => {
  try {
    const stats = await ClickLog.findAll({
      attributes: [
        [
          require("sequelize").fn("COUNT", require("sequelize").col("id")),
          "totalClicks",
        ],
        [
          require("sequelize").fn(
            "COUNT",
            require("sequelize").fn(
              "DISTINCT",
              require("sequelize").col("referrerIp")
            )
          ),
          "uniqueVisitors",
        ],
        [
          require("sequelize").fn(
            "COUNT",
            require("sequelize").fn(
              "DISTINCT",
              require("sequelize").col("listingId")
            )
          ),
          "uniqueListings",
        ],
        [
          require("sequelize").fn(
            "COUNT",
            require("sequelize").fn(
              "DISTINCT",
              require("sequelize").col("sellerId")
            )
          ),
          "uniqueSellers",
        ],
      ],
      raw: true,
    });

    // Get recent clicks
    const recentClicks = await ClickLog.findAll({
      attributes: ["url", "referrerIp", "createdAt", "source"],
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    // Get top clicked URLs
    const topUrls = await ClickLog.findAll({
      attributes: [
        "url",
        [
          require("sequelize").fn("COUNT", require("sequelize").col("id")),
          "clickCount",
        ],
      ],
      group: ["url"],
      order: [
        [
          require("sequelize").fn("COUNT", require("sequelize").col("id")),
          "DESC",
        ],
      ],
      limit: 10,
    });

    res.json({
      success: true,
      data: {
        summary: stats[0],
        recentClicks,
        topUrls,
      },
    });
  } catch (error) {
    console.error("Error fetching click stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch click statistics",
    });
  }
});

// GET /api/track/click/listing/:id - Get click stats for a specific listing
router.get("/click/listing/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const clickStats = await ClickLog.findAll({
      where: { listingId: id },
      attributes: [
        "id",
        "url",
        "timestamp",
        "referrerIp",
        "source",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
      limit: 100,
    });

    const totalClicks = await ClickLog.count({
      where: { listingId: id },
    });

    const uniqueVisitors = await ClickLog.count({
      where: { listingId: id },
      distinct: true,
      col: "referrerIp",
    });

    res.json({
      success: true,
      data: {
        listingId: id,
        totalClicks,
        uniqueVisitors,
        clicks: clickStats,
      },
    });
  } catch (error) {
    console.error("Error fetching listing click stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch listing click statistics",
    });
  }
});

module.exports = router;
