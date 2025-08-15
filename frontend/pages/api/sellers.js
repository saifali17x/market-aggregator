// Actual sellers data from backend - matching the real seller database
const mockSellers = [
  {
    id: 1,
    name: "TechStore",
    rating: 4.8,
    products: 7,
    totalProducts: 7,
    location: "New York, NY",
    description:
      "Your trusted electronics retailer with cutting-edge technology and premium customer service",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop",
    verified: true,
    memberSince: "2020",
    joinedDate: "2020-01-15",
    totalSales: 2500000,
    reviewCount: 1250,
    responseTime: "< 1 hour",
    website: "https://techstore.example.com",
    categories: ["Electronics", "Smartphones", "Laptops", "Audio", "Gaming"],
    badges: ["Top Seller", "Fast Shipping", "Excellent Service"],
  },
  {
    id: 2,
    name: "AppleStore",
    rating: 4.9,
    products: 6,
    totalProducts: 6,
    location: "Cupertino, CA",
    description:
      "Official Apple products and accessories with warranty and premium support",
    logo: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=100&h=100&fit=crop&crop=center",
    image:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1441148345475-384df04cb3b9?w=800&h=300&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1441148345475-384df04cb3b9?w=800&h=300&fit=crop",
    verified: true,
    memberSince: "2019",
    joinedDate: "2019-03-10",
    totalSales: 5800000,
    reviewCount: 2890,
    responseTime: "< 30 mins",
    website: "https://apple.com",
    categories: [
      "Apple Products",
      "Laptops",
      "Tablets",
      "Wearables",
      "Smartphones",
    ],
    badges: ["Verified Brand", "Premium Quality", "Authorized Dealer"],
  },
  {
    id: 3,
    name: "ShoesWorld",
    rating: 4.7,
    products: 6,
    totalProducts: 6,
    location: "Chicago, IL",
    description:
      "Premium footwear collection from top brands with size guarantee and authentic products",
    logo: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=100&h=100&fit=crop&crop=center",
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=300&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1448906654166-444d494666b3?w=800&h=300&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1448906654166-444d494666b3?w=800&h=300&fit=crop",
    verified: true,
    memberSince: "2021",
    joinedDate: "2021-06-20",
    totalSales: 1800000,
    reviewCount: 920,
    responseTime: "< 2 hours",
    website: "https://shoesworld.example.com",
    categories: [
      "Footwear",
      "Sneakers",
      "Running Shoes",
      "Casual Shoes",
      "Athletic",
    ],
    badges: ["Brand Partner", "Wide Selection", "Size Guarantee"],
  },
  {
    id: 4,
    name: "HomeGoods",
    rating: 4.5,
    products: 5,
    totalProducts: 5,
    location: "Austin, TX",
    description:
      "Everything for your home - premium appliances, cookware, and home essentials with quality guarantee",
    logo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop&crop=center",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=300&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=300&fit=crop",
    verified: false,
    memberSince: "2022",
    joinedDate: "2022-11-05",
    totalSales: 650000,
    reviewCount: 245,
    responseTime: "< 4 hours",
    website: "https://homegoods.example.com",
    categories: [
      "Home & Garden",
      "Appliances",
      "Cookware",
      "Cleaning",
      "Kitchen",
    ],
    badges: ["Home Specialist", "Quality Guarantee"],
  },
  {
    id: 5,
    name: "PhotoPro",
    rating: 4.9,
    products: 6,
    totalProducts: 6,
    location: "Los Angeles, CA",
    description:
      "Professional photography equipment and accessories with expert support and fast delivery",
    logo: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=100&h=100&fit=crop&crop=center",
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1481447882025-9cfc34fc3829?w=800&h=300&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1481447882025-9cfc34fc3829?w=800&h=300&fit=crop",
    verified: true,
    memberSince: "2020",
    joinedDate: "2020-08-12",
    totalSales: 1200000,
    reviewCount: 680,
    responseTime: "< 1 hour",
    website: "https://photopro.example.com",
    email: "info@photopro.example.com",
    phone: "+1 (555) 123-4567",
    categories: [
      "Photography",
      "Cameras",
      "Lenses",
      "Accessories",
      "Studio Equipment",
    ],
    badges: ["Pro Equipment", "Expert Support", "Fast Delivery"],
  },
];

