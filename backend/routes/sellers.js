const express = require("express");
const router = express.Router();

// Mock sellers data (replace with real database later)
const mockSellers = [
  {
    id: 1,
    name: "TechStore",
    rating: 4.8,
    products: 150,
    location: "New York, NY",
    description: "Your trusted electronics retailer",
    image: "/images/techstore.jpg",
    verified: true,
    joinedDate: "2020-01-15"
  },
  {
    id: 2,
    name: "AppleStore", 
    rating: 4.9,
    products: 85,
    location: "Cupertino, CA",
    description: "Official Apple products and accessories",
    image: "/images/applestore.jpg",
    verified: true,
    joinedDate: "2019-03-10"
  },
  {
    id: 3,
    name: "ShoesWorld",
    rating: 4.7,
    products: 200,
    location: "Chicago, IL", 
    description: "Premium footwear collection",
    image: "/images/shoesworld.jpg",
    verified: true,
    joinedDate: "2021-06-20"
  },
  {
    id: 4,
    name: "HomeGoods",
    rating: 4.5,
    products: 75,
    location: "Austin, TX",
    description: "Everything for your home",
    image: "/images/homegoods.jpg",
    verified: false,
    joinedDate: "2022-11-05"
  }
];

// Get all sellers
router.get("/", (req, res) => {
  try {
    let sellers = [...mockSellers];
    
    // Apply filters if provided
    const { verified, minRating, search } = req.query;
    
    if (verified !== undefined) {
      sellers = sellers.filter(s => s.verified === (verified === 'true'));
    }
    
    if (minRating) {
      sellers = sellers.filter(s => s.rating >= parseFloat(minRating));
    }
    
    if (search) {
      sellers = sellers.filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      data: sellers,
      total: sellers.length,
      message: "Sellers retrieved successfully"
    });
  } catch (error) {
    console.error("Error in sellers route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch sellers",
      message: error.message
    });
  }
});

// Get single seller by ID
router.get("/:id", (req, res) => {
  try {
    const sellerId = parseInt(req.params.id);
    const seller = mockSellers.find(s => s.id === sellerId);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        error: "Seller not found",
        message: `Seller with ID ${sellerId} does not exist`
      });
    }
    
    res.json({
      success: true,
      data: seller,
      message: "Seller retrieved successfully"
    });
  } catch (error) {
    console.error("Error in seller by ID route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch seller",
      message: error.message
    });
  }
});

// Get products by seller ID
router.get("/:id/products", (req, res) => {
  try {
    const sellerId = parseInt(req.params.id);
    const seller = mockSellers.find(s => s.id === sellerId);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        error: "Seller not found",
        message: `Seller with ID ${sellerId} does not exist`
      });
    }
    
    // Mock products for this seller (you can import from products.js later)
    const sellerProducts = [
      {
        id: 1,
        name: "Sample Product 1",
        price: 99.99,
        category: "electronics",
        seller: seller.name,
        image: "/images/product1.jpg"
      },
      {
        id: 2, 
        name: "Sample Product 2",
        price: 149.99,
        category: "electronics",
        seller: seller.name,
        image: "/images/product2.jpg"
      }
    ];
    
    res.json({
      success: true,
      data: sellerProducts,
      total: sellerProducts.length,
      message: "Seller products retrieved successfully"
    });
  } catch (error) {
    console.error("Error in seller products route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch seller products",
      message: error.message
    });
  }
});

module.exports = router;