const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");

const categories = [
  {
    id: "electronics",
    slug: "electronics",
    name: "Electronics",
    icon: "📱",
    count: 6,
    color: "bg-gradient-to-r from-blue-600 to-indigo-700",
  },
  {
    id: "fashion",
    slug: "fashion",
    name: "Fashion",
    icon: "👗",
    count: 4,
    color: "bg-gradient-to-r from-pink-500 to-rose-600",
  },
  {
    id: "home-garden",
    slug: "home-garden",
    name: "Home & Garden",
    icon: "🏠",
    count: 3,
    color: "bg-gradient-to-r from-emerald-500 to-teal-600",
  },
  {
    id: "sports",
    slug: "sports",
    name: "Sports",
    icon: "⚽",
    count: 2,
    color: "bg-gradient-to-r from-amber-500 to-orange-600",
  },
  {
    id: "books",
    slug: "books",
    name: "Books",
    icon: "📚",
    count: 2,
    color: "bg-gradient-to-r from-violet-500 to-purple-600",
  },
  {
    id: "automotive",
    slug: "automotive",
    name: "Automotive",
    icon: "🚗",
    count: 2,
    color: "bg-gradient-to-r from-red-500 to-pink-600",
  },
];

// Get all categories
router.get("/", async (req, res) => {
  try {
    // Import products to calculate actual counts
    const { products } = require("./products");

    // Calculate actual product counts from products data
    const categoriesWithCounts = categories.map((cat) => {
      let count = 0;

      products.forEach((product) => {
        // Check if product belongs to main category
        if (product.category === cat.slug) {
          count++;
        }
        // Check if product belongs to subcategory
        else if (product.subcategory === cat.slug) {
          count++;
        }
      });

      return {
        ...cat,
        count: count,
      };
    });

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
