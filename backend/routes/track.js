const express = require("express");
const router = express.Router();
const { ClickLog } = require("../models");
const rateLimit = require("express-rate-limit");
const { v4: uuidv4 } = require("uuid");

// Rate limiting for click tracking (1 click per second per IP)
const clickRateLimit = rateLimit({
  windowMs: 1000, // 1 second
  max: 1, // limit each IP to 1 request per windowMs
  message: {
    error: "Click tracking rate limit exceeded",
    code: "CLICK_RATE_LIMIT_EXCEEDED",
  },
  keyGenerator: (req) => {
    // Use IP address for rate limiting
    return req.ip || req.connection.remoteAddress || "unknown";
  },
});

/**
 * POST /api/track/click
 * Track outbound link clicks with comprehensive data
 */
router.post("/click", clickRateLimit, async (req, res) => {
  try {
    const {
      url,
      listingId,
      sellerId,
      source,
      timestamp,
      userAgent,
      referrer,
      sessionId,
    } = req.body;

    // Validate required fields
    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL is required",
        code: "MISSING_URL",
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: "Invalid URL format",
        code: "INVALID_URL",
      });
    }

    // Extract IP address
    const ipAddress =
      req.ip ||
      req.connection.remoteAddress ||
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      "unknown";

    // Hash IP address for privacy (optional)
    const hashedIp =
      process.env.HASH_IPS === "true"
        ? require("crypto").createHash("sha256").update(ipAddress).digest("hex")
        : ipAddress;

    // Create click log entry
    const clickLog = await ClickLog.create({
      url,
      listingId: listingId || null,
      sellerId: sellerId || null,
      source: source || "unknown",
      timestamp: timestamp || new Date(),
      referrerIp: hashedIp,
      userAgent: userAgent || req.headers["user-agent"] || null,
      referrer: referrer || req.headers.referer || null,
      sessionId: sessionId || null,
      metadata: {
        headers: {
          "x-forwarded-for": req.headers["x-forwarded-for"],
          "x-real-ip": req.headers["x-real-ip"],
          "cf-connecting-ip": req.headers["cf-connecting-ip"],
        },
        geoip: req.headers["cf-ipcountry"]
          ? {
              country: req.headers["cf-ipcountry"],
            }
          : null,
      },
    });

    // Log successful click tracking
    console.log(
      `Click tracked: ${url} from IP ${hashedIp} at ${new Date().toISOString()}`
    );

    res.json({
      success: true,
      data: {
        id: clickLog.id,
        trackedAt: clickLog.createdAt,
        message: "Click tracked successfully",
      },
    });
  } catch (error) {
    console.error("Click tracking error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error during click tracking",
      code: "TRACKING_ERROR",
    });
  }
});

/**
 * POST /api/track-click (Legacy endpoint for backward compatibility)
 * Redirects to the new standardized endpoint
 */
router.post("/track-click", clickRateLimit, async (req, res) => {
  // Log deprecation warning
  console.warn(
    "Legacy endpoint /api/track-click used. Please update to /api/track/click"
  );

  // Forward the request to the new endpoint
  req.url = "/api/track/click";
  return router.handle(req, res);
});

/**
 * GET /api/track/click/stats
 * Get click tracking statistics (admin only)
 */
router.get("/click/stats", async (req, res) => {
  try {
    // Get basic stats
    const totalClicks = await ClickLog.count();
    const todayClicks = await ClickLog.count({
      where: {
        createdAt: {
          [require("sequelize").Op.gte]: new Date(
            new Date().setHours(0, 0, 0, 0)
          ),
        },
      },
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

    // Get clicks by source
    const clicksBySource = await ClickLog.findAll({
      attributes: [
        "source",
        [
          require("sequelize").fn("COUNT", require("sequelize").col("id")),
          "clickCount",
        ],
      ],
      group: ["source"],
      order: [
        [
          require("sequelize").fn("COUNT", require("sequelize").col("id")),
          "DESC",
        ],
      ],
    });

    res.json({
      success: true,
      data: {
        totalClicks,
        todayClicks,
        topUrls: topUrls.map((item) => ({
          url: item.url,
          clickCount: parseInt(item.dataValues.clickCount),
        })),
        clicksBySource: clicksBySource.map((item) => ({
          source: item.source,
          clickCount: parseInt(item.dataValues.clickCount),
        })),
      },
    });
  } catch (error) {
    console.error("Click stats error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error getting click stats",
      code: "STATS_ERROR",
    });
  }
});

/**
 * GET /api/track/click/listing/:id
 * Get click stats for a specific listing
 */
router.get("/click/listing/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const clicks = await ClickLog.findAll({
      where: { listingId: id },
      attributes: [
        "id",
        "url",
        "timestamp",
        "source",
        "referrerIp",
        "userAgent",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
      limit: 100,
    });

    const totalClicks = await ClickLog.count({
      where: { listingId: id },
    });

    res.json({
      success: true,
      data: {
        listingId: id,
        totalClicks,
        recentClicks: clicks,
      },
    });
  } catch (error) {
    console.error("Listing click stats error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error getting listing click stats",
      code: "LISTING_STATS_ERROR",
    });
  }
});

module.exports = router;
