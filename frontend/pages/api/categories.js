// Mock categories data for Vercel deployment
const mockCategories = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    description: "Latest electronic devices and gadgets",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    productCount: 15,
    subcategories: ["Smartphones", "Laptops", "Audio", "Cameras"]
  },
  {
    id: 2,
    name: "Smartphones",
    slug: "smartphones",
    description: "Mobile phones and accessories",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    productCount: 8,
    subcategories: ["Android", "iOS", "Accessories"]
  },
  {
    id: 3,
    name: "Laptops",
    slug: "laptops",
    description: "Portable computers for work and gaming",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    productCount: 6,
    subcategories: ["Gaming", "Business", "Student"]
  },
  {
    id: 4,
    name: "Audio",
    slug: "audio",
    description: "Headphones, speakers, and audio equipment",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    productCount: 4,
    subcategories: ["Headphones", "Speakers", "Microphones"]
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
