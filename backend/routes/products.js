const express = require("express");
const router = express.Router();

// Mock products data (replace with real database later)
const mockProducts = [
  // TechStore Products
  {
    id: 1,
    title: "iPhone 15 Pro",
    name: "iPhone 15 Pro",
    price: 999.99,
    originalPrice: 1099.99,
    category: "smartphones",
    sellerId: 1,
    seller: "TechStore",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop",
    description: "Latest iPhone with advanced features",
    rating: 4.8,
    reviewCount: 245,
    views: 12500,
    stock: 50,
    brand: "Apple"
  },
  {
    id: 2,
    title: "Sony WH-1000XM5 Headphones",
    name: "Sony WH-1000XM5 Headphones",
    price: 349.99,
    originalPrice: 399.99,
    category: "audio",
    sellerId: 1,
    seller: "TechStore",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    description: "Industry-leading noise canceling wireless headphones",
    rating: 4.8,
    reviewCount: 189,
    views: 8900,
    stock: 75,
    brand: "Sony"
  },
  {
    id: 3,
    title: "Samsung 65-inch 4K Smart TV",
    name: "Samsung 65-inch 4K Smart TV",
    price: 799.99,
    originalPrice: 999.99,
    category: "tv",
    sellerId: 1,
    seller: "TechStore",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
    description: "Crystal UHD 4K Smart TV with HDR",
    rating: 4.6,
    reviewCount: 156,
    views: 6750,
    stock: 20,
    brand: "Samsung"
  },
  {
    id: 4,
    title: "Dell XPS 13 Laptop",
    name: "Dell XPS 13 Laptop",
    price: 1199.99,
    originalPrice: 1399.99,
    category: "laptops",
    sellerId: 1,
    seller: "TechStore",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    description: "Ultra-portable laptop with stunning display",
    rating: 4.7,
    reviewCount: 203,
    views: 9240,
    stock: 35,
    brand: "Dell"
  },
  {
    id: 5,
    title: "Gaming Mechanical Keyboard",
    name: "Gaming Mechanical Keyboard",
    price: 129.99,
    originalPrice: 159.99,
    category: "gaming",
    sellerId: 1,
    seller: "TechStore",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
    description: "RGB backlit mechanical gaming keyboard",
    rating: 4.5,
    reviewCount: 178,
    views: 5420,
    stock: 65,
    brand: "Razer"
  },

  // AppleStore Products
  {
    id: 6,
    title: "MacBook Air M3",
    name: "MacBook Air M3",
    price: 1299.99,
    originalPrice: 1399.99,
    category: "laptops", 
    sellerId: 2,
    seller: "AppleStore",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
    description: "Powerful laptop for professionals",
    rating: 4.9,
    reviewCount: 412,
    views: 15600,
    stock: 25,
    brand: "Apple"
  },
  {
    id: 7,
    title: "iPad Pro 12.9-inch",
    name: "iPad Pro 12.9-inch",
    price: 1099.99,
    originalPrice: 1199.99,
    category: "tablets",
    sellerId: 2,
    seller: "AppleStore",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
    description: "Professional tablet with M2 chip",
    rating: 4.8,
    reviewCount: 298,
    views: 11200,
    stock: 40,
    brand: "Apple"
  },
  {
    id: 8,
    title: "AirPods Pro (3rd Gen)",
    name: "AirPods Pro (3rd Gen)",
    price: 249.99,
    originalPrice: 279.99,
    category: "audio",
    sellerId: 2,
    seller: "AppleStore",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop",
    description: "Active noise cancellation wireless earbuds",
    rating: 4.7,
    reviewCount: 567,
    views: 18900,
    stock: 85,
    brand: "Apple"
  },
  {
    id: 9,
    title: "Apple Watch Series 9",
    name: "Apple Watch Series 9",
    price: 399.99,
    originalPrice: 429.99,
    category: "wearables",
    sellerId: 2,
    seller: "AppleStore",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop",
    description: "Advanced fitness and health tracking",
    rating: 4.6,
    reviewCount: 324,
    views: 13400,
    stock: 55,
    brand: "Apple"
  },

  // ShoesWorld Products
  {
    id: 10,
    title: "Nike Air Jordan 1",
    name: "Nike Air Jordan 1",
    price: 179.99,
    originalPrice: 200.00,
    category: "footwear",
    sellerId: 3,
    seller: "ShoesWorld",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop", 
    description: "Classic basketball shoes",
    rating: 4.7,
    reviewCount: 445,
    views: 22100,
    stock: 100,
    brand: "Nike"
  },
  {
    id: 11,
    title: "Adidas Ultraboost 22",
    name: "Adidas Ultraboost 22",
    price: 149.99,
    originalPrice: 180.00,
    category: "footwear",
    sellerId: 3,
    seller: "ShoesWorld",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop",
    description: "Premium running shoes with boost technology",
    rating: 4.7,
    reviewCount: 378,
    views: 16700,
    stock: 85,
    brand: "Adidas"
  },
  {
    id: 12,
    title: "Converse Chuck Taylor All Star",
    name: "Converse Chuck Taylor All Star",
    price: 59.99,
    originalPrice: 75.00,
    category: "footwear",
    sellerId: 3,
    seller: "ShoesWorld",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
    description: "Classic canvas sneakers",
    rating: 4.4,
    reviewCount: 289,
    views: 8900,
    stock: 150,
    brand: "Converse"
  },
  {
    id: 13,
    title: "Vans Old Skool",
    name: "Vans Old Skool",
    price: 64.99,
    originalPrice: 80.00,
    category: "footwear",
    sellerId: 3,
    seller: "ShoesWorld",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop",
    description: "Iconic skate shoes with waffle outsole",
    rating: 4.5,
    reviewCount: 201,
    views: 7800,
    stock: 95,
    brand: "Vans"
  },
  {
    id: 14,
    title: "New Balance 990v5",
    name: "New Balance 990v5",
    price: 184.99,
    originalPrice: 220.00,
    category: "footwear",
    sellerId: 3,
    seller: "ShoesWorld",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop",
    description: "Premium made in USA running shoes",
    rating: 4.8,
    reviewCount: 156,
    views: 5400,
    stock: 45,
    brand: "New Balance"
  },

  // HomeGoods Products
  {
    id: 15,
    title: "Ninja Coffee Maker",
    name: "Ninja Coffee Maker",
    price: 89.99,
    originalPrice: 120.00,
    category: "appliances",
    sellerId: 4,
    seller: "HomeGoods",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    description: "Automatic coffee brewing machine",
    rating: 4.5,
    reviewCount: 234,
    views: 9800,
    stock: 30,
    brand: "Ninja"
  },
  {
    id: 16,
    title: "KitchenAid Stand Mixer",
    name: "KitchenAid Stand Mixer",
    price: 349.99,
    originalPrice: 429.99,
    category: "appliances",
    sellerId: 4,
    seller: "HomeGoods",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    description: "Professional stand mixer for baking",
    rating: 4.9,
    reviewCount: 189,
    views: 7200,
    stock: 15,
    brand: "KitchenAid"
  },
  {
    id: 17,
    title: "Dyson V15 Vacuum Cleaner",
    name: "Dyson V15 Vacuum Cleaner",
    price: 549.99,
    originalPrice: 649.99,
    category: "cleaning",
    sellerId: 4,
    seller: "HomeGoods",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
    description: "Cordless stick vacuum with laser detection",
    rating: 4.7,
    reviewCount: 145,
    views: 6100,
    stock: 25,
    brand: "Dyson"
  },
  {
    id: 18,
    title: "Le Creuset Dutch Oven",
    name: "Le Creuset Dutch Oven",
    price: 279.99,
    originalPrice: 350.00,
    category: "cookware",
    sellerId: 4,
    seller: "HomeGoods",
    image: "https://images.unsplash.com/photo-1556909114-54c7b7fd8636?w=400&h=300&fit=crop",
    description: "Cast iron Dutch oven for slow cooking",
    rating: 4.8,
    reviewCount: 98,
    views: 4200,
    stock: 20,
    brand: "Le Creuset"
  },

  // PhotoPro Products
  {
    id: 19,
    title: "Canon EOS R6 Camera",
    name: "Canon EOS R6 Camera",
    price: 2499.99,
    originalPrice: 2699.99,
    category: "cameras",
    sellerId: 5,
    seller: "PhotoPro",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
    description: "Professional mirrorless camera with 4K video",
    rating: 4.9,
    reviewCount: 87,
    views: 3200,
    stock: 15,
    brand: "Canon"
  },
  {
    id: 20,
    title: "Sony Alpha A7 IV",
    name: "Sony Alpha A7 IV",
    price: 2299.99,
    originalPrice: 2499.99,
    category: "cameras",
    sellerId: 5,
    seller: "PhotoPro",
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
    description: "Full-frame mirrorless camera with 33MP sensor",
    rating: 4.8,
    reviewCount: 76,
    views: 2800,
    stock: 12,
    brand: "Sony"
  },
  {
    id: 21,
    title: "Nikon D850 DSLR",
    name: "Nikon D850 DSLR",
    price: 1999.99,
    originalPrice: 2299.99,
    category: "cameras",
    sellerId: 5,
    seller: "PhotoPro",
    image: "https://images.unsplash.com/photo-1606983287719-04cb5d22006c?w=400&h=300&fit=crop",
    description: "Professional DSLR with 45.7MP sensor",
    rating: 4.7,
    reviewCount: 54,
    views: 2100,
    stock: 8,
    brand: "Nikon"
  },
  {
    id: 22,
    title: "Canon 70-200mm f/2.8L Lens",
    name: "Canon 70-200mm f/2.8L Lens",
    price: 1899.99,
    originalPrice: 2099.99,
    category: "cameras",
    sellerId: 5,
    seller: "PhotoPro",
    image: "https://images.unsplash.com/photo-1606983340200-7990c7cddc7b?w=400&h=300&fit=crop",
    description: "Professional telephoto zoom lens",
    rating: 4.9,
    reviewCount: 43,
    views: 1800,
    stock: 6,
    brand: "Canon"
  },
  {
    id: 23,
    title: "Manfrotto Carbon Fiber Tripod",
    name: "Manfrotto Carbon Fiber Tripod",
    price: 399.99,
    originalPrice: 499.99,
    category: "cameras",
    sellerId: 5,
    seller: "PhotoPro",
    image: "https://images.unsplash.com/photo-1606983287851-4c74e2a6dd2b?w=400&h=300&fit=crop",
    description: "Lightweight carbon fiber tripod for professionals",
    rating: 4.6,
    reviewCount: 67,
    views: 2400,
    stock: 18,
    brand: "Manfrotto"
  },
  {
    id: 24,
    title: "Godox AD600Pro Flash",
    name: "Godox AD600Pro Flash",
    price: 849.99,
    originalPrice: 999.99,
    category: "cameras",
    sellerId: 5,
    seller: "PhotoPro",
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
    description: "Professional studio flash with TTL",
    rating: 4.7,
    reviewCount: 29,
    views: 1200,
    stock: 10,
    brand: "Godox"
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
        p.title.toLowerCase().includes(search.toLowerCase()) ||
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
module.exports.mockProducts = mockProducts;