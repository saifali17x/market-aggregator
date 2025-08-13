const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Mock product data (in real app, this would come from database)
const products = [
  {
    id: 1,
    title: "iPhone 15 Pro Max - 256GB - Natural Titanium",
    price: 1199.99,
    originalPrice: 1299.99,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    category: "electronics",
    subcategory: "smartphones",
    brand: "Apple",
    seller: "TechStore Pro",
    rating: 4.8,
    reviewCount: 1247,
    inStock: true,
    stockQuantity: 45,
    discount: 8,
    views: 15420,
    sales: 89,
    description: "Experience the future of mobile technology with the iPhone 15 Pro Max. Featuring the revolutionary A17 Pro chip, stunning 6.7-inch Super Retina XDR display, and advanced camera system with 5x optical zoom.",
    features: [
      "A17 Pro chip with 6-core GPU",
      "6.7-inch Super Retina XDR display",
      "Pro camera system with 5x optical zoom",
      "Aerospace-grade titanium design",
      "USB-C connector",
      "Action button for quick access"
    ],
    specifications: {
      "Display": "6.7-inch Super Retina XDR OLED",
      "Processor": "A17 Pro chip with 6-core GPU",
      "Storage": "256GB",
      "Camera": "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
      "Battery": "Up to 29 hours video playback",
      "Operating System": "iOS 17"
    }
  },
  {
    id: 2,
    title: "Samsung Galaxy S24 Ultra - 256GB - Titanium Gray",
    price: 1099.99,
    originalPrice: 1199.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    category: "electronics",
    subcategory: "smartphones",
    brand: "Samsung",
    seller: "Mobile World",
    rating: 4.7,
    reviewCount: 892,
    inStock: true,
    stockQuantity: 32,
    discount: 8,
    views: 12890,
    sales: 67,
    description: "The Samsung Galaxy S24 Ultra represents the pinnacle of Android smartphones, featuring the Snapdragon 8 Gen 3 processor, S Pen integration, and revolutionary AI capabilities.",
    features: [
      "Snapdragon 8 Gen 3 processor",
      "6.8-inch Dynamic AMOLED 2X display",
      "200MP main camera with 5x optical zoom",
      "S Pen integration",
      "AI-powered features",
      "5000mAh battery"
    ],
    specifications: {
      "Display": "6.8-inch Dynamic AMOLED 2X",
      "Processor": "Snapdragon 8 Gen 3",
      "Storage": "256GB",
      "Camera": "200MP Main + 12MP Ultra Wide + 50MP Telephoto",
      "Battery": "5000mAh",
      "Operating System": "Android 14 with One UI 6.1"
    }
  },
  {
    id: 3,
    title: "MacBook Pro 14 M3 Chip - 512GB SSD",
    price: 1999.99,
    originalPrice: 2199.99,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    category: "electronics",
    subcategory: "laptops",
    brand: "Apple",
    seller: "Apple Store",
    rating: 4.9,
    reviewCount: 567,
    inStock: true,
    stockQuantity: 28,
    discount: 9,
    views: 9870,
    sales: 45,
    description: "The MacBook Pro with M3 chip delivers exceptional performance for professional workflows. Experience blazing-fast speeds and incredible battery life in a portable design.",
    features: [
      "M3 chip with 8-core CPU and 10-core GPU",
      "14-inch Liquid Retina XDR display",
      "Up to 22 hours battery life",
      "8GB unified memory",
      "512GB SSD storage",
      "Backlit Magic Keyboard"
    ],
    specifications: {
      "Display": "14-inch Liquid Retina XDR",
      "Processor": "Apple M3 chip",
      "Memory": "8GB unified memory",
      "Storage": "512GB SSD",
      "Battery": "Up to 22 hours",
      "Operating System": "macOS Sonoma"
    }
  },
  {
    id: 4,
    title: "Nike Air Force 1 '07 - White/White",
    price: 89.99,
    originalPrice: 109.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "fashion",
    subcategory: "shoes",
    brand: "Nike",
    seller: "SneakerHead",
    rating: 4.6,
    reviewCount: 2341,
    inStock: true,
    stockQuantity: 156,
    discount: 18,
    views: 45670,
    sales: 234,
    description: "The Nike Air Force 1 '07 maintains the classic Air Force 1 look with a leather upper and Air-Sole unit for lightweight cushioning. The classic white colorway makes it perfect for everyday wear.",
    features: [
      "Leather upper for durability",
      "Air-Sole unit for lightweight cushioning",
      "Rubber outsole for traction",
      "Classic white colorway",
      "Perforations for breathability",
      "Foam midsole"
    ],
    specifications: {
      "Upper": "Leather",
      "Midsole": "Foam with Air-Sole unit",
      "Outsole": "Rubber",
      "Closure": "Lace-up",
      "Style": "Low-top",
      "Weight": "12.5 oz"
    }
  },
  {
    id: 5,
    title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    price: 349.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "electronics",
    subcategory: "headphones",
    brand: "Sony",
    seller: "Audio Pro",
    rating: 4.8,
    reviewCount: 1567,
    inStock: true,
    stockQuantity: 89,
    discount: 13,
    views: 23450,
    sales: 123,
    description: "Experience industry-leading noise canceling with the Sony WH-1000XM5 headphones. Featuring 30-hour battery life, exceptional sound quality, and comfortable design for all-day wear.",
    features: [
      "Industry-leading noise canceling",
      "30-hour battery life",
      "Quick Charge (3 min = 3 hours)",
      "Touch controls",
      "Speak-to-Chat technology",
      "Multipoint connection"
    ],
    specifications: {
      "Driver": "30mm dynamic",
      "Frequency Response": "4Hz-40,000Hz",
      "Battery Life": "30 hours (NC on)",
      "Weight": "250g",
      "Connectivity": "Bluetooth 5.2",
      "Codec": "LDAC, AAC, SBC"
    }
  },
  {
    id: 6,
    title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    category: "home-garden",
    subcategory: "kitchen",
    brand: "Instant Pot",
    seller: "Kitchen Essentials",
    rating: 4.7,
    reviewCount: 8923,
    inStock: true,
    stockQuantity: 234,
    discount: 20,
    views: 67890,
    sales: 456,
    description: "The Instant Pot Duo 7-in-1 is a versatile kitchen appliance that combines 7 kitchen appliances in one: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.",
    features: [
      "7-in-1 functionality",
      "1000W heating element",
      "10 safety mechanisms",
      "Easy-to-use control panel",
      "Stainless steel cooking pot",
      "Recipe book included"
    ],
    specifications: {
      "Capacity": "6 quarts",
      "Power": "1000W",
      "Material": "Stainless steel",
      "Dimensions": "13.4 x 12.2 x 12.5 inches",
      "Weight": "11.8 pounds",
      "Warranty": "1 year"
    }
  },
  {
    id: 7,
    title: "Kindle Paperwhite (8GB) - Black",
    price: 139.99,
    originalPrice: 159.99,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
    category: "books",
    subcategory: "e-readers",
    brand: "Amazon",
    seller: "Book Haven",
    rating: 4.6,
    reviewCount: 3456,
    inStock: true,
    stockQuantity: 78,
    discount: 13,
    views: 23450,
    sales: 189,
    description: "The Kindle Paperwhite features a 6.8-inch display with adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns. Perfect for avid readers who want a premium reading experience.",
    features: [
      "6.8-inch glare-free display",
      "Adjustable warm light",
      "Up to 10 weeks battery life",
      "20% faster page turns",
      "Waterproof (IPX8)",
      "8GB storage for thousands of books"
    ],
    specifications: {
      "Display": "6.8-inch 300 ppi",
      "Storage": "8GB",
      "Battery": "Up to 10 weeks",
      "Weight": "7.23 oz",
      "Dimensions": "6.9 x 4.9 x 0.32 inches",
      "Waterproof": "IPX8 rating"
    }
  },
  {
    id: 8,
    title: "Adidas Ultraboost 22 Running Shoes - Core Black",
    price: 179.99,
    originalPrice: 219.99,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop",
    category: "sports",
    subcategory: "running",
    brand: "Adidas",
    seller: "Sports Central",
    rating: 4.5,
    reviewCount: 1234,
    inStock: true,
    stockQuantity: 67,
    discount: 18,
    views: 34560,
    sales: 234,
    description: "The Adidas Ultraboost 22 features responsive Boost midsole technology and a Primeknit+ upper for a sock-like fit. Perfect for runners who want maximum energy return and comfort.",
    features: [
      "Boost midsole for energy return",
      "Primeknit+ upper for breathability",
      "Continental™ rubber outsole",
      "Linear Energy Push system",
      "Heel counter for stability",
      "Reflective details for visibility"
    ],
    specifications: {
      "Upper": "Primeknit+",
      "Midsole": "Boost",
      "Outsole": "Continental™ rubber",
      "Weight": "10.1 oz",
      "Drop": "10mm",
      "Type": "Neutral running shoe"
    }
  }
];

// Get all products with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sortBy } = req.query;
    let filteredProducts = [...products];

    // Apply filters
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'popularity':
          filteredProducts.sort((a, b) => b.views - a.views);
          break;
        default:
          // Default sorting by relevance (id)
          break;
      }
    }

    res.json({
      success: true,
      data: filteredProducts,
      total: filteredProducts.length,
      filters: { category, search, minPrice, maxPrice, sortBy }
    });
  } catch (error) {
    logger.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      code: 'PRODUCTS_ERROR'
    });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    logger.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      code: 'PRODUCT_ERROR'
    });
  }
});

module.exports = router;
