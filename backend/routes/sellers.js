const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

const sellers = [
  {
    id: 1,
    name: "TechStore Pro",
    tagline: "Your trusted source for premium electronics and gadgets",
    description: "TechStore Pro has been serving customers since 2020 with the latest and greatest in technology. We specialize in smartphones, laptops, headphones, and other electronic devices from top brands like Apple, Samsung, Sony, and more.",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=120&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 1247,
    verified: true,
    memberSince: "2020",
    totalSales: 15420,
    totalProducts: 342,
    responseTime: "2 hours",
    location: "San Francisco, CA",
    website: "https://techstorepro.com",
    email: "support@techstorepro.com",
    phone: "+1 (555) 123-4567",
    categories: ["Electronics", "Smartphones", "Laptops", "Headphones", "Accessories"],
    badges: ["Top Seller", "Fast Shipper", "Verified Store", "Premium Partner"]
  },
  {
    id: 2,
    name: "StyleHub",
    tagline: "Leading fashion retailer offering the latest trends",
    description: "StyleHub brings you the latest trends in clothing, shoes, and accessories from around the world. We curate collections that combine style, quality, and affordability.",
    logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&h=120&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 892,
    verified: true,
    memberSince: "2019",
    totalSales: 12340,
    totalProducts: 234,
    responseTime: "4 hours",
    location: "New York, NY",
    website: "https://stylehub.com",
    email: "hello@stylehub.com",
    phone: "+1 (555) 987-6543",
    categories: ["Fashion", "Shoes", "Accessories", "Jewelry"],
    badges: ["Fashion Expert", "Trend Setter", "Verified Store"]
  },
  {
    id: 3,
    name: "Home Essentials",
    tagline: "Everything you need for your home and garden",
    description: "Home Essentials has been making homes beautiful and functional since 2021. From kitchen appliances to outdoor furniture, we provide quality products that enhance your living space.",
    logo: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120&h=120&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 567,
    verified: true,
    memberSince: "2021",
    totalSales: 8900,
    totalProducts: 156,
    responseTime: "6 hours",
    location: "Chicago, IL",
    website: "https://homeessentials.com",
    email: "info@homeessentials.com",
    phone: "+1 (555) 456-7890",
    categories: ["Home & Garden", "Kitchen", "Furniture", "Outdoor"],
    badges: ["Home Expert", "Quality Assured", "Fast Delivery"]
  },
  {
    id: 4,
    name: "Sports Central",
    tagline: "Your one-stop shop for sports and fitness equipment",
    description: "Sports Central is the premier destination for athletes and fitness enthusiasts. We offer top-quality equipment, apparel, and accessories for all sports and fitness activities.",
    logo: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=120&h=120&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=300&fit=crop",
    rating: 4.5,
    reviewCount: 445,
    verified: true,
    memberSince: "2020",
    totalSales: 6780,
    totalProducts: 98,
    responseTime: "8 hours",
    location: "Miami, FL",
    website: "https://sportscentral.com",
    email: "team@sportscentral.com",
    phone: "+1 (555) 321-0987",
    categories: ["Sports", "Fitness", "Outdoor", "Athletics"],
    badges: ["Sports Expert", "Equipment Specialist", "Verified Store"]
  }
];

// Get all sellers
router.get('/', async (req, res) => {
  try {
    const { verified, rating, location } = req.query;
    let filteredSellers = [...sellers];

    // Apply filters
    if (verified === 'true') {
      filteredSellers = filteredSellers.filter(s => s.verified);
    }

    if (rating) {
      const minRating = parseFloat(rating);
      filteredSellers = filteredSellers.filter(s => s.rating >= minRating);
    }

    if (location) {
      const locationLower = location.toLowerCase();
      filteredSellers = filteredSellers.filter(s => 
        s.location.toLowerCase().includes(locationLower)
      );
    }

    res.json({
      success: true,
      data: filteredSellers,
      total: filteredSellers.length
    });
  } catch (error) {
    logger.error('Error fetching sellers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sellers',
      code: 'SELLERS_ERROR'
    });
  }
});

// Get seller by ID
router.get('/:id', async (req, res) => {
  try {
    const sellerId = parseInt(req.params.id);
    const seller = sellers.find(s => s.id === sellerId);

    if (!seller) {
      return res.status(404).json({
        success: false,
        error: 'Seller not found',
        code: 'SELLER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: seller
    });
  } catch (error) {
    logger.error('Error fetching seller:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch seller',
      code: 'SELLER_ERROR'
    });
  }
});

// Get seller products
router.get('/:id/products', async (req, res) => {
  try {
    const sellerId = parseInt(req.params.id);
    const seller = sellers.find(s => s.id === sellerId);

    if (!seller) {
      return res.status(404).json({
        success: false,
        error: 'Seller not found',
        code: 'SELLER_NOT_FOUND'
      });
    }

    // Mock products for this seller
    const sellerProducts = [
      {
        id: 1,
        title: "iPhone 15 Pro Max",
        price: 1199.99,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop",
        category: "Electronics"
      },
      {
        id: 2,
        title: "MacBook Pro M3",
        price: 1999.99,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop",
        category: "Electronics"
      }
    ];

    res.json({
      success: true,
      data: sellerProducts,
      total: sellerProducts.length,
      seller: {
        id: seller.id,
        name: seller.name,
        rating: seller.rating
      }
    });
  } catch (error) {
    logger.error('Error fetching seller products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch seller products',
      code: 'SELLER_PRODUCTS_ERROR'
    });
  }
});

module.exports = router;
