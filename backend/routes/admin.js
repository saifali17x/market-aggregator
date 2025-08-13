const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../middleware/auth");
const { Seller, Listing } = require("../models");
// Temporarily disabled: const { ScrapingJob } = require("../models");
// Temporarily disabled to get basic API running
// const EnhancedScraperService = require("../services/EnhancedScraperService");

// Initialize scraper service - temporarily disabled
// const scraperService = new EnhancedScraperService();

/**
 * GET /api/admin/scraping/jobs
 * Get all scraping jobs - TEMPORARILY DISABLED
 */
router.get("/scraping/jobs", requireAdmin, async (req, res) => {
  res.json({
    success: true,
    data: [],
    message: "Scraping jobs temporarily disabled",
  });
});

/**
 * POST /api/admin/scraping/jobs
 * Create a new scraping job - TEMPORARILY DISABLED
 */
router.post("/scraping/jobs", requireAdmin, async (req, res) => {
  res.status(400).json({
    success: false,
    error: "Scraping jobs temporarily disabled",
  });
});

/**
 * POST /api/admin/scraping/jobs/:id/run
 * Manually run a scraping job - TEMPORARILY DISABLED
 */
router.post("/scraping/jobs/:id/run", requireAdmin, async (req, res) => {
  res.status(400).json({
    success: false,
    error: "Scraping jobs temporarily disabled",
  });
});

/**
 * DELETE /api/admin/scraping/jobs/:id
 * Delete a scraping job - TEMPORARILY DISABLED
 */
router.delete("/scraping/jobs/:id", requireAdmin, async (req, res) => {
  res.status(400).json({
    success: false,
    error: "Scraping jobs temporarily disabled",
  });
});

/**
 * GET /api/admin/sellers
 * Get all sellers with verification status
 */
router.get("/sellers", requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", verified = "" } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (search) {
      whereClause[require("sequelize").Op.or] = [
        { name: { [require("sequelize").Op.iLike]: `%${search}%` } },
        { businessName: { [require("sequelize").Op.iLike]: `%${search}%` } },
        { email: { [require("sequelize").Op.iLike]: `%${search}%` } },
      ];
    }

    if (verified !== "") {
      whereClause.verified = verified === "true";
    }

    const { count, rows } = await Seller.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Listing,
          as: "listings",
          attributes: ["id", "title", "status"],
        },
      ],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch sellers",
    });
  }
});

/**
 * PUT /api/admin/sellers/:id/verify
 * Toggle seller verification status
 */
router.put("/sellers/:id/verify", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { verified, reason } = req.body;

    const seller = await Seller.findByPk(id);
    if (!seller) {
      return res.status(404).json({
        success: false,
        error: "Seller not found",
      });
    }

    await seller.update({
      verified: verified,
      status: verified ? "verified" : "pending",
      verifiedAt: verified ? new Date() : null,
    });

    res.json({
      success: true,
      data: seller,
      message: `Seller ${verified ? "verified" : "unverified"} successfully`,
    });
  } catch (error) {
    console.error("Error updating seller verification:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update seller verification",
    });
  }
});

/**
 * GET /api/admin/dashboard/stats
 * Get admin dashboard statistics
 */
router.get("/dashboard/stats", requireAdmin, async (req, res) => {
  try {
    const [
      totalListings,
      totalSellers,
      verifiedSellers,
      pendingSellers,
      totalProducts,
      activeScrapingJobs,
      failedScrapingJobs,
    ] = await Promise.all([
      Listing.count(),
      Seller.count(),
      Seller.count({ where: { verified: true } }),
      Seller.count({ where: { status: "pending" } }),
      require("../models").Product.count(),
      0, // Scraping jobs temporarily disabled
      0, // Scraping jobs temporarily disabled
    ]);

    // Get recent activity
    const recentListings = await Listing.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Seller,
          as: "seller",
          attributes: ["name", "verified"],
        },
      ],
    });

    // Scraping jobs temporarily disabled
    const recentScrapingJobs = [];

    res.json({
      success: true,
      data: {
        overview: {
          totalListings,
          totalSellers,
          verifiedSellers,
          pendingSellers,
          totalProducts,
          activeScrapingJobs,
          failedScrapingJobs,
        },
        recentActivity: {
          listings: recentListings,
          scrapingJobs: recentScrapingJobs,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard statistics",
    });
  }
});

/**
 * POST /api/admin/scraping/trigger
 * Trigger immediate scraping for a specific platform - TEMPORARILY DISABLED
 */
router.post("/scraping/trigger", requireAdmin, async (req, res) => {
  res.status(400).json({
    success: false,
    error: "Scraping functionality temporarily disabled",
  });
});

module.exports = router;
