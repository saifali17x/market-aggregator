// Complete categories data from backend for Vercel deployment
const mockCategories = [
  {
    id: 1,
    slug: "electronics",
    name: "Electronics",
    icon: "📱",
    count: 6,
    color: "bg-gradient-to-r from-blue-600 to-indigo-700",
  },
  {
    id: 2,
    slug: "smartphones",
    name: "Smartphones",
    icon: "📱",
    count: 4,
    color: "bg-gradient-to-r from-blue-500 to-indigo-600",
  },
  {
    id: 3,
    slug: "laptops",
    name: "Laptops",
    icon: "💻",
    count: 3,
    color: "bg-gradient-to-r from-indigo-500 to-purple-600",
  },
  {
    id: 4,
    slug: "audio",
    name: "Audio",
    icon: "🎧",
    count: 2,
    color: "bg-gradient-to-r from-purple-500 to-pink-600",
  },
  {
    id: 5,
    slug: "tv",
    name: "TV & Home Theater",
    icon: "📺",
    count: 2,
    color: "bg-gradient-to-r from-pink-500 to-rose-600",
  },
  {
    id: 6,
    slug: "wearables",
    name: "Wearables",
    icon: "⌚",
    count: 2,
    color: "bg-gradient-to-r from-rose-500 to-red-600",
  },
  {
    id: 7,
    slug: "cameras",
    name: "Cameras",
    icon: "📷",
    count: 2,
    color: "bg-gradient-to-r from-red-500 to-orange-600",
  },
  {
    id: 8,
    slug: "gaming",
    name: "Gaming",
    icon: "🎮",
    count: 2,
    color: "bg-gradient-to-r from-orange-500 to-yellow-600",
  },
  {
    id: 9,
    slug: "drones",
    name: "Drones",
    icon: "🚁",
    count: 1,
    color: "bg-gradient-to-r from-yellow-500 to-green-600",
  },
  {
    id: 10,
    slug: "footwear",
    name: "Footwear",
    icon: "👟",
    count: 2,
    color: "bg-gradient-to-r from-green-500 to-teal-600",
  },
  {
    id: 11,
    slug: "clothing",
    name: "Clothing",
    icon: "👕",
    count: 3,
    color: "bg-gradient-to-r from-teal-500 to-cyan-600",
  },
  {
    id: 12,
    slug: "accessories",
    name: "Accessories",
    icon: "👜",
    count: 2,
    color: "bg-gradient-to-r from-cyan-500 to-blue-600",
  },
  {
    id: 13,
    slug: "lighting",
    name: "Smart Home",
    icon: "💡",
    count: 2,
    color: "bg-gradient-to-r from-blue-500 to-indigo-600",
  },
  {
    id: 14,
    slug: "cleaning",
    name: "Cleaning",
    icon: "🧹",
    count: 1,
    color: "bg-gradient-to-r from-indigo-500 to-purple-600",
  },
  {
    id: 15,
    slug: "fashion",
    name: "Fashion",
    icon: "👗",
    count: 4,
    color: "bg-gradient-to-r from-pink-500 to-rose-600",
  },
  {
    id: 16,
    slug: "home-garden",
    name: "Home & Garden",
    icon: "🏠",
    count: 3,
    color: "bg-gradient-to-r from-emerald-500 to-teal-600",
  },
];

export default function handler(req, res) {
  if (req.method === "GET") {
    const { id, slug } = req.query;

    if (id) {
      // Return specific category by ID
      const category = mockCategories.find((cat) => cat.id === parseInt(id));
      if (category) {
        res.status(200).json({
          success: true,
          data: category,
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Category not found",
        });
      }
    } else if (slug) {
      // Return specific category by slug
      const category = mockCategories.find((cat) => cat.slug === slug);
      if (category) {
        res.status(200).json({
          success: true,
          data: category,
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Category not found",
        });
      }
    } else {
      // Return all categories
      res.status(200).json({
        success: true,
        data: mockCategories,
        total: mockCategories.length,
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
