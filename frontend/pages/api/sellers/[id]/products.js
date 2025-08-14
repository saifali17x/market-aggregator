// Complete product database from backend for Vercel deployment
const mockProducts = [
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
      "Backlit Magic Keyboard",
    ],
    specifications: {
      Display: "14-inch Liquid Retina XDR",
      Processor: "M3 chip with 8-core CPU and 10-core GPU",
      Memory: "8GB unified memory",
      Storage: "512GB SSD",
      Battery: "Up to 22 hours",
      "Operating System": "macOS Sonoma",
    },
  },
  {
    id: 4,
    title: "Sony WH-1000XM5 Wireless Headphones",
    price: 399.99,
    originalPrice: 449.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "electronics",
    subcategory: "audio",
    brand: "Sony",
    seller: "Audio Haven",
    rating: 4.8,
    reviewCount: 2341,
    inStock: true,
    stockQuantity: 67,
    discount: 11,
    views: 21560,
    sales: 156,
    description:
      "Experience industry-leading noise cancellation with the Sony WH-1000XM5 headphones. Features 30-hour battery life and exceptional sound quality.",
    features: [
      "Industry-leading noise cancellation",
      "30-hour battery life",
      "Quick Charge (3 min = 3 hours)",
      "Touch controls",
      "Speak-to-Chat technology",
      "Premium comfort",
    ],
    specifications: {
      Driver: "30mm dynamic",
      "Frequency Response": "4Hz-40,000Hz",
      "Battery Life": "Up to 30 hours",
      Weight: "250g",
      Connectivity: "Bluetooth 5.2",
      "Noise Cancellation": "Yes",
    },
  },
  {
    id: 5,
    title: 'Samsung 65" QLED 4K Smart TV',
    price: 1299.99,
    originalPrice: 1499.99,
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    category: "electronics",
    subcategory: "tv",
    brand: "Samsung",
    seller: "TechStore Pro",
    rating: 4.6,
    reviewCount: 892,
    inStock: true,
    stockQuantity: 23,
    discount: 13,
    views: 15670,
    sales: 78,
    description:
      "Immerse yourself in stunning 4K QLED picture quality with Quantum HDR and smart TV capabilities. Perfect for gaming and entertainment.",
    features: [
      "4K QLED display",
      "Quantum HDR",
      "Smart TV with Bixby",
      "Gaming mode",
      "Voice control",
      "Screen mirroring",
    ],
    specifications: {
      "Screen Size": "65 inches",
      Resolution: "4K Ultra HD (3840 x 2160)",
      "Display Technology": "QLED",
      HDR: "Quantum HDR",
      "Smart TV": "Yes",
      "Gaming Features": "Yes",
    },
  },
  {
    id: 6,
    title: "Apple Watch Series 9 - 45mm GPS",
    price: 399.99,
    originalPrice: 429.99,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
    category: "electronics",
    subcategory: "wearables",
    brand: "Apple",
    seller: "Apple Store",
    rating: 4.7,
    reviewCount: 1234,
    inStock: true,
    stockQuantity: 89,
    discount: 7,
    views: 18920,
    sales: 234,
    description:
      "Stay connected and track your fitness with the Apple Watch Series 9. Features advanced health monitoring and seamless iPhone integration.",
    features: [
      "Always-On Retina display",
      "Heart rate monitoring",
      "ECG app",
      "Blood oxygen monitoring",
      "GPS tracking",
      "Water resistant",
    ],
    specifications: {
      Display: "Always-On Retina",
      Size: "45mm",
      GPS: "Yes",
      "Water Resistance": "50m",
      "Battery Life": "Up to 18 hours",
      Compatibility: "iPhone 6s or later",
    },
  },
  {
    id: 7,
    title: "Canon EOS R6 Mark II Mirrorless Camera",
    price: 2499.99,
    originalPrice: 2699.99,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    category: "electronics",
    subcategory: "cameras",
    brand: "Canon",
    seller: "Photo Pro",
    rating: 4.8,
    reviewCount: 456,
    inStock: true,
    stockQuantity: 15,
    discount: 7,
    views: 8760,
    sales: 34,
    description:
      "Capture stunning photos and videos with the Canon EOS R6 Mark II. Features 24.2MP full-frame sensor and advanced autofocus.",
    features: [
      "24.2MP full-frame sensor",
      "4K 60p video recording",
      "Advanced autofocus",
      "5-axis image stabilization",
      "Dual card slots",
      "Weather sealed",
    ],
    specifications: {
      Sensor: "24.2MP full-frame CMOS",
      Video: "4K 60p",
      Autofocus: "Dual Pixel CMOS AF II",
      Stabilization: "5-axis IBIS",
      "Card Slots": "Dual SD",
      "Weather Sealing": "Yes",
    },
  },
  {
    id: 8,
    title: "PlayStation 5 Console - Digital Edition",
    price: 499.99,
    originalPrice: 549.99,
    image:
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop",
    category: "electronics",
    subcategory: "gaming",
    brand: "Sony",
    seller: "GameStop",
    rating: 4.9,
    reviewCount: 2341,
    inStock: true,
    stockQuantity: 45,
    discount: 9,
    views: 32450,
    sales: 567,
    description:
      "Experience next-generation gaming with the PlayStation 5 Digital Edition. Lightning-fast loading, stunning graphics, and immersive gameplay.",
    features: [
      "4K gaming",
      "Ray tracing",
      "3D audio",
      "DualSense controller",
      "Backward compatibility",
      "Digital library",
    ],
    specifications: {
      CPU: "AMD Zen 2 8-core",
      GPU: "AMD RDNA 2",
      Memory: "16GB GDDR6",
      Storage: "825GB SSD",
      "4K": "Yes",
      "Ray Tracing": "Yes",
    },
  },
  {
    id: 9,
    title: "DJI Mini 3 Pro Drone",
    price: 759.99,
    originalPrice: 799.99,
    image:
      "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=400&h=400&fit=crop",
    category: "electronics",
    subcategory: "drones",
    brand: "DJI",
    seller: "Drone World",
    rating: 4.6,
    reviewCount: 234,
    inStock: true,
    stockQuantity: 12,
    discount: 5,
    views: 5430,
    sales: 23,
    description:
      "Capture breathtaking aerial footage with the DJI Mini 3 Pro. Lightweight, portable, and packed with professional features.",
    features: [
      "4K video recording",
      "48MP photos",
      "Obstacle avoidance",
      "34-minute flight time",
      "Lightweight design",
      "Advanced safety features",
    ],
    specifications: {
      Weight: "249g",
      Video: "4K 60fps",
      Photo: "48MP",
      "Flight Time": "34 minutes",
      Range: "12km",
      "Obstacle Avoidance": "Yes",
    },
  },
  {
    id: 10,
    title: "Nike Air Max 270 Running Shoes",
    price: 129.99,
    originalPrice: 149.99,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "fashion",
    subcategory: "footwear",
    brand: "Nike",
    seller: "Sport Central",
    rating: 4.5,
    reviewCount: 1892,
    inStock: true,
    stockQuantity: 156,
    discount: 13,
    views: 28760,
    sales: 445,
    description:
      "Experience ultimate comfort with the Nike Air Max 270. Features the tallest Air unit yet for maximum cushioning and style.",
    features: [
      "Air Max 270 Air unit",
      "Breathable mesh upper",
      "Foam midsole",
      "Rubber outsole",
      "Lightweight design",
      "Comfortable fit",
    ],
    specifications: {
      Type: "Running",
      Upper: "Mesh",
      Midsole: "Foam",
      Outsole: "Rubber",
      Weight: "Lightweight",
      Cushioning: "Maximum",
    },
  },
  {
    id: 11,
    title: "Levi's 501 Original Jeans",
    price: 89.99,
    originalPrice: 99.99,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    category: "fashion",
    subcategory: "clothing",
    brand: "Levi's",
    seller: "Fashion Forward",
    rating: 4.4,
    reviewCount: 2341,
    inStock: true,
    stockQuantity: 234,
    discount: 10,
    views: 45670,
    sales: 678,
    description:
      "Classic 501 jeans with the perfect fit. Made from premium denim with the iconic button fly and straight leg design.",
    features: [
      "Classic 501 fit",
      "Premium denim",
      "Button fly",
      "Straight leg",
      "Five-pocket design",
      "Timeless style",
    ],
    specifications: {
      Fit: "501 Original",
      Fly: "Button",
      Leg: "Straight",
      Pockets: "5",
      Material: "Denim",
      Style: "Classic",
    },
  },
  {
    id: 12,
    title: "Ray-Ban Aviator Classic Sunglasses",
    price: 179.99,
    originalPrice: 199.99,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    category: "fashion",
    subcategory: "accessories",
    brand: "Ray-Ban",
    seller: "Luxury Optics",
    rating: 4.7,
    reviewCount: 1234,
    inStock: true,
    stockQuantity: 78,
    discount: 10,
    views: 18920,
    sales: 234,
    description:
      "Iconic Aviator sunglasses with gold-tone frame and green lenses. Perfect for any occasion with timeless style.",
    features: [
      "Gold-tone frame",
      "Green lenses",
      "UV protection",
      "Classic aviator shape",
      "Lightweight design",
      "Timeless style",
    ],
    specifications: {
      Frame: "Gold-tone metal",
      Lenses: "Green",
      "UV Protection": "100%",
      Shape: "Aviator",
      Weight: "Lightweight",
      Style: "Classic",
    },
  },
  {
    id: 13,
    title: "Philips Hue Smart Bulb Starter Kit",
    price: 199.99,
    originalPrice: 249.99,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    category: "home-garden",
    subcategory: "lighting",
    brand: "Philips",
    seller: "Smart Home Hub",
    rating: 4.6,
    reviewCount: 892,
    inStock: true,
    stockQuantity: 45,
    discount: 20,
    views: 12340,
    sales: 89,
    description:
      "Transform your home with smart lighting. Control colors, brightness, and schedules from your phone or voice assistant.",
    features: [
      "16 million colors",
      "Voice control",
      "App control",
      "Scheduling",
      "Geofencing",
      "Energy efficient",
    ],
    specifications: {
      Bulbs: "3 A19 bulbs",
      Colors: "16 million",
      Control: "App & Voice",
      Compatibility: "Alexa, Google, Apple",
      Wattage: "9W",
      Lifespan: "25,000 hours",
    },
  },
  {
    id: 14,
    title: "Dyson V15 Detect Cordless Vacuum",
    price: 699.99,
    originalPrice: 749.99,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    category: "home-garden",
    subcategory: "cleaning",
    brand: "Dyson",
    seller: "Home Essentials",
    rating: 4.8,
    reviewCount: 567,
    inStock: true,
    stockQuantity: 23,
    discount: 7,
    views: 9870,
    sales: 45,
    description:
      "Revolutionary cordless vacuum with laser technology to reveal hidden dust. Powerful suction and 60-minute runtime.",
    features: [
      "Laser technology",
      "60-minute runtime",
      "Powerful suction",
      "HEPA filtration",
      "LCD screen",
      "Cordless design",
    ],
    specifications: {
      Runtime: "60 minutes",
      Suction: "240 AW",
      Filtration: "HEPA",
      Display: "LCD",
      Weight: "2.6kg",
      Charging: "4.5 hours",
    },
  },
  {
    id: 15,
    title: "Adidas Ultraboost 22 Running Shoes",
    price: 189.99,
    originalPrice: 219.99,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "fashion",
    subcategory: "footwear",
    brand: "Adidas",
    seller: "Sport Central",
    rating: 4.6,
    reviewCount: 1456,
    inStock: true,
    stockQuantity: 89,
    discount: 14,
    views: 23450,
    sales: 345,
    description:
      "Experience ultimate energy return with the Adidas Ultraboost 22. Features responsive Boost midsole and Primeknit upper.",
    features: [
      "Boost midsole",
      "Primeknit upper",
      "Continental outsole",
      "Energy return",
      "Comfortable fit",
      "Responsive cushioning",
    ],
    specifications: {
      Type: "Running",
      Midsole: "Boost",
      Upper: "Primeknit",
      Outsole: "Continental",
      Weight: "Lightweight",
      Cushioning: "Responsive",
    },
  },
  {
    id: 16,
    title: "IKEA KALLAX Shelf Unit",
    price: 89.99,
    originalPrice: 99.99,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    category: "home-garden",
    subcategory: "furniture",
    brand: "IKEA",
    seller: "Home Essentials",
    rating: 4.3,
    reviewCount: 2341,
    inStock: true,
    stockQuantity: 67,
    discount: 10,
    views: 45670,
    sales: 567,
    description:
      "Versatile shelf unit perfect for organizing books, toys, or displaying decorative items. Easy to assemble and customize.",
    features: [
      "Versatile design",
      "Easy assembly",
      "Customizable",
      "Sturdy construction",
      "Multiple uses",
      "Modern style",
    ],
    specifications: {
      Material: "Particleboard",
      Dimensions: "147x147x39cm",
      Weight: "Lightweight",
      Assembly: "Required",
      Style: "Modern",
      Uses: "Versatile",
    },
  },
];

