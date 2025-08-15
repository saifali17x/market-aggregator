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

  // Consolidated category mappings for consistent filtering and counting
  const categoryMappings = {
    smartphones: "smartphones",
    laptops: "laptops",
    audio: "audio",
    "tv-home-theater": "tv",
    wearables: "wearables",
    "cameras-photography": "cameras",
    gaming: "gaming",
    "drones-aerial": "drones",
    footwear: "footwear",
    clothing: "clothing",
    accessories: "accessories",
    "smart-home": "lighting",
    "cleaning-appliances": "cleaning",
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load products first, then categories
        await loadProducts();
        await loadCategories();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
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
      console.log("🔄 Loading products...");
      const response = await apiService.getProducts();
      console.log("📦 Products API response:", response);

      if (response.success && response.data) {
        console.log(`✅ Loaded ${response.data.length} products`);
        setProducts(response.data);
        setFilteredProducts(response.data);

        // Calculate category counts if categories are already loaded
        if (categories.length > 0) {
          calculateCategoryCounts(categories, response.data);
        }
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
      console.log("🔄 Loading categories...");
      const response = await apiService.getCategories();
      console.log("🏷️ Categories API response:", response);

      if (response.success && response.data) {
        console.log(`✅ Loaded ${response.data.length} categories`);
        setCategories(response.data);

        // Calculate category counts after categories are loaded
        if (products.length > 0) {
          calculateCategoryCounts(response.data, products);
        }
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  // Function to calculate category counts
  const calculateCategoryCounts = (categoriesData, productsData) => {
    console.log("🔄 Calculating category counts...");

    const updatedCategories = categoriesData.map((cat) => {
      let count = 0;

      // Count products for this category
      productsData.forEach((product) => {
        // Check if product belongs to main category
        if (product.category === cat.slug) {
          count++;
        }
        // Check if product belongs to subcategory
        else if (product.subcategory === cat.slug) {
          count++;
        }
        // Handle specific category mappings
        else {
          if (
            categoryMappings[cat.slug] &&
            product.subcategory === categoryMappings[cat.slug]
          ) {
            count++;
          }
        }
      });

      console.log(`🏷️ Category ${cat.slug}: ${count} products`);

      return {
        ...cat,
        count: count,
      };
    });

    setCategories(updatedCategories);

    const categoriesWithAll = [
      { id: "all", name: "All Categories", count: productsData.length },
      ...updatedCategories,
    ];
    setAllCategories(categoriesWithAll);

    console.log("✅ Category counts calculated successfully");
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

    // Category filter - fix the filtering logic to handle both categories and subcategories
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => {
        // Check if the selected category matches the product's main category
        if (product.category === selectedCategory) {
          return true;
        }

        // Check if the selected category matches the product's subcategory
        if (product.subcategory === selectedCategory) {
          return true;
        }

        // Check if the selected category maps to a subcategory
        if (
          categoryMappings[selectedCategory] &&
          product.subcategory === categoryMappings[selectedCategory]
        ) {
          return true;
        }

        return false;
      });
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

  // Category counts are now calculated directly in loadProducts and loadCategories
  // to avoid timing issues and ensure proper data flow

  const addToCart = async (product) => {
    try {
      setAddingToCart(product.id);
      const response = await apiService.addToCart(product.id, 1, product);
      if (response.success) {
        // Show success message or update cart count
        console.log("Product added to cart successfully");
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
                    {/* All Categories Option */}
                    <label
                      className={`flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                        selectedCategory === "all"
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value="all"
                        checked={selectedCategory === "all"}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span
                        className={`ml-3 font-medium ${
                          selectedCategory === "all"
                            ? "text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        All Categories
                      </span>
                      <span
                        className={`ml-auto text-sm px-2 py-1 rounded-full ${
                          selectedCategory === "all"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {products.length}
                      </span>
                    </label>

                    {/* Individual Categories */}
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className={`flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                          selectedCategory === category.id
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={selectedCategory === category.id}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span
                          className={`ml-3 flex items-center ${
                            selectedCategory === category.id
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          <span className="mr-2">{category.icon}</span>
                          {category.name}
                        </span>
                        <span
                          className={`ml-auto text-sm px-2 py-1 rounded-full ${
                            selectedCategory === category.id
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {category.count}
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

              {/* Mobile Category List (visible on small screens) */}
              <div className="mb-6 lg:hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Categories
                  </h3>
                  {selectedCategory !== "all" && (
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* All Categories Button */}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === "all"
                        ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All ({products.length})
                  </button>

                  {/* Individual Category Buttons */}
                  {loading ? (
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-gray-500">Loading...</span>
                    </div>
                  ) : (
                    categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                          selectedCategory === category.id
                            ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                        <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-xs font-bold">
                          {category.count}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Desktop Category List (visible on larger screens) */}
              <div className="mb-6 hidden lg:block">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Categories
                  </h3>
                  {selectedCategory !== "all" && (
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {/* All Categories Button */}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === "all"
                        ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                    }`}
                  >
                    All Categories ({products.length})
                  </button>

                  {/* Individual Category Buttons */}
                  {loading ? (
                    <div className="flex items-center space-x-2 px-4 py-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-gray-500">
                        Loading categories...
                      </span>
                    </div>
                  ) : (
                    categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                          selectedCategory === category.id
                            ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                        }`}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span>{category.name}</span>
                        <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
                          {category.count}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-gray-600">
                      Showing {filteredProducts.length} of {products.length}{" "}
                      products
                    </p>
                    {selectedCategory !== "all" && (
                      <p className="text-sm text-blue-600 font-medium">
                        Filtered by:{" "}
                        {categories.find((c) => c.id === selectedCategory)
                          ?.name || selectedCategory}
                      </p>
                    )}
                  </div>
                  {selectedCategory !== "all" && (
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
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
                        src={
                          product.image ||
                          product.imageUrl ||
                          product.thumbnail ||
                          product.originalImage ||
                          "/placeholder-product.jpg"
                        }
                        alt={
                          product.title ||
                          product.name ||
                          product.productName ||
                          "Product"
                        }
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src =
                            product.originalImage || "/placeholder-product.jpg";
                        }}
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
                        {product.title ||
                          product.name ||
                          product.productName ||
                          "Untitled Product"}
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
                          {product.views && typeof product.views === "number"
                            ? product.views.toLocaleString()
                            : "0"}
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
