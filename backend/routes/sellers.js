const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");

const sellers = [
  {
    id: 1,
    name: "TechStore Pro",
    tagline: "Your trusted source for premium electronics and gadgets",
    description:
      "TechStore Pro has been serving customers since 2020 with the latest and greatest in technology. We specialize in smartphones, laptops, headphones, and other electronic devices from top brands like Apple, Samsung, Sony, and more.",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=120&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 1247,
    verified: true,
    memberSince: "2020",
    totalSales: 15420,
    totalProducts: 6,
    responseTime: "2 hours",
    location: "San Francisco, CA",
    website: "https://techstorepro.com",
    email: "support@techstorepro.com",
    phone: "+1 (555) 123-4567",
    categories: ["Electronics", "Smartphones", "Laptops", "Headphones", "TVs"],
    badges: ["Top Seller", "Fast Shipper", "Verified Store", "Premium Partner"],
    featuredProducts: [
      "iPhone 15 Pro Max",
      "Dell XPS 13 Plus",
      "Sony WH-1000XM5",
    ],
  },
  {
    id: 2,
    name: "Mobile World",
    tagline: "Premium mobile devices and accessories",
    description:
      "Mobile World specializes in the latest smartphones and mobile accessories. We offer competitive prices and expert advice to help you find the perfect device for your needs.",
    logo: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&h=120&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 892,
    verified: true,
    memberSince: "2021",
    totalSales: 12340,
    totalProducts: 2,
    responseTime: "3 hours",
    location: "Los Angeles, CA",
    website: "https://mobileworld.com",
    email: "hello@mobileworld.com",
    phone: "+1 (555) 987-6543",
    categories: ["Electronics", "Smartphones", "Mobile Accessories"],
    badges: ["Mobile Expert", "Fast Delivery", "Verified Store"],
    featuredProducts: [
      "Samsung Galaxy S24 Ultra",
      "Mobile Cases",
      "Wireless Chargers",
    ],
  },
  {
    id: 3,
    name: "Apple Store",
    tagline: "Official Apple products and accessories",
    description:
      "The Apple Store offers the complete range of Apple products including iPhones, MacBooks, iPads, and accessories. Get genuine Apple products with expert support.",
    logo: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=120&h=120&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 567,
    verified: true,
    memberSince: "2019",
    totalSales: 8900,
    totalProducts: 2,
    responseTime: "1 hour",
    location: "Cupertino, CA",
    website: "https://apple.com",
    email: "store@apple.com",
    phone: "+1 (555) 456-7890",
    categories: ["Electronics", "Apple Products", "Computers", "Mobile"],
    badges: ["Official Store", "Premium Partner", "Expert Support"],
  },
  {
    id: 4,
    name: "Audio Haven",
    tagline: "Premium audio equipment and accessories",
    description:
      "Audio Haven is your destination for high-quality audio equipment. From wireless headphones to professional audio gear, we offer the best in sound technology.",
    logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&h=120&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 2156,
    verified: true,
    memberSince: "2020",
    totalSales: 6780,
    totalProducts: 1,
    responseTime: "4 hours",
    location: "Nashville, TN",
    website: "https://audiohaven.com",
    email: "sound@audiohaven.com",
    phone: "+1 (555) 321-0987",
    categories: ["Electronics", "Audio", "Headphones", "Speakers"],
    badges: ["Audio Expert", "Premium Quality", "Verified Store"],
  },
  {
    id: 5,
    name: "Electronics Plus",
    tagline: "Complete electronics solutions for your home",
    description:
      "Electronics Plus offers a wide range of home electronics including TVs, audio systems, and smart home devices. We help you create the perfect entertainment setup.",
    logo: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=120&h=120&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 892,
    verified: true,
    memberSince: "2021",
    totalSales: 5670,
    totalProducts: 1,
    responseTime: "5 hours",
    location: "Seattle, WA",
    website: "https://electronicsplus.com",
    email: "info@electronicsplus.com",
    phone: "+1 (555) 654-3210",
    categories: ["Electronics", "TVs", "Home Audio", "Smart Home"],
    badges: ["Electronics Expert", "Quality Assured", "Fast Delivery"],
  },
  {
    id: 6,
    name: "SportStyle",
    tagline: "Premium sports and fashion apparel",
    description:
      "SportStyle combines athletic performance with street style. We offer the latest in sports fashion, from running shoes to training gear, all designed for comfort and style.",
    logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=120&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 892,
    verified: true,
    memberSince: "2020",
    totalSales: 12340,
    totalProducts: 3,
    responseTime: "4 hours",
    location: "Portland, OR",
    website: "https://sportstyle.com",
    email: "team@sportstyle.com",
    phone: "+1 (555) 789-0123",
    categories: ["Fashion", "Sports", "Footwear", "Athletic Wear"],
    badges: ["Sports Expert", "Fashion Forward", "Verified Store"],
  },
  {
    id: 7,
    name: "Denim Depot",
    tagline: "Premium denim and casual wear",
    description:
      "Denim Depot specializes in high-quality denim products. From classic jeans to modern denim jackets, we offer timeless styles that never go out of fashion.",
    logo: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=120&h=120&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=300&fit=crop",
    rating: 4.5,
    reviewCount: 1247,
    verified: true,
    memberSince: "2019",
    totalSales: 15670,
    totalProducts: 1,
    responseTime: "6 hours",
    location: "Denver, CO",
    website: "https://denimdepot.com",
    email: "denim@denimdepot.com",
    phone: "+1 (555) 234-5678",
    categories: ["Fashion", "Denim", "Casual Wear", "Jeans"],
    badges: ["Denim Expert", "Classic Style", "Verified Store"],
  },
  {
    id: 8,
    name: "Luxury Bags",
    tagline: "Premium handbags and accessories",
    description:
      "Luxury Bags offers authentic designer handbags and accessories. We curate collections from the world's most prestigious brands, ensuring quality and authenticity.",
    logo: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=120&h=120&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 567,
    verified: true,
    memberSince: "2020",
    totalSales: 8920,
    totalProducts: 1,
    responseTime: "3 hours",
    location: "Beverly Hills, CA",
    website: "https://luxurybags.com",
    email: "luxury@luxurybags.com",
    phone: "+1 (555) 345-6789",
    categories: ["Fashion", "Luxury", "Handbags", "Accessories"],
    badges: ["Luxury Expert", "Authentic Products", "Premium Service"],
  },
  {
    id: 9,
    name: "Sunglass Hut",
    tagline: "Premium sunglasses and eyewear",
    description:
      "Sunglass Hut offers the latest in designer sunglasses and eyewear. From classic aviators to modern frames, we have the perfect pair for every style and occasion.",
    logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=120&h=120&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 892,
    verified: true,
    memberSince: "2021",
    totalSales: 12340,
    totalProducts: 1,
    responseTime: "2 hours",
    location: "Miami, FL",
    website: "https://sunglasshut.com",
    email: "shades@sunglasshut.com",
    phone: "+1 (555) 456-7890",
    categories: ["Fashion", "Sunglasses", "Eyewear", "Accessories"],
    badges: ["Eyewear Expert", "Designer Brands", "Fast Delivery"],
  },
  {
    id: 10,
    name: "Smart Home Hub",
    tagline: "Smart home solutions for modern living",
    description:
      "Smart Home Hub specializes in smart home technology and automation. We help you create a connected home with the latest in smart lighting, security, and entertainment systems.",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=120&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 1234,
    verified: true,
    memberSince: "2021",
    totalSales: 15670,
    totalProducts: 1,
    responseTime: "4 hours",
    location: "Austin, TX",
    website: "https://smarthomehub.com",
    email: "smart@smarthomehub.com",
    phone: "+1 (555) 567-8901",
    categories: ["Home & Garden", "Smart Home", "Lighting", "Automation"],
    badges: ["Smart Home Expert", "Innovation Leader", "Verified Store"],
  },
  {
    id: 11,
    name: "Home Essentials",
    tagline: "Everything you need for your home and garden",
    description:
      "Home Essentials has been making homes beautiful and functional since 2021. From kitchen appliances to outdoor furniture, we provide quality products that enhance your living space.",
    logo: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=120&h=120&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 892,
    verified: true,
    memberSince: "2021",
    totalSales: 8900,
    totalProducts: 1,
    responseTime: "6 hours",
    location: "Chicago, IL",
    website: "https://homeessentials.com",
    email: "info@homeessentials.com",
    phone: "+1 (555) 678-9012",
    categories: ["Home & Garden", "Cleaning", "Appliances", "Furniture"],
    badges: ["Home Expert", "Quality Assured", "Fast Delivery"],
  },
  {
    id: 12,
    name: "Furniture World",
    tagline: "Quality furniture for every room",
    description:
      "Furniture World offers a wide selection of furniture for every room in your home. From modern designs to classic pieces, we help you create the perfect living space.",
    logo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=120&h=120&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=300&fit=crop",
    rating: 4.4,
    reviewCount: 567,
    verified: true,
    memberSince: "2020",
    totalSales: 6540,
    totalProducts: 1,
    responseTime: "8 hours",
    location: "Charlotte, NC",
    website: "https://furnitureworld.com",
    email: "furniture@furnitureworld.com",
    phone: "+1 (555) 789-0123",
    categories: ["Home & Garden", "Furniture", "Storage", "Organization"],
    badges: ["Furniture Expert", "Quality Craftsmanship", "Verified Store"],
  },
  {
    id: 13,
    name: "Book Haven",
    tagline: "Your literary destination for knowledge and entertainment",
    description:
      "Book Haven is a curated bookstore offering the best in business, self-help, fiction, and non-fiction. We help readers discover new worlds and expand their knowledge.",
    logo: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=120&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 2156,
    verified: true,
    memberSince: "2019",
    totalSales: 23450,
    totalProducts: 2,
    responseTime: "5 hours",
    location: "Boston, MA",
    website: "https://bookhaven.com",
    email: "books@bookhaven.com",
    phone: "+1 (555) 890-1234",
    categories: ["Books", "Business", "Self-Help", "Non-Fiction"],
    badges: ["Book Expert", "Curated Selection", "Fast Shipping"],
  },
  {
    id: 14,
    name: "Auto Parts Pro",
    tagline: "Professional automotive parts and accessories",
    description:
      "Auto Parts Pro is your trusted source for high-quality automotive parts and accessories. From performance tires to advanced electronics, we keep your vehicle running at its best.",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=120&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 567,
    verified: true,
    memberSince: "2020",
    totalSales: 8920,
    totalProducts: 2,
    responseTime: "6 hours",
    location: "Detroit, MI",
    website: "https://autopartspro.com",
    email: "parts@autopartspro.com",
    phone: "+1 (555) 901-2345",
    categories: ["Automotive", "Tires", "Electronics", "Performance"],
    badges: ["Auto Expert", "Quality Parts", "Fast Delivery"],
  },
];

