import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import { Search, Filter, Star, ShoppingCart, Heart, Eye } from "lucide-react";

export default function SearchPage() {
  const router = useRouter();
  const { q: searchQuery } = router.query;
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    if (searchQuery) {
      // Mock search results for portfolio
      const mockProducts = [
        {
          id: 1,
          title: "iPhone 15 Pro Max - 256GB",
          price: 1199.99,
          originalPrice: 1299.99,
          image: "/api/placeholder/200/200",
          category: "electronics",
          seller: "TechStore Pro",
          rating: 4.8,
          reviewCount: 1247,
          inStock: true,
          discount: 8,
          views: 15420,
          sales: 89,
        },
        {
          id: 2,
          title: "Samsung Galaxy S24 Ultra",
          price: 1099.99,
          originalPrice: 1199.99,
          image: "/api/placeholder/200/200",
          category: "electronics",
          seller: "Mobile World",
          rating: 4.7,
          reviewCount: 892,
          inStock: true,
          discount: 8,
          views: 12890,
          sales: 67,
        },
        {
          id: 4,
          title: "Nike Air Force 1 '07",
          price: 89.99,
          originalPrice: 109.99,
          image: "/api/placeholder/200/200",
          category: "fashion",
          seller: "SneakerHead",
          rating: 4.6,
          reviewCount: 2341,
          inStock: true,
          discount: 18,
          views: 45670,
          sales: 234,
        },
        {
          id: 5,
          title: "Sony WH-1000XM5 Headphones",
          price: 349.99,
          originalPrice: 399.99,
          image: "/api/placeholder/200/200",
          category: "electronics",
          seller: "Audio Pro",
          rating: 4.8,
          reviewCount: 1567,
          inStock: true,
          discount: 13,
          views: 23450,
          sales: 123,
        },
      ];

      // Filter products based on search query
      const filtered = mockProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setProducts(filtered);
      setFilteredProducts(filtered);
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    // Apply filters
    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popularity":
        filtered.sort((a, b) => b.views - a.views);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceRange, sortBy]);

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "electronics", name: "Electronics" },
    { id: "fashion", name: "Fashion" },
    { id: "home-garden", name: "Home & Garden" },
    { id: "sports", name: "Sports" },
    { id: "books", name: "Books" },
    { id: "automotive", name: "Automotive" },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Search Results for "{searchQuery}" - MarketPlace</title>
        <meta
          name="description"
          content={`Search results for ${searchQuery}`}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Search Results for "{searchQuery}"
            </h1>
            <p className="text-gray-600">
              Found {filteredProducts.length} products
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h3>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories
                  </label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={selectedCategory === category.id}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popularity">Most Popular</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="lg:w-3/4">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      <div className="bg-gray-200 h-48 w-full"></div>
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">
                            ({product.reviewCount})
                          </span>
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.title}
                        </h3>

                        <p className="text-sm text-gray-600 mb-3">
                          Sold by{" "}
                          <span className="font-medium">{product.seller}</span>
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">
                              ${product.price}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            <Eye className="w-4 h-4 inline mr-1" />
                            {product.views.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </button>
                          <Link
                            href={`/product/${product.id}`}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-8">
                    No products match your search for "{searchQuery}"
                  </p>
                  <div className="space-x-4">
                    <Link
                      href="/products"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
                    >
                      Browse All Products
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setPriceRange([0, 1000]);
                        setSortBy("relevance");
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors inline-block"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
