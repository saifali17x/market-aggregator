const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

const categories = [
  { id: "electronics", name: "Electronics", icon: "📱", count: 342, color: "bg-indigo-500" },
  { id: "fashion", name: "Fashion", icon: "👗", count: 289, color: "bg-pink-500" },
  { id: "home-garden", name: "Home & Garden", icon: "🏠", count: 156, color: "bg-emerald-500" },
  { id: "sports", name: "Sports", icon: "⚽", count: 98, color: "bg-amber-500" },
  { id: "books", name: "Books", icon: "📚", count: 234, color: "bg-violet-500" },
  { id: "automotive", name: "Automotive", icon: "🚗", count: 67, color: "bg-rose-500" }
];

// Get all categories
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      data: categories,
      total: categories.length
    });
  } catch (error) {
    logger.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      code: 'CATEGORIES_ERROR'
    });
  }
});

// Get popular categories
router.get('/popular', async (req, res) => {
  try {
    const popularCategories = categories
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    res.json({
      success: true,
      data: popularCategories,
      total: popularCategories.length
    });
  } catch (error) {
    logger.error('Error fetching popular categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get popular categories',
      code: 'CATEGORIES_ERROR'
    });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = categories.find(c => c.id === categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
        code: 'CATEGORY_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    logger.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category',
      code: 'CATEGORY_ERROR'
    });
  }
});

module.exports = router;
