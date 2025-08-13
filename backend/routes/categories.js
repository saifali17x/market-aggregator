const express = require("express");
const { Category } = require("../models");
const router = express.Router();

// GET /api/categories - Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      attributes: ["id", "name", "slug", "description"],
      order: [["name", "ASC"]],
    });

    res.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// GET /api/categories/:slug - Get category by slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({
      where: { slug, isActive: true },
      attributes: ["id", "name", "slug", "description"],
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

module.exports = router;
