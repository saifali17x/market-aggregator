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
    description: "Your trusted electronics retailer with cutting-edge technology",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    banner: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=300&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=300&fit=crop",
    verified: true,
    joinedDate: "2020-01-15",
    totalSales: 2500000,
    reviewCount: 1250,
    responseTime: "< 1 hour",
    website: "https://techstore.example.com"
  },
  {
    id: 2,
    name: "AppleStore", 
    rating: 4.9,
    products: 85,
    location: "Cupertino, CA",
    description: "Official Apple products and accessories",
    image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&h=300&fit=crop",
    banner: "https://images.unsplash.com/photo-1441148345475-384df04cb3b9?w=800&h=300&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1441148345475-384df04cb3b9?w=800&h=300&fit=crop",
    verified: true,
    joinedDate: "2019-03-10",
    totalSales: 5800000,
    reviewCount: 2890,
    responseTime: "< 30 mins",
    website: "https://apple.com"
  },
  {
    id: 3,
    name: "ShoesWorld",
    rating: 4.7,
    products: 200,
    location: "Chicago, IL", 
    description: "Premium footwear collection from top brands",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=300&fit=crop",
    banner: "https://images.unsplash.com/photo-1448906654166-444d494666b3?w=800&h=300&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1448906654166-444d494666b3?w=800&h=300&fit=crop",
    verified: true,
    joinedDate: "2021-06-20",
    totalSales: 1800000,
    reviewCount: 920,
    responseTime: "< 2 hours",
    website: "https://shoesworld.example.com"
  },
  {
    id: 4,
    name: "HomeGoods",
    rating: 4.5,
    products: 75,
    location: "Austin, TX",
    description: "Everything for your home - furniture, decor, and appliances",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    banner: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=300&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=300&fit=crop",
    verified: false,
    joinedDate: "2022-11-05",
    totalSales: 650000,
    reviewCount: 245,
    responseTime: "< 4 hours",
    website: "https://homegoods.example.com"
  },
  {
    id: 5,
    name: "PhotoPro",
    rating: 4.9,
    products: 120,
    location: "Los Angeles, CA",
    description: "Professional photography equipment and accessories",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop",
    banner: "https://images.unsplash.com/photo-1481447882025-9cfc34fc3829?w=800&h=300&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1481447882025-9cfc34fc3829?w=800&h=300&fit=crop",
    verified: true,
    joinedDate: "2020-08-12",
    totalSales: 1200000,
    reviewCount: 680,
    responseTime: "< 1 hour",
    website: "https://photopro.example.com"
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