import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { Search, Filter, Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { apiService } from "../services/api";

export default function ProductsPage() {
  const router = useRouter();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("relevance");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Handle URL query parameters for category filtering and search
  useEffect(() => {
    if (router.query.category) {
      setSelectedCategory(router.query.category);
    }
    if (router.query.search) {
      setSearchQuery(router.query.search);
    }
  }, [router.query.category, router.query.search]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts();
      if (response.success && response.data) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      } else {
        console.error("Failed to load products:", response.error);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await apiService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
        const categoriesWithAll = [
          { id: "all", name: "All Categories", count: products.length },
          ...response.data,
        ];
        setAllCategories(categoriesWithAll);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  useEffect(() => {
    // Filter products based on search and filters
    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.seller.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter - fix the filtering logic
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
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
        // Keep original order for relevance
        break;
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, priceRange, sortBy, products]);

  // Update category counts when products change
  useEffect(() => {
    if (categories.length > 0 && products.length > 0) {
      const updatedCategories = categories.map((cat) => ({
        ...cat,
        count: products.filter((p) => p.category === cat.id).length,
      }));
      setCategories(updatedCategories);

      const categoriesWithAll = [
        { id: "all", name: "All Categories", count: products.length },
        ...updatedCategories,
      ];
      setAllCategories(categoriesWithAll);
    }
  }, [products, categories.length]);

  const addToCart = async (product) => {
    try {
      setAddingToCart(product.id);
      const response = await apiService.addToCart(product.id, 1, product);
      if (response.success) {
        // Show success message or update cart count
        console.log("Product added to cart successfully");
        // Dispatch event to update cart counter in navigation
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      } else {
        console.error("Failed to add to cart:", response.error);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setAddingToCart(null);
    }
  };

  const buyNow = async (product) => {
    try {
      // First add to cart
      const response = await apiService.addToCart(product.id, 1, product);
      if (response.success) {
        // Dispatch event to update cart counter in navigation
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        // Then redirect to checkout
        router.push("/checkout");
      } else {
        console.error("Failed to add to cart:", response.error);
      }
    } catch (err) {
      console.error("Error in buy now:", err);
    }
  };

  const toggleWishlist = (productId) => {
    const savedWishlist = localStorage.getItem("wishlist") || "[]";
    const wishlist = JSON.parse(savedWishlist);

    const existingIndex = wishlist.findIndex((item) => item.id === productId);

    if (existingIndex >= 0) {
      // Remove from wishlist
      wishlist.splice(existingIndex, 1);
      alert("Product removed from wishlist!");
    } else {
      // Add to wishlist
      const product = products.find((p) => p.id === productId);
      if (product) {
        wishlist.push(product);
        alert("Product added to wishlist!");
      }
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Products - SeezyMart</title>
        <meta
          name="description"
          content="Browse thousands of products from trusted sellers"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
            <p className="text-gray-600">
              Discover amazing products from trusted sellers
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
                  <Filter className="w-5 h-5 mr-2 text-blue-600" />
                  Filters
                </h3>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                  <div className="space-y-2">
                    {allCategories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={selectedCategory === category.id}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">
                          {category.name} ({category.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Price Range
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">$</span>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([
                            parseInt(e.target.value),
                            priceRange[1],
                          ])
                        }
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Min"
                      />
                      <span className="text-gray-600">to</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value),
                          ])
                        }
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {filteredProducts.length} of {products.length}{" "}
                  products
                </p>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`absolute top-2 right-2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors ${(() => {
                          const savedWishlist =
                            localStorage.getItem("wishlist") || "[]";
                          const wishlist = JSON.parse(savedWishlist);
                          return wishlist.findIndex(
                            (item) => item.id === product.id
                          ) >= 0
                            ? "text-red-500"
                            : "text-gray-600 hover:text-red-500";
                        })()}`}
                      >
                        <Heart
                          className={`w-4 h-4 ${(() => {
                            const savedWishlist =
                              localStorage.getItem("wishlist") || "[]";
                            const wishlist = JSON.parse(savedWishlist);
                            return wishlist.findIndex(
                              (item) => item.id === product.id
                            ) >= 0
                              ? "fill-current"
                              : "";
                          })()}`}
                        />
                      </button>
                    </div>
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
                          {product.views ? product.views.toLocaleString() : "0"}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => addToCart(product)}
                          disabled={addingToCart === product.id}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {addingToCart === product.id
                            ? "Adding..."
                            : "Add to Cart"}
                        </button>
                        <button
                          onClick={() => buyNow(product)}
                          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
