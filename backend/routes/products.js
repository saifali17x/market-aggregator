const express = require("express");
const router = express.Router();

// Mock products data (replace with real database later)
const mockProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 999.99,
    category: "electronics",
    seller: "TechStore",
    image: "/images/iphone.jpg",
    description: "Latest iPhone with advanced features",
    rating: 4.8,
    stock: 50
  },
  {
    id: 2,
    name: "MacBook Air M3",
    price: 1299.99,
    category: "electronics", 
    seller: "AppleStore",
    image: "/images/macbook.jpg",
    description: "Powerful laptop for professionals",
    rating: 4.9,
    stock: 25
  },
  {
    id: 3,
    name: "Nike Air Jordan",
    price: 179.99,
    category: "fashion",
    seller: "ShoesWorld",
    image: "/images/shoes.jpg", 
    description: "Classic basketball shoes",
    rating: 4.7,
    stock: 100
  },
  {
    id: 4,
    name: "Coffee Maker",
    price: 89.99,
    category: "home-garden",
    seller: "HomeGoods",
    image: "/images/coffee.jpg",
    description: "Automatic coffee brewing machine",
    rating: 4.5,
    stock: 30
  }
];

// Get all products with optional filtering
router.get("/", (req, res) => {
  try {
    let products = [...mockProducts];
    
    // Apply filters if provided
    const { category, seller, minPrice, maxPrice, search } = req.query;
    
    if (category) {
      products = products.filter(p => p.category === category);
    }
    
    if (seller) {
      products = products.filter(p => p.seller.toLowerCase().includes(seller.toLowerCase()));
    }
    
    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    if (search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      data: products,
      total: products.length,
      message: "Products retrieved successfully"
    });
  } catch (error) {
    console.error("Error in products route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch products",
      message: error.message
    });
  }
});

// Get single product by ID
router.get("/:id", (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = mockProducts.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
        message: `Product with ID ${productId} does not exist`
      });
    }
    
    res.json({
      success: true,
      data: product,
      message: "Product retrieved successfully"
    });
  } catch (error) {
    console.error("Error in product by ID route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch product",
      message: error.message
    });
  }
});

module.exports = router;