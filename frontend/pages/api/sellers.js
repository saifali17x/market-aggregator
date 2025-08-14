// Complete sellers data from backend for Vercel deployment
const mockSellers = [
  {
    id: 1,
    name: "TechStore Pro",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    description: "Premium electronics retailer with the latest tech innovations. Specializing in high-end smartphones, laptops, and professional equipment.",
    rating: 4.8,
    reviewCount: 1247,
    memberSince: "2020",
    totalSales: 15420,
    location: "San Francisco, CA",
    website: "https://techstorepro.com",
    categories: ["Electronics", "Computers", "Smartphones", "Laptops"],
    badges: ["Verified Store", "Premium Seller", "Fast Shipping", "Expert Support"],
    featuredProducts: ["iPhone 15 Pro Max", "Dell XPS 13 Plus", "MacBook Pro M3"]
  },
  {
    id: 2,
    name: "Mobile World",
    logo: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    description: "Your one-stop shop for all mobile devices and accessories. From flagship smartphones to essential mobile gear.",
    rating: 4.6,
    reviewCount: 892,
    memberSince: "2019",
    totalSales: 9876,
    location: "New York, NY",
    website: "https://mobileworld.com",
    categories: ["Electronics", "Smartphones", "Mobile Accessories", "Wearables"],
    badges: ["Mobile Expert", "Fast Delivery", "Verified Store", "Best Prices"],
    featuredProducts: ["Samsung Galaxy S24 Ultra", "Mobile Cases", "Wireless Chargers"]
  },
  {
    id: 3,
    name: "Apple Store",
    logo: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    description: "Official Apple products and premium accessories. Get the latest iPhones, MacBooks, and Apple ecosystem devices.",
    rating: 4.9,
    reviewCount: 2341,
    memberSince: "2018",
    totalSales: 25678,
    location: "Cupertino, CA",
    website: "https://apple.com",
    categories: ["Electronics", "Apple Products", "Accessories", "Wearables"],
    badges: ["Official Store", "Premium Quality", "Expert Support", "Apple Certified"],
    featuredProducts: ["MacBook Pro M3", "iPhone 15 Pro", "iPad Pro", "Apple Watch"]
  },
  {
    id: 4,
    name: "Audio Haven",
    logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    description: "Premium audio equipment and accessories. From studio headphones to home theater systems.",
    rating: 4.7,
    reviewCount: 1567,
    memberSince: "2021",
    totalSales: 5432,
    location: "Nashville, TN",
    website: "https://audiohaven.com",
    categories: ["Electronics", "Audio", "Headphones", "Speakers"],
    badges: ["Audio Expert", "Premium Quality", "Fast Shipping", "Expert Advice"],
    featuredProducts: ["Sony WH-1000XM5", "Studio Monitors", "Wireless Earbuds"]
  },
  {
    id: 5,
    name: "Electronics Plus",
    logo: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    description: "Comprehensive electronics store with everything from TVs to smart home devices.",
    rating: 4.5,
    reviewCount: 2341,
    memberSince: "2017",
    totalSales: 18945,
    location: "Chicago, IL",
    website: "https://electronicsplus.com",
    categories: ["Electronics", "TVs", "Smart Home", "Gaming"],
    badges: ["Large Selection", "Competitive Prices", "Fast Delivery", "Good Support"],
    featuredProducts: ["Samsung QLED TV", "Smart Home Hub", "Gaming Consoles"]
  },
  {
    id: 6,
    name: "Photo Pro",
    logo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    description: "Professional photography equipment and accessories. From cameras to lighting and studio gear.",
    rating: 4.8,
    reviewCount: 892,
    memberSince: "2020",
    totalSales: 3456,
    location: "Los Angeles, CA",
    website: "https://photopro.com",
    categories: ["Electronics", "Cameras", "Photography", "Studio Equipment"],
    badges: ["Photo Expert", "Professional Gear", "Expert Advice", "Fast Shipping"],
    featuredProducts: ["Canon EOS R6", "Studio Lighting", "Camera Lenses"]
  },
  {
    id: 7,
    name: "Game Zone",
    logo: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    description: "Gaming paradise with consoles, games, accessories, and gaming peripherals.",
    rating: 4.6,
    reviewCount: 3456,
    memberSince: "2019",
    totalSales: 12345,
    location: "Seattle, WA",
    website: "https://gamezone.com",
    categories: ["Electronics", "Gaming", "Consoles", "Accessories"],
    badges: ["Gaming Expert", "Latest Releases", "Competitive Prices", "Fast Delivery"],
    featuredProducts: ["Nintendo Switch OLED", "Gaming Headsets", "Gaming Mice"]
  },
  {
    id: 8,
    name: "Drone World",
    logo: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    description: "Specialized drone store with professional and recreational drones, cameras, and accessories.",
    rating: 4.7,
    reviewCount: 567,
    memberSince: "2021",
    totalSales: 2345,
    location: "Miami, FL",
    website: "https://droneworld.com",
    categories: ["Electronics", "Drones", "Aerial Photography", "Accessories"],
    badges: ["Drone Expert", "Professional Models", "Expert Training", "Fast Shipping"],
    featuredProducts: ["DJI Mini 3 Pro", "Drone Cameras", "Flight Controllers"]
  },
  {
    id: 9,
    name: "SportStyle",
    logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    description: "Premium sports and lifestyle footwear. From running shoes to casual sneakers for every occasion.",
    rating: 4.6,
    reviewCount: 2341,
    memberSince: "2018",
    totalSales: 15678,
    location: "Portland, OR",
    website: "https://sportstyle.com",
    categories: ["Fashion", "Footwear", "Sports", "Lifestyle"],
    badges: ["Sports Expert", "Premium Brands", "Fast Delivery", "Size Guarantee"],
    featuredProducts: ["Nike Air Max 270", "Running Shoes", "Athletic Wear"]
  },
  {
    id: 10,
    name: "Denim Depot",
    logo: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    description: "Denim specialists with premium jeans, jackets, and denim accessories from top brands.",
    rating: 4.5,
    reviewCount: 1890,
    memberSince: "2019",
    totalSales: 9876,
    location: "Denver, CO",
    website: "https://denimdepot.com",
    categories: ["Fashion", "Clothing", "Denim", "Accessories"],
    badges: ["Denim Expert", "Premium Quality", "Authentic Brands", "Fast Shipping"],
    featuredProducts: ["Levi's 501", "Denim Jackets", "Denim Accessories"]
  },
  {
    id: 11,
    name: "Luxury Bags",
    logo: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    description: "Premium handbags, wallets, and luxury accessories from world-renowned designers.",
    rating: 4.8,
    reviewCount: 1234,
    memberSince: "2020",
    totalSales: 5432,
    location: "Beverly Hills, CA",
    website: "https://luxurybags.com",
    categories: ["Fashion", "Accessories", "Luxury", "Handbags"],
    badges: ["Luxury Expert", "Authentic Products", "Premium Service", "Fast Delivery"],
    featuredProducts: ["Michael Kors Bags", "Designer Wallets", "Luxury Accessories"]
  },
  {
    id: 12,
    name: "Sunglass Hut",
    logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    description: "Premium sunglasses and eyewear from top brands. Protection and style for every occasion.",
    rating: 4.7,
    reviewCount: 3456,
    memberSince: "2017",
    totalSales: 23456,
    location: "Miami Beach, FL",
    website: "https://sunglasshut.com",
    categories: ["Fashion", "Accessories", "Eyewear", "Sunglasses"],
    badges: ["Eyewear Expert", "Premium Brands", "UV Protection", "Style Guarantee"],
    featuredProducts: ["Ray-Ban Aviators", "Designer Frames", "Prescription Lenses"]
  },
  {
    id: 13,
    name: "Smart Home Hub",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    description: "Smart home automation and IoT devices. Transform your home with cutting-edge technology.",
    rating: 4.6,
    reviewCount: 2341,
    memberSince: "2020",
    totalSales: 8765,
    location: "Austin, TX",
    website: "https://smarthomehub.com",
    categories: ["Home & Garden", "Smart Home", "Automation", "IoT"],
    badges: ["Smart Home Expert", "Latest Technology", "Professional Installation", "24/7 Support"],
    featuredProducts: ["Philips Hue", "Smart Thermostats", "Security Systems"]
  },
  {
    id: 14,
    name: "Home Essentials",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    description: "Essential home appliances and cleaning equipment for modern living.",
    rating: 4.5,
    reviewCount: 3456,
    memberSince: "2018",
    totalSales: 15678,
    location: "Phoenix, AZ",
    website: "https://homeessentials.com",
    categories: ["Home & Garden", "Appliances", "Cleaning", "Kitchen"],
    badges: ["Home Expert", "Quality Products", "Fast Delivery", "Warranty Support"],
    featuredProducts: ["Dyson Vacuums", "Kitchen Appliances", "Cleaning Supplies"]
  }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;
    
    console.log("🔄 Sellers API called with ID:", id);
    
    if (id) {
      // Return specific seller
      const sellerId = parseInt(id);
      console.log("🔍 Looking for seller ID:", sellerId);
      
      const seller = mockSellers.find(s => s.id === sellerId);
      if (seller) {
        console.log(`✅ Found seller: ${seller.name}`);
        res.status(200).json({
          success: true,
          data: seller
        });
      } else {
        console.log(`❌ Seller with ID ${sellerId} not found`);
        res.status(404).json({
          success: false,
          error: "Seller not found"
        });
      }
    } else {
      // Return all sellers
      console.log("📋 Returning all sellers");
      res.status(200).json({
        success: true,
        data: mockSellers
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
