const express = require("express");
const router = express.Router();

// Mock products data (replace with real database later)
const mockProducts = [
  {
    id: 1,
    title: "iPhone 15 Pro",
    name: "iPhone 15 Pro",
    price: 999.99,
    originalPrice: 1099.99,
    category: "smartphones",
    seller: "TechStore",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop",
    description: "Latest iPhone with advanced features",
    rating: 4.8,
    stock: 50,
    brand: "Apple"
  },
  {
    id: 2,
    title: "MacBook Air M3",
    name: "MacBook Air M3",
    price: 1299.99,
    originalPrice: 1399.99,
    category: "laptops", 
    seller: "AppleStore",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
    description: "Powerful laptop for professionals",
    rating: 4.9,
    stock: 25,
    brand: "Apple"
  },
  {
    id: 3,
    title: "Nike Air Jordan 1",
    name: "Nike Air Jordan 1",
    price: 179.99,
    originalPrice: 200.00,
    category: "footwear",
    seller: "ShoesWorld",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop", 
    description: "Classic basketball shoes",
    rating: 4.7,
    stock: 100,
    brand: "Nike"
  },
  {
    id: 4,
    title: "Ninja Coffee Maker",
    name: "Ninja Coffee Maker",
    price: 89.99,
    originalPrice: 120.00,
    category: "cleaning",
    seller: "HomeGoods",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    description: "Automatic coffee brewing machine",
    rating: 4.5,
    stock: 30,
    brand: "Ninja"
  },
  {
    id: 5,
    title: "Sony WH-1000XM5 Headphones",
    name: "Sony WH-1000XM5 Headphones",
    price: 349.99,
    originalPrice: 399.99,
    category: "audio",
    seller: "TechStore",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    description: "Industry-leading noise canceling wireless headphones",
    rating: 4.8,
    stock: 75,
    brand: "Sony"
  },
  {
    id: 6,
    title: "Samsung 65-inch 4K Smart TV",
    name: "Samsung 65-inch 4K Smart TV",
    price: 799.99,
    originalPrice: 999.99,
    category: "tv",
    seller: "TechStore",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
    description: "Crystal UHD 4K Smart TV with HDR",
    rating: 4.6,
    stock: 20,
    brand: "Samsung"
  },
  {
    id: 7,
    title: "Canon EOS R6 Camera",
    name: "Canon EOS R6 Camera",
    price: 2499.99,
    originalPrice: 2699.99,
    category: "cameras",
    seller: "PhotoPro",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
    description: "Professional mirrorless camera with 4K video",
    rating: 4.9,
    stock: 15,
    brand: "Canon"
  },
  {
    id: 8,
    title: "Adidas Ultraboost 22",
    name: "Adidas Ultraboost 22",
    price: 149.99,
    originalPrice: 180.00,
    category: "footwear",
    seller: "ShoesWorld",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop",
    description: "Premium running shoes with boost technology",
    rating: 4.7,
    stock: 85,
    brand: "Adidas"
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