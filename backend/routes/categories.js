const express = require("express");
const router = express.Router();

// Get all categories
router.get("/", async (req, res) => {
  try {
    // Always use mock data for now to ensure the function works
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

    return res.json({
      success: true,
      data: categories,
      total: categories.length,
      message: "Using mock data (production deployment)"
    });
  } catch (error) {
    console.error("Error in categories route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch categories",
      message: error.message
    });
  }
});

// Get popular categories
router.get("/popular", async (req, res) => {
  try {
    const popularCategories = [
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
    ];

    res.json({
      success: true,
      data: popularCategories,
      total: popularCategories.length,
      message: "Popular categories retrieved successfully"
    });
  } catch (error) {
    console.error("Error in popular categories route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch popular categories",
      message: error.message
    });
  }
});

// Get category by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
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

    const category = categories.find(cat => cat.id === id || cat.slug === id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
        message: `Category with id '${id}' does not exist`
      });
    }

    res.json({
      success: true,
      data: category,
      message: "Category retrieved successfully"
    });
  } catch (error) {
    console.error("Error in category by ID route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch category",
      message: error.message
    });
  }
});

module.exports = router;
