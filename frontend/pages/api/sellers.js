// Mock sellers data for Vercel deployment
const mockSellers = [
  {
    id: 1,
    name: "TechStore Pro",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    description: "Premium electronics retailer with the latest tech innovations",
    rating: 4.8,
    reviewCount: 1247,
    memberSince: "2020",
    totalSales: 15420,
    location: "San Francisco, CA",
    website: "https://techstorepro.com",
    categories: ["Electronics", "Computers", "Smartphones"],
    badges: ["Verified Store", "Premium Seller", "Fast Shipping"],
    featuredProducts: ["iPhone 15 Pro Max", "Dell XPS 13 Plus", "Sony WH-1000XM5"]
  },
  {
    id: 2,
    name: "Mobile World",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    description: "Your one-stop shop for all mobile devices and accessories",
    rating: 4.6,
    reviewCount: 892,
    memberSince: "2019",
    totalSales: 9876,
    location: "New York, NY",
    website: "https://mobileworld.com",
    categories: ["Electronics", "Smartphones", "Mobile Accessories"],
    badges: ["Mobile Expert", "Fast Delivery", "Verified Store"],
    featuredProducts: ["Samsung Galaxy S24 Ultra", "Mobile Cases", "Wireless Chargers"]
  },
  {
    id: 3,
    name: "Apple Store",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    description: "Official Apple products and premium accessories",
    rating: 4.9,
    reviewCount: 2341,
    memberSince: "2018",
    totalSales: 25678,
    location: "Cupertino, CA",
    website: "https://apple.com",
    categories: ["Electronics", "Apple Products", "Accessories"],
    badges: ["Official Store", "Premium Quality", "Expert Support"],
    featuredProducts: ["MacBook Pro M3", "iPhone 15 Pro", "iPad Pro"]
  }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;
    
    if (id) {
      // Return specific seller
      const seller = mockSellers.find(s => s.id === parseInt(id));
      if (seller) {
        res.status(200).json({
          success: true,
          data: seller
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Seller not found"
        });
      }
    } else {
      // Return all sellers
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