// Products data to filter by seller - inline to avoid import issues
const mockProducts = [
  // TechStore Products (sellerId: 1)
  { id: 1, sellerId: 1, title: "iPhone 15 Pro", category: "smartphones" },
  { id: 2, sellerId: 1, title: "Sony WH-1000XM5 Headphones", category: "audio" },
  { id: 3, sellerId: 1, title: "Samsung Galaxy S24 Ultra", category: "smartphones" },
  { id: 4, sellerId: 1, title: "Dell XPS 13 Laptop", category: "laptops" },
  { id: 5, sellerId: 1, title: "Gaming Mechanical Keyboard RGB", category: "gaming" },
  { id: 6, sellerId: 1, title: "LG 27-inch 4K Monitor", category: "monitors" },
  { id: 7, sellerId: 1, title: "Wireless Gaming Mouse", category: "gaming" },
  
  // AppleStore Products (sellerId: 2)
  { id: 8, sellerId: 2, title: "MacBook Air M3", category: "laptops" },
  { id: 9, sellerId: 2, title: "iPad Pro 12.9-inch M2", category: "tablets" },
  { id: 10, sellerId: 2, title: "AirPods Pro (3rd Gen)", category: "audio" },
  { id: 11, sellerId: 2, title: "Apple Watch Series 9", category: "wearables" },
  { id: 12, sellerId: 2, title: "MacBook Pro 14-inch M3", category: "laptops" },
  { id: 13, sellerId: 2, title: "iPhone 14 Pro Max", category: "smartphones" },
  
  // ShoesWorld Products (sellerId: 3)
  { id: 14, sellerId: 3, title: "Nike Air Jordan 1 Retro High", category: "footwear" },
  { id: 15, sellerId: 3, title: "Adidas Ultraboost 22", category: "footwear" },
  { id: 16, sellerId: 3, title: "Converse Chuck Taylor All Star", category: "footwear" },
  { id: 17, sellerId: 3, title: "Vans Old Skool Classic", category: "footwear" },
  { id: 18, sellerId: 3, title: "New Balance 990v5 Made in USA", category: "footwear" },
  { id: 19, sellerId: 3, title: "Puma RS-X Reinvention", category: "footwear" },
  
  // HomeGoods Products (sellerId: 4)
  { id: 20, sellerId: 4, title: "Ninja Coffee Maker Pro", category: "appliances" },
  { id: 21, sellerId: 4, title: "KitchenAid Artisan Stand Mixer", category: "appliances" },
  { id: 22, sellerId: 4, title: "Dyson V15 Detect Cordless Vacuum", category: "cleaning" },
  { id: 23, sellerId: 4, title: "Le Creuset Dutch Oven 5.5qt", category: "cookware" },
  { id: 24, sellerId: 4, title: "Instant Pot Duo 7-in-1", category: "appliances" },
  
  // PhotoPro Products (sellerId: 5)
  { id: 25, sellerId: 5, title: "Canon EOS R6 Mark II", category: "cameras" },
  { id: 26, sellerId: 5, title: "Sony Alpha A7 IV", category: "cameras" },
  { id: 27, sellerId: 5, title: "Nikon Z9 Professional", category: "cameras" },
  { id: 28, sellerId: 5, title: "Canon RF 70-200mm f/2.8L IS USM", category: "cameras" },
  { id: 29, sellerId: 5, title: "Manfrotto MT190XPRO4 Tripod", category: "cameras" },
  { id: 30, sellerId: 5, title: "Godox AD600Pro Studio Flash", category: "cameras" }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;
    
    if (id) {
      // Handle seller by ID or seller products
      const sellerId = parseInt(id);
      const seller = mockSellers.find(s => s.id === sellerId);
      
      if (!seller) {
        return res.status(404).json({
          success: false,
          error: "Seller not found"
        });
      }

      // Check if this is a request for seller products
      if (req.url.includes('/products')) {
        // Get products from the products API that belong to this seller
        const sellerProducts = mockProducts.filter(
          product => product.sellerId === sellerId
        );
        
        return res.status(200).json({
          success: true,
          data: sellerProducts,
          total: sellerProducts.length,
          message: "Seller products retrieved successfully"
        });
      }
      
      // Return single seller
      res.status(200).json({
        success: true,
        data: seller
      });
    } else {
      // Return all sellers
      res.status(200).json({
        success: true,
        data: mockSellers,
        total: mockSellers.length
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}