// Get all sellers
router.get("/", async (req, res) => {
  try {
    const { verified, rating, location } = req.query;
    let filteredSellers = [...sellers];

    // Apply filters
    if (verified === "true") {
      filteredSellers = filteredSellers.filter((s) => s.verified);
    }

    if (rating) {
      const minRating = parseFloat(rating);
      filteredSellers = filteredSellers.filter((s) => s.rating >= minRating);
    }

    if (location) {
      const locationLower = location.toLowerCase();
      filteredSellers = filteredSellers.filter((s) =>
        s.location.toLowerCase().includes(locationLower)
      );
    }

    res.json({
      success: true,
      data: filteredSellers,
      total: filteredSellers.length,
    });
  } catch (error) {
    logger.error("Error fetching sellers:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch sellers",
      code: "SELLERS_ERROR",
    });
  }
});

// Get seller by ID
router.get("/:id", async (req, res) => {
  try {
    const sellerId = parseInt(req.params.id);
    const seller = sellers.find((s) => s.id === sellerId);

    if (!seller) {
      return res.status(404).json({
        success: false,
        error: "Seller not found",
        code: "SELLER_NOT_FOUND",
      });
    }

    res.json({
      success: true,
      data: seller,
    });
  } catch (error) {
    logger.error("Error fetching seller:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch seller",
      code: "SELLER_ERROR",
    });
  }
});

