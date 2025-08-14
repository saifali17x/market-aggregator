// Seller products API for Vercel deployment
const mockProducts = [
  // ===== ELECTRONICS CATEGORY =====
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
      "Thunderbolt 4 ports"
    ],
    specifications: {
      "Display": "14-inch Liquid Retina XDR",
      "Processor": "M3 chip with 8-core CPU",
      "Memory": "8GB unified memory",
      "Storage": "512GB SSD",
      "Battery": "Up to 22 hours",
      "Operating System": "macOS Sonoma"
    }
  },
  {
    id: 4,
    title: "Dell XPS 13 Plus - Intel i7 - 16GB RAM",
    price: 1499.99,
    originalPrice: 1699.99,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
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
    description: "The Dell XPS 13 Plus combines stunning design with powerful performance. Features an edge-to-edge display, premium build quality, and the latest Intel processors.",
    features: [
      "13th Gen Intel Core i7 processor",
      "13.4-inch 4K OLED display",
      "16GB LPDDR5 RAM",
      "512GB PCIe SSD",
      "Intel Iris Xe graphics",
      "Thunderbolt 4 ports"
    ],
    specifications: {
      "Display": "13.4-inch 4K OLED",
      "Processor": "Intel Core i7-1355U",
      "Memory": "16GB LPDDR5",
      "Storage": "512GB PCIe SSD",
      "Graphics": "Intel Iris Xe",
      "Operating System": "Windows 11 Pro"
    }
  },
  {
    id: 5,
    title: "Sony WH-1000XM5 Wireless Headphones",
    price: 349.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
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
    description: "Experience industry-leading noise cancellation with the Sony WH-1000XM5. Features 30-hour battery life, premium comfort, and exceptional sound quality.",
    features: [
      "Industry-leading noise cancellation",
      "30-hour battery life",
      "Premium comfort design",
      "Exceptional sound quality",
      "Quick charge (3 min = 3 hours)",
      "Touch controls"
    ],
    specifications: {
      "Driver": "30mm dynamic",
      "Frequency": "4Hz-40,000Hz",
      "Battery": "30 hours (NC on)",
      "Weight": "250g",
      "Connectivity": "Bluetooth 5.2",
      "Codecs": "LDAC, AAC, SBC"
    }
  },
  {
    id: 6,
    title: "Samsung 65\" QLED 4K Smart TV",
    price: 1299.99,
    originalPrice: 1599.99,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
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
    description: "Immerse yourself in stunning 4K content with Samsung's QLED technology. Features Quantum HDR, Smart TV capabilities, and a sleek design.",
    features: [
      "65-inch QLED 4K display",
      "Quantum HDR technology",
      "Smart TV with Tizen OS",
      "Voice control with Bixby",
      "Gaming mode",
      "Multiple HDMI ports"
    ],
    specifications: {
      "Display": "65-inch QLED 4K",
      "Resolution": "3840 x 2160",
      "HDR": "Quantum HDR",
      "Smart TV": "Tizen OS",
      "Connectivity": "WiFi, Bluetooth, HDMI",
      "Audio": "2.1 Channel"
    }
  },
  {
    id: 7,
    title: "Apple Watch Series 9 - 45mm GPS",
    price: 399.99,
    originalPrice: 429.99,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
    category: "electronics",
    subcategory: "wearables",
    brand: "Apple",
    seller: "Apple Store",
    rating: 4.8,
    reviewCount: 1234,
    inStock: true,
    stockQuantity: 89,
    discount: 7,
    views: 15670,
    sales: 178,
    description: "The Apple Watch Series 9 features the new S9 SiP, faster performance, and enhanced health monitoring capabilities. Perfect for fitness and everyday use.",
    features: [
      "S9 SiP with 64-bit dual-core processor",
      "Always-On Retina display",
      "Heart rate monitoring",
      "ECG app",
      "Blood oxygen monitoring",
      "Water resistant to 50m"
    ],
    specifications: {
      "Display": "45mm Always-On Retina",
      "Processor": "S9 SiP",
      "Battery": "Up to 18 hours",
      "Water Resistance": "50m",
      "Connectivity": "GPS, WiFi, Bluetooth",
      "Compatibility": "iPhone 8 or later"
    }
  },
  {
    id: 8,
    title: "Canon EOS R6 Mark II Mirrorless Camera",
    price: 2499.99,
    originalPrice: 2799.99,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    category: "electronics",
    subcategory: "cameras",
    brand: "Canon",
    seller: "Photo Pro",
    rating: 4.9,
    reviewCount: 456,
    inStock: true,
    stockQuantity: 12,
    discount: 11,
    views: 5430,
    sales: 23,
    description: "Professional-grade mirrorless camera with 24.2MP full-frame sensor, 4K video recording, and advanced autofocus system. Perfect for photography and videography.",
    features: [
      "24.2MP full-frame CMOS sensor",
      "4K 60p video recording",
      "Dual Pixel CMOS AF II",
      "5-axis image stabilization",
      "Weather-sealed design",
      "Dual card slots"
    ],
    specifications: {
      "Sensor": "24.2MP full-frame CMOS",
      "Video": "4K 60p",
      "Autofocus": "Dual Pixel CMOS AF II",
      "Stabilization": "5-axis IBIS",
      "Connectivity": "WiFi, Bluetooth",
      "Battery": "LP-E6NH"
    }
  },
  {
    id: 9,
    title: "Nintendo Switch OLED - White",
    price: 349.99,
    originalPrice: 379.99,
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop",
    category: "electronics",
    subcategory: "gaming",
    brand: "Nintendo",
    seller: "Game Zone",
    rating: 4.7,
    reviewCount: 2341,
    inStock: true,
    stockQuantity: 156,
    discount: 8,
    views: 23450,
    sales: 445,
    description: "The Nintendo Switch OLED features a vibrant 7-inch OLED screen, enhanced audio, and the same great gaming experience. Perfect for gaming on the go or at home.",
    features: [
      "7-inch OLED screen",
      "Enhanced audio",
      "64GB internal storage",
      "Joy-Con controllers included",
      "Dock for TV mode",
      "Up to 9 hours battery life"
    ],
    specifications: {
      "Display": "7-inch OLED",
      "Resolution": "1280 x 720",
      "Storage": "64GB",
      "Battery": "Up to 9 hours",
      "Connectivity": "WiFi, Bluetooth",
      "Controllers": "Joy-Con included"
    }
  },
  {
    id: 10,
    title: "DJI Mini 3 Pro Drone",
    price: 759.99,
    originalPrice: 799.99,
    image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=400&h=400&fit=crop",
    category: "electronics",
    subcategory: "drones",
    brand: "DJI",
    seller: "Drone World",
    rating: 4.8,
    reviewCount: 789,
    inStock: true,
    stockQuantity: 34,
    discount: 5,
    views: 8760,
    sales: 67,
    description: "Ultra-lightweight drone with 4K video recording, obstacle avoidance, and extended flight time. Perfect for aerial photography and videography.",
    features: [
      "4K video recording",
      "Obstacle avoidance",
      "Extended flight time",
      "Ultra-lightweight design",
      "Intelligent flight modes",
      "Remote controller included"
    ],
    specifications: {
      "Camera": "4K/60fps",
      "Weight": "Under 250g",
      "Flight Time": "Up to 34 minutes",
      "Range": "Up to 12km",
      "Max Speed": "16m/s",
      "Wind Resistance": "Level 5"
    }
  },
  // ===== FASHION CATEGORY =====
  {
    id: 11,
    title: "Nike Air Max 270 - Men's Running Shoes",
    price: 129.99,
    originalPrice: 149.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
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
    description: "Step into comfort with the Nike Air Max 270. Features the tallest Air unit yet for all-day comfort and a bold design that's perfect for everyday wear.",
    features: [
      "Tallest Air unit yet",
      "Breathable mesh upper",
      "Foam midsole",
      "Rubber outsole",
      "All-day comfort",
      "Bold design"
    ],
    specifications: {
      "Upper": "Breathable mesh",
      "Midsole": "Foam with Air unit",
      "Outsole": "Rubber",
      "Weight": "10.5 oz",
      "Drop": "10mm",
      "Use": "Running, Lifestyle"
    }
  },
  {
    id: 12,
    title: "Levi's 501 Original Jeans - Men's",
    price: 89.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
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
    description: "The iconic Levi's 501 Original Jeans. Classic straight fit with authentic details and premium denim that gets better with every wear.",
    features: [
      "Classic straight fit",
      "Premium denim",
      "Authentic details",
      "Button fly",
      "5-pocket design",
      "Iconic red tab"
    ],
    specifications: {
      "Fit": "Straight",
      "Rise": "Mid-rise",
      "Leg": "Straight leg",
      "Fabric": "100% Cotton denim",
      "Wash": "Medium wash",
      "Care": "Machine wash cold"
    }
  },
  {
    id: 13,
    title: "Michael Kors Jet Set Crossbody Bag",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
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
    description: "Elevate your style with the Michael Kors Jet Set Crossbody Bag. Crafted from premium saffiano leather with gold-tone hardware and adjustable strap.",
    features: [
      "Premium saffiano leather",
      "Gold-tone hardware",
      "Adjustable strap",
      "Multiple compartments",
      "Logo detail",
      "Crossbody design"
    ],
    specifications: {
      "Material": "Saffiano leather",
      "Hardware": "Gold-tone",
      "Dimensions": "9.5 x 2.5 x 7.5",
      "Strap": "Adjustable 22",
      "Interior": "Lined",
      "Closure": "Zip top"
    }
  },
  {
    id: 14,
    title: "Ray-Ban Aviator Classic - Gold Frame",
    price: 159.99,
    originalPrice: 179.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
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
    description: "The iconic Ray-Ban Aviator sunglasses. Classic gold frame with green lenses, perfect for any occasion and offering 100% UV protection.",
    features: [
      "Classic aviator design",
      "Gold frame",
      "Green lenses",
      "100% UV protection",
      "Lightweight metal frame",
      "Iconic design"
    ],
    specifications: {
      "Frame": "Gold metal",
      "Lens": "Green",
      "UV Protection": "100%",
      "Lens Width": "58mm",
      "Bridge": "14mm",
      "Temple": "135mm"
    }
  },
  // ===== HOME & GARDEN CATEGORY =====
  {
    id: 15,
    title: "Philips Hue White & Color Ambiance Starter Kit",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
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
    description: "Transform your home with Philips Hue smart lighting. Control your lights from anywhere, set schedules, and create the perfect ambiance for any mood.",
    features: [
      "3 A19 bulbs",
      "Hue Bridge",
      "16 million colors",
      "Voice control compatible",
      "Schedule automation",
      "Energy efficient"
    ],
    specifications: {
      "Bulbs": "3 A19 E26",
      "Power": "9W (60W equivalent)",
      "Colors": "16 million",
      "Connectivity": "Zigbee",
      "Lifespan": "25,000 hours",
      "Compatibility": "Alexa, Google, Apple"
    }
  },
  {
    id: 16,
    title: "Dyson V15 Detect Cordless Vacuum",
    price: 699.99,
    originalPrice: 799.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    category: "home-garden",
    subcategory: "cleaning",
    brand: "Dyson",
    seller: "Home Essentials",
    rating: 4.8,
    reviewCount: 2341,
    inStock: true,
    stockQuantity: 23,
    discount: 13,
    views: 18920,
    sales: 345,
    description: "Revolutionary cordless vacuum with laser dust detection, powerful suction, and up to 60 minutes of runtime. See hidden dust and clean with precision.",
    features: [
      "Laser dust detection",
      "60 minutes runtime",
      "Powerful suction",
      "HEPA filtration",
      "LCD screen",
      "Multiple attachments"
    ],
    specifications: {
      "Runtime": "Up to 60 minutes",
      "Suction": "240 AW",
      "Filtration": "HEPA",
      "Weight": "2.6 kg",
      "Dust Bin": "0.76L",
      "Charging Time": "4.5 hours"
    }
  }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;
    
    console.log("🔄 Seller products API called with ID:", id);
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Seller ID is required"
      });
    }

    // Find the seller by ID
    const sellerId = parseInt(id);
    console.log("🔍 Looking for seller ID:", sellerId);
    
    // Filter products by seller ID (matching the seller names from products)
    const sellerProducts = mockProducts.filter(product => {
      // Map seller IDs to seller names
      const sellerMap = {
        1: "TechStore Pro",
        2: "Mobile World", 
        3: "Apple Store",
        4: "Audio Haven",
        5: "Electronics Plus",
        6: "Photo Pro",
        7: "Game Zone",
        8: "Drone World",
        9: "SportStyle",
        10: "Denim Depot",
        11: "Luxury Bags",
        12: "Sunglass Hut",
        13: "Smart Home Hub",
        14: "Home Essentials"
      };
      
      const sellerName = sellerMap[sellerId];
      const matches = product.seller === sellerName;
      
      if (matches) {
        console.log(`✅ Product "${product.title}" matches seller "${sellerName}"`);
      }
      
      return matches;
    });

    console.log(`📦 Found ${sellerProducts.length} products for seller ID ${sellerId}`);

    if (sellerProducts.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No products found for this seller"
      });
    }

    res.status(200).json({
      success: true,
      data: sellerProducts,
      total: sellerProducts.length
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
