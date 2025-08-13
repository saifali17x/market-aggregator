const express = require("express");
const { body, query, validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { Seller, Listing } = require("../models");
const { requireAdmin } = require("../middleware/auth");
const { Op, sequelize } = require("sequelize");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/proof-images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "proof-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Email notification stub
async function sendClaimNotificationEmail(
  email,
  claimType,
  listingId,
  sellerId
) {
  try {
    // This is a stub - in production, you would integrate with a real email service
    console.log(`📧 Email notification sent to ${email}`);
    console.log(`   Claim Type: ${claimType}`);
    console.log(`   Listing ID: ${listingId}`);
    console.log(`   Seller ID: ${sellerId}`);
    console.log(`   Subject: Your listing claim has been submitted`);
    console.log(
      `   Body: We've received your claim and will review it within 24-48 hours.`
    );

    // In production, you would use a service like:
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP
    // - Mailgun

    return true;
  } catch (error) {
    console.error("Error sending email notification:", error);
    return false;
  }
}

// POST /api/sellers/claim - Submit seller claim
router.post("/claim", upload.single("proofImage"), async (req, res) => {
  try {
    const {
      sellerName,
      contactEmail,
      contactPhone,
      businessName,
      address,
      city,
      state,
      country,
      listingId,
      listingTitle,
      listingDescription,
      listingPrice,
      listingCurrency,
      listingCondition,
      termsAccepted,
    } = req.body;

    // Validate required fields
    if (
      !sellerName ||
      !contactEmail ||
      !contactPhone ||
      !address ||
      !city ||
      !state ||
      !country
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required seller information",
      });
    }

    if (!listingTitle || !listingDescription || !listingPrice) {
      return res.status(400).json({
        success: false,
        error: "Missing required listing information",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Proof image is required",
      });
    }

    if (termsAccepted !== "true") {
      return res.status(400).json({
        success: false,
        error: "Terms and conditions must be accepted",
      });
    }

    // Check if seller already exists
    let seller = await Seller.findOne({
      where: { email: contactEmail },
    });

    if (!seller) {
      // Create new seller
      seller = await Seller.create({
        name: sellerName,
        email: contactEmail,
        phone: contactPhone,
        businessName: businessName || null,
        address: address,
        city: city,
        state: state,
        country: country,
        verified: false,
        status: "pending",
      });
    }

    // Handle existing listing claim
    if (listingId && listingId.trim()) {
      const existingListing = await Listing.findByPk(listingId);

      if (!existingListing) {
        return res.status(404).json({
          success: false,
          error: "Listing not found",
        });
      }

      // Check if listing is already claimed
      if (existingListing.sellerId && existingListing.sellerId !== seller.id) {
        return res.status(400).json({
          success: false,
          error: "This listing is already claimed by another seller",
        });
      }

      // Update existing listing
      await existingListing.update({
        sellerId: seller.id,
        availabilityStatus: "pending_verification",
        status: "claimed",
        claimedAt: new Date(),
        claimProofImage: req.file.filename,
      });

      // Send email notification for existing listing claim
      await sendClaimNotificationEmail(
        contactEmail,
        "existing",
        existingListing.id,
        seller.id
      );

      return res.json({
        success: true,
        message: "Listing claim submitted successfully",
        claimId: uuidv4(),
        type: "existing_listing",
        listingId: existingListing.id,
        sellerId: seller.id,
      });
    }

    // Create new listing for new seller
    const newListing = await Listing.create({
      title: listingTitle,
      description: listingDescription,
      price: parseFloat(listingPrice),
      currency: listingCurrency || "USD",
      condition: listingCondition || "new",
      availabilityStatus: "pending_verification",
      status: "new_claim",
      sellerId: seller.id,
      claimProofImage: req.file.filename,
      claimedAt: new Date(),
      source: "seller_claim",
    });

    // Send email notification for new listing claim
    await sendClaimNotificationEmail(
      contactEmail,
      "new",
      newListing.id,
      seller.id
    );

    res.status(201).json({
      success: true,
      message: "New listing claim submitted successfully",
      claimId: uuidv4(),
      type: "new_listing",
      listingId: newListing.id,
      sellerId: seller.id,
    });
  } catch (error) {
    console.error("Error processing seller claim:", error);

    // Clean up uploaded file if there was an error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting uploaded file:", unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      error: "Failed to process seller claim",
    });
  }
});

