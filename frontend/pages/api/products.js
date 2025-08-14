// Mock products data for Vercel deployment
const mockProducts = [
  {
    id: 1,
    title: "iPhone 15 Pro Max - 256GB - Natural Titanium",
    price: 1199.99,
    originalPrice: 1299.99,
    discount: 8,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop",
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "Apple",
    rating: 4.8,
    reviewCount: 1247,
    inStock: true,
    seller: "TechStore Pro",
    description: "Experience the future of mobile technology with the iPhone 15 Pro Max."
  },
  {
    id: 2,
    title: "Samsung Galaxy S24 Ultra - 256GB",
    price: 1099.99,
    originalPrice: 1199.99,
    discount: 8,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "Samsung",
    rating: 4.7,
    reviewCount: 892,
    inStock: true,
    seller: "Mobile World",
    description: "The most powerful Galaxy smartphone with AI capabilities."
  },
  {
    id: 3,
    title: "MacBook Pro 14 M3 Chip - 512GB",
    price: 1999.99,
    originalPrice: 2199.99,
    discount: 9,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
    category: "Electronics",
    subcategory: "Laptops",
    brand: "Apple",
    rating: 4.9,
    reviewCount: 1567,
    inStock: true,
    seller: "TechStore Pro",
    description: "Revolutionary performance with the M3 chip."
  },
  {
    id: 4,
    title: "Dell XPS 13 Plus - 512GB",
    price: 1499.99,
    originalPrice: 1699.99,
    discount: 12,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=600&fit=crop",
    category: "Electronics",
    subcategory: "Laptops",
    brand: "Dell",
    rating: 4.6,
    reviewCount: 743,
    inStock: true,
    seller: "TechStore Pro",
    description: "Premium ultrabook with stunning display."
  },
  {
    id: 5,
    title: "Sony WH-1000XM5 Wireless Headphones",
    price: 349.99,
    originalPrice: 399.99,
    discount: 13,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
    category: "Electronics",
    subcategory: "Audio",
    brand: "Sony",
    rating: 4.8,
    reviewCount: 2341,
    inStock: true,
    seller: "Audio Haven",
    description: "Industry-leading noise cancellation technology."
  }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;
    
    if (id) {
      // Return specific product
      const product = mockProducts.find(p => p.id === parseInt(id));
      if (product) {
        res.status(200).json({
          success: true,
          data: product
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Product not found"
        });
      }
    } else {
      // Return all products
      res.status(200).json({
        success: true,
        data: mockProducts,
        total: mockProducts.length
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
