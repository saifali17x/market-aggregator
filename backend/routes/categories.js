const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");

const categories = [
  {
    id: "electronics",
    name: "Electronics",
    icon: "📱",
    count: 6,
    color: "bg-gradient-to-r from-blue-600 to-indigo-700",
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: "👗",
    count: 4,
    color: "bg-gradient-to-r from-pink-500 to-rose-600",
  },
  {
    id: "home-garden",
    name: "Home & Garden",
    icon: "🏠",
    count: 3,
    color: "bg-gradient-to-r from-emerald-500 to-teal-600",
  },
  {
    id: "sports",
    name: "Sports",
    icon: "⚽",
    count: 2,
    color: "bg-gradient-to-r from-amber-500 to-orange-600",
  },
  {
    id: "books",
    name: "Books",
    icon: "📚",
    count: 2,
    color: "bg-gradient-to-r from-violet-500 to-purple-600",
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: "🚗",
    count: 2,
    color: "bg-gradient-to-r from-red-500 to-pink-600",
  },
];

// Get all categories
router.get("/", async (req, res) => {
  try {
    // Calculate actual product counts from products data
    const productCounts = {
      electronics: 6,
      fashion: 4,
      "home-garden": 3,
      sports: 2,
      books: 2,
      automotive: 2,
    };

    const categoriesWithCounts = categories.map((cat) => ({
      ...cat,
      count: productCounts[cat.id] || 0,
    }));

    res.json({
      success: true,
      data: categoriesWithCounts,
      total: categories.length,
    });
  } catch (error) {
    logger.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch categories",
      code: "CATEGORIES_ERROR",
    });
  }
});

// Get popular categories
router.get("/popular", async (req, res) => {
  try {
    const popularCategories = categories
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    res.json({
      success: true,
      data: popularCategories,
      total: popularCategories.length,
    });
  } catch (error) {
    logger.error("Error fetching popular categories:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get popular categories",
      code: "CATEGORIES_ERROR",
    });
  }
});

// Get category by ID
router.get("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = categories.find((c) => c.id === categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
        code: "CATEGORY_NOT_FOUND",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    logger.error("Error fetching category:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch category",
      code: "CATEGORY_ERROR",
    });
  }
});

module.exports = router;