// GET /api/sellers - Get all sellers with filtering and pagination
router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("search").optional().isString().trim(),
    query("verified")
      .optional()
      .isBoolean()
      .withMessage("Verified must be a boolean"),
    query("sortBy")
      .optional()
      .isIn(["name", "rating", "totalRatings", "createdAt"]),
    query("sortOrder").optional().isIn(["asc", "desc"]),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        page = 1,
        limit = 20,
        search,
        verified,
        sortBy = "name",
        sortOrder = "asc",
      } = req.query;

      const offset = (page - 1) * limit;

      // Build where clause
      const whereClause = {};

      if (search) {
        whereClause.name = { [Op.iLike]: `%${search}%` };
      }

      if (verified !== undefined) {
        whereClause.isVerified = verified;
      }

      // Build order clause
      const orderClause = [[sortBy === "totalReviews" ? "totalRatings" : sortBy, sortOrder.toUpperCase()]];

      const { count, rows: sellers } = await Seller.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Listing,
            as: "listings",
            attributes: ["id", "title", "availabilityStatus"],
          },
        ],
        order: orderClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: sellers,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit),
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      console.error("Error fetching sellers:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

// GET /api/sellers/:id - Get specific seller
router.get("/:id", async (req, res) => {
  try {
    const seller = await Seller.findByPk(req.params.id, {
              include: [
          {
            model: Listing,
            as: "listings",
            attributes: [
              "id",
              "title",
              "price",
              "availabilityStatus",
              "createdAt",
            ],
          },
        ],
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        error: "Seller not found",
      });
    }

    res.json({
      success: true,
      data: seller,
    });
  } catch (error) {
    console.error("Error fetching seller:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch seller",
    });
  }
});

// POST /api/sellers - Create a new seller (admin only)
router.post(
  "/",
  requireAdmin,
  [
    body("name")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Name is required and must be between 1 and 100 characters"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").optional().isString().trim(),
    body("businessName").optional().isString().trim(),
    body("address").optional().isString().trim(),
    body("city").optional().isString().trim(),
    body("state").optional().isString().trim(),
    body("country").optional().isString().trim(),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const sellerData = req.body;

      // Create seller
      const seller = await Seller.create(sellerData);

      res.status(201).json({
        success: true,
        data: seller,
      });
    } catch (error) {
      console.error("Error creating seller:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

// PUT /api/sellers/:id - Update seller (admin only)
router.put(
  "/:id",
  requireAdmin,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Name must be between 1 and 100 characters"),
    body("email").optional().isEmail().withMessage("Valid email is required"),
    body("phone").optional().isString().trim(),
    body("businessName").optional().isString().trim(),
    body("address").optional().isString().trim(),
    body("city").optional().isString().trim(),
    body("state").optional().isString().trim(),
    body("country").optional().isString().trim(),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const updateData = req.body;

      const seller = await Seller.findByPk(id);
      if (!seller) {
        return res.status(404).json({
          success: false,
          error: "Seller not found",
        });
      }

      // Update seller
      await seller.update(updateData);

      res.json({
        success: true,
        data: seller,
      });
    } catch (error) {
      console.error("Error updating seller:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

// DELETE /api/sellers/:id - Delete seller (admin only)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const seller = await Seller.findByPk(id);
    if (!seller) {
      return res.status(404).json({
        success: false,
        error: "Seller not found",
      });
    }

    // Check if seller has active listings
    const activeListings = await Listing.count({
      where: { sellerId: id, availabilityStatus: "available" },
    });

    if (activeListings > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete seller with active listings",
      });
    }

    await seller.destroy();

    res.json({
      success: true,
      message: "Seller deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting seller:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/**
 * PUT /api/sellers/:id/verify
 * Toggle seller verification status (Admin only)
 */
router.put("/:id/verify", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;
    
    if (typeof verified !== 'boolean') {
      return res.status(400).json({ 
        success: false,
        error: "Verified field must be a boolean" 
      });
    }
    
    const seller = await Seller.findByPk(id);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        error: "Seller not found"
      });
    }
    
    await seller.update({ is_verified: verified });
    
    res.json({
      success: true,
      message: `Seller ${verified ? 'verified' : 'unverified'} successfully`,
      data: seller
    });
  } catch (error) {
    console.error("Error updating seller verification:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update seller verification"
    });
  }
});

module.exports = router;
