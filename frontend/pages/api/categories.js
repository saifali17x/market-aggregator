// Complete categories data from backend for Vercel deployment
const mockCategories = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    description: "Latest electronic devices and gadgets for every need",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    productCount: 10,
    subcategories: ["Smartphones", "Laptops", "Audio", "TVs", "Wearables", "Cameras", "Gaming", "Drones"]
  },
  {
    id: 2,
    name: "Smartphones",
    slug: "smartphones",
    description: "Mobile phones and accessories from top brands",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    productCount: 2,
    subcategories: ["Android", "iOS", "Accessories", "Cases", "Chargers"]
  },
  {
    id: 3,
    name: "Laptops",
    slug: "laptops",
    description: "Portable computers for work, gaming, and creativity",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    productCount: 2,
    subcategories: ["Gaming", "Business", "Student", "Professional", "Ultrabooks"]
  },
  {
    id: 4,
    name: "Audio",
    slug: "audio",
    description: "Headphones, speakers, and audio equipment",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    productCount: 1,
    subcategories: ["Headphones", "Speakers", "Microphones", "Studio Equipment"]
  },
  {
    id: 5,
    name: "TVs & Home Theater",
    slug: "tv-home-theater",
    description: "Smart TVs, home theater systems, and entertainment",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
    productCount: 1,
    subcategories: ["4K TVs", "Smart TVs", "Sound Systems", "Streaming Devices"]
  },
  {
    id: 6,
    name: "Wearables",
    slug: "wearables",
    description: "Smart watches, fitness trackers, and wearable tech",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop",
    productCount: 1,
    subcategories: ["Smart Watches", "Fitness Trackers", "Health Monitors"]
  },
  {
    id: 7,
    name: "Cameras & Photography",
    slug: "cameras-photography",
    description: "Professional cameras, lenses, and photography gear",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
    productCount: 1,
    subcategories: ["Mirrorless", "DSLR", "Lenses", "Accessories", "Studio Equipment"]
  },
  {
    id: 8,
    name: "Gaming",
    slug: "gaming",
    description: "Gaming consoles, accessories, and gaming gear",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=300&fit=crop",
    productCount: 1,
    subcategories: ["Consoles", "Games", "Accessories", "Peripherals", "VR"]
  },
  {
    id: 9,
    name: "Drones & Aerial",
    slug: "drones-aerial",
    description: "Professional and recreational drones for aerial photography",
    image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=400&h=300&fit=crop",
    productCount: 1,
    subcategories: ["Camera Drones", "Racing Drones", "Accessories", "Controllers"]
  },
  {
    id: 10,
    name: "Fashion",
    slug: "fashion",
    description: "Trendy clothing, footwear, and fashion accessories",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    productCount: 4,
    subcategories: ["Clothing", "Footwear", "Accessories", "Jewelry", "Bags"]
  },
  {
    id: 11,
    name: "Footwear",
    slug: "footwear",
    description: "Comfortable and stylish shoes for every occasion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    productCount: 1,
    subcategories: ["Running", "Casual", "Formal", "Sports", "Boots"]
  },
  {
    id: 12,
    name: "Clothing",
    slug: "clothing",
    description: "Trendy and comfortable clothing for all seasons",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
    productCount: 1,
    subcategories: ["Tops", "Bottoms", "Dresses", "Outerwear", "Activewear"]
  },
  {
    id: 13,
    name: "Accessories",
    slug: "accessories",
    description: "Fashion accessories to complete your look",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    productCount: 2,
    subcategories: ["Bags", "Jewelry", "Sunglasses", "Watches", "Belts"]
  },
  {
    id: 14,
    name: "Home & Garden",
    slug: "home-garden",
    description: "Everything you need to make your home beautiful and functional",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    productCount: 2,
    subcategories: ["Lighting", "Cleaning", "Kitchen", "Garden", "Furniture"]
  },
  {
    id: 15,
    name: "Smart Home",
    slug: "smart-home",
    description: "Automate and control your home with smart technology",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    productCount: 1,
    subcategories: ["Lighting", "Security", "Thermostats", "Entertainment", "Appliances"]
  },
  {
    id: 16,
    name: "Cleaning & Appliances",
    slug: "cleaning-appliances",
    description: "Keep your home clean and organized with quality appliances",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    productCount: 1,
    subcategories: ["Vacuums", "Kitchen", "Laundry", "Bathroom", "Storage"]
  }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { slug } = req.query;
    
    if (slug) {
      // Return specific category
      const category = mockCategories.find(c => c.slug === slug);
      if (category) {
        res.status(200).json({
          success: true,
          data: category
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Category not found"
        });
      }
    } else {
      // Return all categories
      res.status(200).json({
        success: true,
        data: mockCategories
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
