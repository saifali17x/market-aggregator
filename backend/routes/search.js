const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Mock products data for search
const products = [
  {
    id: 1,
    title: "iPhone 15 Pro Max - 256GB - Natural Titanium",
    price: 1199.99,
    category: "electronics",
    brand: "Apple",
    seller: "TechStore Pro",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop"
  },
  {
    id: 2,
    title: "Samsung Galaxy S24 Ultra - 256GB - Titanium Gray",
    price: 1099.99,
    category: "electronics",
    brand: "Samsung",
    seller: "Mobile World",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop"
  },
  {
    id: 3,
    title: "MacBook Pro 14 M3 Chip - 512GB SSD",
    price: 1999.99,
    category: "electronics",
    brand: "Apple",
    seller: "Apple Store",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop"
  },
  {
    id: 4,
    title: "Nike Air Force 1 '07 - White/White",
    price: 89.99,
    category: "fashion",
    brand: "Nike",
    seller: "SneakerHead",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop"
  },
  {
    id: 5,
    title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    price: 349.99,
    category: "electronics",
    brand: "Sony",
    seller: "Audio Pro",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"
  },
  {
    id: 6,
    title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    price: 79.99,
    category: "home-garden",
    brand: "Instant Pot",
    seller: "Kitchen Essentials",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop"
  },
  {
    id: 7,
    title: "Kindle Paperwhite (8GB) - Black",
    price: 139.99,
    category: "books",
    brand: "Amazon",
    seller: "Book Haven",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop"
  },
  {
    id: 8,
    title: "Adidas Ultraboost 22 Running Shoes - Core Black",
    price: 179.99,
    category: "sports",
    brand: "Adidas",
    seller: "Sports Central",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200&h=200&fit=crop"
  }
];

// Search products
router.get('/', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sortBy } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
        code: 'SEARCH_QUERY_REQUIRED'
      });
    }

    let results = [...products];

    // Apply search query
    const searchQuery = q.toLowerCase();
    results = results.filter(product => 
      product.title.toLowerCase().includes(searchQuery) ||
      product.brand.toLowerCase().includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery) ||
      product.seller.toLowerCase().includes(searchQuery)
    );

    // Apply category filter
    if (category && category !== 'all') {
      results = results.filter(product => product.category === category);
    }

    // Apply price filters
    if (minPrice) {
      results = results.filter(product => product.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      results = results.filter(product => product.price <= parseFloat(maxPrice));
    }

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case 'price-low':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'relevance':
        default:
          // Keep original order for relevance
          break;
      }
    }

    res.json({
      success: true,
      data: results,
      total: results.length,
      query: q,
      filters: { category, minPrice, maxPrice, sortBy }
    });

  } catch (error) {
    logger.error('Error performing search:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      code: 'SEARCH_ERROR'
    });
  }
});

// Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: [],
        total: 0
      });
    }

    const query = q.toLowerCase();
    const suggestions = [];

    // Get product title suggestions
    products.forEach(product => {
      if (product.title.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'product',
          text: product.title,
          id: product.id,
          category: product.category
        });
      }
    });

    // Get brand suggestions
    const brands = [...new Set(products.map(p => p.brand))];
    brands.forEach(brand => {
      if (brand.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'brand',
          text: brand,
          category: 'brand'
        });
      }
    });

    // Get category suggestions
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(category => {
      if (category.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'category',
          text: category.charAt(0).toUpperCase() + category.slice(1),
          category: 'category'
        });
      }
    });

    // Remove duplicates and limit results
    const uniqueSuggestions = suggestions
      .filter((suggestion, index, self) => 
        index === self.findIndex(s => s.text === suggestion.text)
      )
      .slice(0, 8);

    res.json({
      success: true,
      data: uniqueSuggestions,
      total: uniqueSuggestions.length
    });

  } catch (error) {
    logger.error('Error getting search suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get suggestions',
      code: 'SUGGESTIONS_ERROR'
    });
  }
});

module.exports = router;
