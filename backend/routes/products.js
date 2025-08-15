const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");

// Comprehensive product database with products for all categories
const products = [
  // ===== ELECTRONICS CATEGORY =====
  {
    id: 1,
    title: "iPhone 15 Pro Max - 256GB - Natural Titanium",
    price: 1199.99,
    originalPrice: 1299.99,
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
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
    description:
      "Experience the future of mobile technology with the iPhone 15 Pro Max. Featuring the revolutionary A17 Pro chip, stunning 6.7-inch Super Retina XDR display, and advanced camera system with 5x optical zoom.",
    features: [
      "A17 Pro chip with 6-core GPU",
      "6.7-inch Super Retina XDR display",
      "Pro camera system with 5x optical zoom",
      "Aerospace-grade titanium design",
      "USB-C connector",
      "Action button for quick access",
    ],
    specifications: {
      Display: "6.7-inch Super Retina XDR OLED",
      Processor: "A17 Pro chip with 6-core GPU",
      Storage: "256GB",
      Camera: "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
      Battery: "Up to 29 hours video playback",
      "Operating System": "iOS 17",
    },
  },
  {
    id: 2,
    title: "Samsung Galaxy S24 Ultra - 256GB - Titanium Gray",
    price: 1099.99,
    originalPrice: 1199.99,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
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
    description:
      "The Samsung Galaxy S24 Ultra represents the pinnacle of Android smartphones, featuring the Snapdragon 8 Gen 3 processor, S Pen integration, and revolutionary AI capabilities.",
    features: [
      "Snapdragon 8 Gen 3 processor",
      "6.8-inch Dynamic AMOLED 2X display",
      "200MP main camera with 5x optical zoom",
      "S Pen integration",
      "AI-powered features",
      "5000mAh battery",
    ],
    specifications: {
      Display: "6.8-inch Dynamic AMOLED 2X",
      Processor: "Snapdragon 8 Gen 3",
      Storage: "256GB",
      Camera: "200MP Main + 12MP Ultra Wide + 50MP Telephoto",
      Battery: "5000mAh",
      "Operating System": "Android 14 with One UI 6.1",
    },
  },
  {
    id: 3,
    title: "MacBook Pro 14 M3 Chip - 512GB SSD",
    price: 1999.99,
    originalPrice: 2199.99,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
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
    description:
      "The MacBook Pro with M3 chip delivers exceptional performance for professional workflows. Experience blazing-fast speeds and incredible battery life in a portable design.",
    features: [
      "M3 chip with 8-core CPU and 10-core GPU",
      "14-inch Liquid Retina XDR display",
      "Up to 22 hours battery life",
      "8GB unified memory",
      "512GB SSD storage",
      "Thunderbolt 4 ports",
    ],
    specifications: {
      Display: "14-inch Liquid Retina XDR",
      Processor: "M3 chip with 8-core CPU",
      Memory: "8GB unified memory",
      Storage: "512GB SSD",
      Battery: "Up to 22 hours",
      "Operating System": "macOS Sonoma",
    },
  },
  {
    id: 4,
    title: "Dell XPS 13 Plus - Intel i7 - 16GB RAM",
    price: 1499.99,
    originalPrice: 1699.99,
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
    category: "electronics",
    subcategory: "laptops",
    brand: "Dell",
    seller: "TechStore Pro",
    rating: 4.6,
    reviewCount: 423,
    inStock: true,
    stockQuantity: 19,
    discount: 12,
    views: 7650,
    sales: 38,
    description:
      "The Dell XPS 13 Plus combines stunning design with powerful performance. Features an edge-to-edge display, premium build quality, and the latest Intel processors.",
    features: [
      "13th Gen Intel Core i7 processor",
      "13.4-inch 4K OLED display",
      "16GB LPDDR5 RAM",
      "512GB PCIe SSD",
      "Intel Iris Xe graphics",
      "Thunderbolt 4 ports",
    ],
    specifications: {
      Display: "13.4-inch 4K OLED",
      Processor: "Intel Core i7-1355U",
      Memory: "16GB LPDDR5",
      Storage: "512GB PCIe SSD",
      Graphics: "Intel Iris Xe",
      "Operating System": "Windows 11 Pro",
    },
  },
  {
    id: 5,
    title: "Sony WH-1000XM5 Wireless Headphones",
    price: 349.99,
    originalPrice: 399.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "electronics",
    subcategory: "audio",
    brand: "Sony",
    seller: "Audio Haven",
    rating: 4.8,
    reviewCount: 2156,
    inStock: true,
    stockQuantity: 67,
    discount: 13,
    views: 18920,
    sales: 234,
    description:
      "Experience industry-leading noise cancellation with the Sony WH-1000XM5. Features 30-hour battery life, premium comfort, and exceptional sound quality.",
    features: [
      "Industry-leading noise cancellation",
      "30-hour battery life",
      "Premium comfort design",
      "Exceptional sound quality",
      "Quick charge (3 min = 3 hours)",
      "Touch controls",
    ],
    specifications: {
      Driver: "30mm dynamic",
      Frequency: "4Hz-40,000Hz",
      Battery: "30 hours (NC on)",
      Weight: "250g",
      Connectivity: "Bluetooth 5.2",
      Codecs: "LDAC, AAC, SBC",
    },
  },
  {
    id: 6,
    title: 'Samsung 65" QLED 4K Smart TV',
    price: 1299.99,
    originalPrice: 1599.99,
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    category: "electronics",
    subcategory: "tv",
    brand: "Samsung",
    seller: "Electronics Plus",
    rating: 4.7,
    reviewCount: 892,
    inStock: true,
    stockQuantity: 23,
    discount: 19,
    views: 11230,
    sales: 56,
    description:
      "Immerse yourself in stunning 4K content with Samsung's QLED technology. Features Quantum HDR, Smart TV capabilities, and a sleek design.",
    features: [
      "65-inch QLED 4K display",
      "Quantum HDR technology",
      "Smart TV with apps",
      "Voice control",
      "Gaming mode",
      "Multiple HDMI ports",
    ],
    specifications: {
      Display: "65-inch QLED 4K",
      Resolution: "3840 x 2160",
      HDR: "Quantum HDR",
      "Smart TV": "Tizen OS",
      Connectivity: "WiFi, Bluetooth",
      Ports: "4 HDMI, 2 USB",
    },
  },

  // ===== FASHION CATEGORY =====
  {
    id: 7,
    title: "Nike Air Max 270 - Men's Running Shoes",
    price: 129.99,
    originalPrice: 149.99,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "fashion",
    subcategory: "footwear",
    brand: "Nike",
    seller: "SportStyle",
    rating: 4.6,
    reviewCount: 892,
    inStock: true,
    stockQuantity: 156,
    discount: 13,
    views: 8750,
    sales: 234,
    description:
      "Step into comfort with the Nike Air Max 270. Features the tallest Air unit yet for all-day comfort and a bold design that's perfect for everyday wear.",
    features: [
      "Tallest Air unit yet",
      "Breathable mesh upper",
      "Foam midsole",
      "Rubber outsole",
      "All-day comfort",
      "Bold design",
    ],
    specifications: {
      Upper: "Breathable mesh",
      Midsole: "Foam with Air unit",
      Outsole: "Rubber",
      Weight: "10.5 oz",
      Drop: "10mm",
      Use: "Running, Lifestyle",
    },
  },
  {
    id: 8,
    title: "Levi's 501 Original Jeans - Men's",
    price: 89.99,
    originalPrice: 99.99,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    category: "fashion",
    subcategory: "clothing",
    brand: "Levi's",
    seller: "Denim Depot",
    rating: 4.5,
    reviewCount: 1247,
    inStock: true,
    stockQuantity: 89,
    discount: 10,
    views: 15670,
    sales: 456,
    description:
      "The iconic Levi's 501 Original Jeans. Classic straight fit with authentic details and premium denim that gets better with every wear.",
    features: [
      "Classic straight fit",
      "Premium denim",
      "Authentic details",
      "Button fly",
      "5-pocket design",
      "Iconic red tab",
    ],
    specifications: {
      Fit: "Straight",
      Rise: "Mid-rise",
      Leg: "Straight leg",
      Fabric: "100% Cotton denim",
      Wash: "Medium wash",
      Care: "Machine wash cold",
    },
  },
  {
    id: 9,
    title: "Michael Kors Jet Set Crossbody Bag",
    price: 199.99,
    originalPrice: 249.99,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    category: "fashion",
    subcategory: "accessories",
    brand: "Michael Kors",
    seller: "Luxury Bags",
    rating: 4.7,
    reviewCount: 567,
    inStock: true,
    stockQuantity: 34,
    discount: 20,
    views: 8920,
    sales: 123,
    description:
      "Elevate your style with the Michael Kors Jet Set Crossbody Bag. Crafted from premium saffiano leather with gold-tone hardware and adjustable strap.",
    features: [
      "Premium saffiano leather",
      "Gold-tone hardware",
      "Adjustable strap",
      "Multiple compartments",
      "Logo detail",
      "Crossbody design",
    ],
    specifications: {
      Material: "Saffiano leather",
      Hardware: "Gold-tone",
      Dimensions: "9.5 x 2.5 x 7.5",
      Strap: "Adjustable 22",
      Interior: "Lined",
      Closure: "Zip top",
    },
  },
  {
    id: 10,
    title: "Ray-Ban Aviator Classic - Gold Frame",
    price: 159.99,
    originalPrice: 179.99,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    category: "fashion",
    subcategory: "accessories",
    brand: "Ray-Ban",
    seller: "Sunglass Hut",
    rating: 4.8,
    reviewCount: 892,
    inStock: true,
    stockQuantity: 67,
    discount: 11,
    views: 12340,
    sales: 189,
    description:
      "The iconic Ray-Ban Aviator sunglasses. Classic gold frame with green lenses, perfect for any occasion and offering 100% UV protection.",
    features: [
      "Classic aviator design",
      "Gold frame",
      "Green lenses",
      "100% UV protection",
      "Lightweight metal frame",
      "Iconic design",
    ],
    specifications: {
      Frame: "Gold metal",
      Lens: "Green",
      "UV Protection": "100%",
      "Lens Width": "58mm",
      Bridge: "14mm",
      Temple: "135mm",
    },
  },

  // ===== HOME & GARDEN CATEGORY =====
  {
    id: 11,
    title: "Philips Hue White & Color Ambiance Starter Kit",
    price: 199.99,
    originalPrice: 249.99,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    category: "home-garden",
    subcategory: "lighting",
    brand: "Philips",
    seller: "Smart Home Hub",
    rating: 4.7,
    reviewCount: 1234,
    inStock: true,
    stockQuantity: 45,
    discount: 20,
    views: 15670,
    sales: 234,
    description:
      "Transform your home with Philips Hue smart lighting. Control your lights from anywhere, set schedules, and create the perfect ambiance for any mood.",
    features: [
      "3 A19 bulbs",
      "Hue Bridge",
      "16 million colors",
      "Voice control compatible",
      "Schedule automation",
      "Energy efficient",
    ],
    specifications: {
      Bulbs: "3 A19 E26",
      Power: "9W (60W equivalent)",
      Colors: "16 million",
      Connectivity: "Zigbee",
      Lifespan: "25,000 hours",
      Compatibility: "Alexa, Google, Apple",
    },
  },
  {
    id: 12,
    title: "Dyson V15 Detect Cordless Vacuum",
    price: 699.99,
    originalPrice: 799.99,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop",
    category: "home-garden",
    subcategory: "cleaning",
    brand: "Dyson",
    seller: "Home Essentials",
    rating: 4.9,
    reviewCount: 892,
    inStock: true,
    stockQuantity: 23,
    discount: 13,
    views: 9870,
    sales: 156,
    description:
      "Experience powerful cleaning with the Dyson V15 Detect. Features laser dust detection, 60-minute runtime, and advanced filtration for a cleaner home.",
    features: [
      "Laser dust detection",
      "60-minute runtime",
      "Advanced filtration",
      "LCD screen",
      "Multiple attachments",
      "Cordless design",
    ],
    specifications: {
      Runtime: "60 minutes",
      Suction: "240 AW",
      Filtration: "HEPA",
      Weight: "2.95 kg",
      Charging: "4.5 hours",
      "Dust Bin": "0.54L",
    },
  },
  {
    id: 13,
    title: "IKEA KALLAX Shelf Unit - White",
    price: 89.99,
    originalPrice: 99.99,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    category: "home-garden",
    subcategory: "furniture",
    brand: "IKEA",
    seller: "Furniture World",
    rating: 4.4,
    reviewCount: 567,
    inStock: true,
    stockQuantity: 78,
    discount: 10,
    views: 6540,
    sales: 89,
    description:
      "Versatile KALLAX shelf unit perfect for organizing any room. Features a clean, modern design with multiple storage compartments.",
    features: [
      "Clean modern design",
      "Multiple compartments",
      "Easy assembly",
      "Versatile storage",
      "Sturdy construction",
      "White finish",
    ],
    specifications: {
      Dimensions: '77" x 30" x 15"',
      Material: "Particleboard, foil",
      Weight: "44 lbs",
      Compartments: "8",
      Assembly: "Required",
      Finish: "White",
    },
  },

  // ===== SPORTS CATEGORY =====
  {
    id: 14,
    title: "Wilson Pro Staff Tennis Racket",
    price: 249.99,
    originalPrice: 299.99,
    image:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
    category: "sports",
    subcategory: "tennis",
    brand: "Wilson",
    seller: "SportStyle",
    rating: 4.8,
    reviewCount: 456,
    inStock: true,
    stockQuantity: 34,
    discount: 17,
    views: 7890,
    sales: 67,
    description:
      "Professional-grade tennis racket used by top players. Features advanced technology for power, control, and feel on every shot.",
    features: [
      "Professional grade",
      "Advanced technology",
      "Power and control",
      "Premium materials",
      "Tournament approved",
      "Wilson guarantee",
    ],
    specifications: {
      "Head Size": "97 sq inches",
      Weight: "315g",
      Balance: "315mm",
      "String Pattern": "16x19",
      "Grip Size": "4 3/8",
      Frame: "Graphite",
    },
  },
  {
    id: 15,
    title: "Nike Dri-FIT Training Shorts - Men's",
    price: 39.99,
    originalPrice: 49.99,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    category: "sports",
    subcategory: "athletic-wear",
    brand: "Nike",
    seller: "SportStyle",
    rating: 4.6,
    reviewCount: 892,
    inStock: true,
    stockQuantity: 156,
    discount: 20,
    views: 12340,
    sales: 234,
    description:
      "Stay comfortable during your workout with Nike Dri-FIT training shorts. Features moisture-wicking technology and a comfortable fit for any activity.",
    features: [
      "Dri-FIT technology",
      "Moisture wicking",
      "Comfortable fit",
      "Built-in liner",
      "Elastic waistband",
      "Quick-dry fabric",
    ],
    specifications: {
      Material: "100% Polyester",
      Fit: "Standard",
      Length: "7-inch inseam",
      Waist: "Elastic with drawstring",
      Liner: "Built-in",
      Care: "Machine wash cold",
    },
  },

  // ===== BOOKS CATEGORY =====
  {
    id: 16,
    title: "The Psychology of Money - Morgan Housel",
    price: 24.99,
    originalPrice: 29.99,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    category: "books",
    subcategory: "business",
    brand: "Harriman House",
    seller: "Book Haven",
    rating: 4.8,
    reviewCount: 2156,
    inStock: true,
    stockQuantity: 89,
    discount: 17,
    views: 23450,
    sales: 567,
    description:
      "Timeless lessons on wealth, greed, and happiness. A must-read for anyone interested in understanding the psychology behind financial decisions.",
    features: [
      "Timeless financial wisdom",
      "Easy to understand",
      "Real-world examples",
      "Psychology insights",
      "Bestseller",
      "Hardcover edition",
    ],
    specifications: {
      Pages: "256",
      Format: "Hardcover",
      Language: "English",
      Publisher: "Harriman House",
      ISBN: "978-0857197689",
      Dimensions: "6.1 x 9.2",
    },
  },
  {
    id: 17,
    title: "Atomic Habits - James Clear",
    price: 19.99,
    originalPrice: 24.99,
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=400&fit=crop",
    category: "books",
    subcategory: "self-help",
    brand: "Avery",
    seller: "Book Haven",
    rating: 4.9,
    reviewCount: 3456,
    inStock: true,
    stockQuantity: 123,
    discount: 20,
    views: 45670,
    sales: 890,
    description:
      "Transform your life with tiny changes that lead to remarkable results. Learn how to build good habits and break bad ones.",
    features: [
      "Proven strategies",
      "Easy to implement",
      "Science-based approach",
      "Practical examples",
      "Bestseller",
      "Paperback edition",
    ],
    specifications: {
      Pages: "320",
      Format: "Paperback",
      Language: "English",
      Publisher: "Avery",
      ISBN: "978-0735211292",
      Dimensions: "5.5 x 8.4",
    },
  },

  // ===== AUTOMOTIVE CATEGORY =====
  {
    id: 18,
    title: "Michelin Pilot Sport 4S Tires - Set of 4",
    price: 899.99,
    originalPrice: 1099.99,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    category: "automotive",
    subcategory: "tires",
    brand: "Michelin",
    seller: "Auto Parts Pro",
    rating: 4.8,
    reviewCount: 567,
    inStock: true,
    stockQuantity: 23,
    discount: 18,
    views: 8920,
    sales: 89,
    description:
      "Ultra-high performance summer tires designed for sports cars and high-performance vehicles. Features advanced compound technology for exceptional grip.",
    features: [
      "Ultra-high performance",
      "Summer compound",
      "Exceptional grip",
      "Wet weather handling",
      "Long tread life",
      "Set of 4 tires",
    ],
    specifications: {
      Size: "245/40R18",
      "Load Rating": "97Y",
      "Tread Depth": "8.5/32",
      Compound: "Summer",
      Warranty: "30,000 miles",
      Type: "Performance",
    },
  },
  {
    id: 19,
    title: "Dash Cam - 4K Ultra HD Recording",
    price: 149.99,
    originalPrice: 199.99,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    category: "automotive",
    subcategory: "electronics",
    brand: "Garmin",
    seller: "Auto Parts Pro",
    rating: 4.6,
    reviewCount: 892,
    inStock: true,
    stockQuantity: 45,
    discount: 25,
    views: 12340,
    sales: 156,
    description:
      "Capture every moment on the road with 4K Ultra HD recording. Features GPS tracking, voice control, and automatic incident detection.",
    features: [
      "4K Ultra HD recording",
      "GPS tracking",
      "Voice control",
      "Incident detection",
      "WiFi connectivity",
      "Mobile app support",
    ],
    specifications: {
      Resolution: "4K Ultra HD",
      "Field of View": "180°",
      Storage: "64GB included",
      GPS: "Built-in",
      Connectivity: "WiFi, Bluetooth",
      Mount: "Suction cup",
    },
  },
];

// Get all products with optional filtering
router.get("/", async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sortBy } = req.query;
    let filteredProducts = [...products];

    // Apply filters
    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === category
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= parseFloat(minPrice)
      );
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= parseFloat(maxPrice)
      );
    }

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case "price-low":
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case "popularity":
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
      filters: { category, search, minPrice, maxPrice, sortBy },
    });
  } catch (error) {
    logger.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch products",
      code: "PRODUCTS_ERROR",
    });
  }
});

// Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
        code: "PRODUCT_NOT_FOUND",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    logger.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch product",
      code: "PRODUCT_ERROR",
    });
  }
});

// Export the products array for use in other routes
module.exports = router;
module.exports.products = products;