export default function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;

    console.log("🔄 Seller products API called with ID:", id);

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Seller ID is required",
      });
    }

    // Find the seller by ID
    const sellerId = parseInt(id);
    console.log("🔍 Looking for seller ID:", sellerId);

    // Filter products by seller ID (matching the seller names from products)
    const sellerProducts = mockProducts.filter((product) => {
      // Map seller IDs to seller names
      const sellerMap = {
        1: "TechStore Pro",
        2: "Mobile World",
        3: "Apple Store",
        4: "Audio Haven",
        5: "TechStore Pro",
        6: "Apple Store",
        7: "Photo Pro",
        8: "GameStop",
        9: "Drone World",
        10: "Sport Central",
        11: "Fashion Forward",
        12: "Luxury Optics",
        13: "Smart Home Hub",
        14: "Home Essentials",
        15: "Sport Central",
        16: "Home Essentials",
      };

      const sellerName = sellerMap[sellerId];
      const matches = product.seller === sellerName;

      if (matches) {
        console.log(
          `✅ Product "${product.title}" matches seller "${sellerName}"`
        );
      }

      return matches;
    });

    console.log(
      `📦 Found ${sellerProducts.length} products for seller ID ${sellerId}`
    );

    if (sellerProducts.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No products found for this seller",
      });
    }

    res.status(200).json({
      success: true,
      data: sellerProducts,
      total: sellerProducts.length,
      seller: {
        id: sellerId,
        name: sellerMap[sellerId] || "Unknown Seller",
      },
    });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