// Get seller products
router.get("/:id/products", async (req, res) => {
  try {
    const sellerId = parseInt(req.params.id);
    const seller = sellers.find((s) => s.id === sellerId);

    if (!seller) {
      return res.status(404).json({
        success: false,
        error: "Seller not found",
        code: "SELLER_NOT_FOUND",
      });
    }

    // Import the products array directly
    const { products: allProducts } = require("./products");

    // Filter products by seller name and map to the format expected by frontend
    const sellerProducts = allProducts
      .filter((product) => product.seller === seller.name)
      .map((product) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        rating: product.rating,
        reviewCount: product.reviewCount,
        views: product.views,
        sales: product.sales,
        discount: product.discount,
        inStock: product.inStock,
      }));

    res.json({
      success: true,
      data: sellerProducts,
      total: sellerProducts.length,
      seller: {
        id: seller.id,
        name: seller.name,
        rating: seller.rating,
      },
    });
  } catch (error) {
    logger.error("Error fetching seller products:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch seller products",
      code: "SELLER_PRODUCTS_ERROR",
    });
  }
});

// POST /api/sellers/claim - Handle seller claim submissions
router.post("/claim", async (req, res) => {
  try {
    // Extract form data
    const {
      sellerName,
      contactEmail,
      contactPhone,
      businessName,
      address,
      city,
      state,
      country,
      listingId,
      listingTitle,
      listingDescription,
      listingPrice,
      listingCurrency,
      listingCondition,
      termsAccepted,
    } = req.body;

    // Validate required fields
    if (
      !sellerName ||
      !contactEmail ||
      !contactPhone ||
      !listingTitle ||
      !listingDescription ||
      !listingPrice
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    if (!termsAccepted) {
      return res.status(400).json({
        success: false,
        error: "Terms and conditions must be accepted",
      });
    }

    // Generate a claim ID
    const claimId = `CLAIM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // In a real application, you would:
    // 1. Store the claim in a database
    // 2. Process the uploaded image
    // 3. Send notification emails
    // 4. Add to review queue

    // Mock claim data (replace with actual database storage)
    const claim = {
      id: claimId,
      sellerName,
      contactEmail,
      contactPhone,
      businessName,
      address: `${address}, ${city}, ${state}, ${country}`,
      listing: {
        id: listingId || null,
        title: listingTitle,
        description: listingDescription,
        price: parseFloat(listingPrice),
        currency: listingCurrency,
        condition: listingCondition,
      },
      status: "pending",
      submittedAt: new Date().toISOString(),
      reviewBy: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
    };

    console.log("📋 New seller claim submitted:", {
      claimId,
      sellerName,
      contactEmail,
      listingTitle,
    });

    res.status(201).json({
      success: true,
      message: "Claim submitted successfully",
      claimId: claimId,
      data: {
        claimId,
        status: "pending",
        reviewBy: claim.reviewBy,
        contactEmail,
      },
    });
  } catch (error) {
    console.error("Error processing seller claim:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process claim submission",
    });
  }
});

module.exports = router;
