import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Search, Filter, X, TrendingUp, Shield, Globe } from "lucide-react";
import SearchBar from "../components/SearchBar";
import PriceComparisonTable from "../components/PriceComparisonTable";

export default function SearchPage() {
  const router = useRouter();
  const [groupedProducts, setGroupedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    location: "",
    condition: "",
    verifiedOnly: false,
    platforms: [],
    sortBy: "relevance",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState(null);

  // Extract query parameters from URL
  useEffect(() => {
    const { q, category, minPrice, maxPrice, location, condition } =
      router.query;

    setFilters((prev) => ({
      ...prev,
      q: q || "",
      category: category || "",
      minPrice: minPrice || "",
      maxPrice: maxPrice || "",
      location: location || "",
      condition: condition || "",
    }));
  }, [router.query]);

  // Fetch data when filters change
  useEffect(() => {
    if (filters.q) {
      fetchGroupedProducts();
    }
  }, [
    filters.q,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.location,
    filters.condition,
    filters.verifiedOnly,
  ]);

  const fetchGroupedProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.q) queryParams.append("q", filters.q);
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
      if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
      if (filters.location) queryParams.append("location", filters.location);
      if (filters.condition) queryParams.append("condition", filters.condition);
      if (filters.verifiedOnly) queryParams.append("verifiedOnly", "true");

      const response = await fetch(
        `/api/listings/grouped?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setGroupedProducts(data.data || []);
      setStats(data.stats || null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    router.push({
      pathname: "/search",
      query: { ...router.query, q: query },
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      q: filters.q, // Keep search query
      category: "",
      minPrice: "",
      maxPrice: "",
      location: "",
      condition: "",
      verifiedOnly: false,
      platforms: [],
      sortBy: "relevance",
    });
  };

  const hasActiveFilters =
    filters.category ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.location ||
    filters.condition ||
    filters.verifiedOnly;

  const platformOptions = [
    { value: "amazon", label: "Amazon", icon: "🛒" },
    { value: "ebay", label: "eBay", icon: "📦" },
    { value: "facebook_marketplace", label: "Facebook", icon: "📘" },
    { value: "instagram", label: "Instagram", icon: "📷" },
    { value: "olx", label: "OLX", icon: "🏪" },
    { value: "shopify", label: "Shopify", icon: "🛍️" },
  ];

  const conditionOptions = [
    { value: "new", label: "New" },
    { value: "used", label: "Used" },
    { value: "refurbished", label: "Refurbished" },
    { value: "like_new", label: "Like New" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching for products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar
            onSearch={handleSearch}
            initialValue={filters.q}
            showFilters={false}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Platform Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Platforms
                </h3>
                <div className="space-y-2">
                  {platformOptions.map((platform) => (
                    <label
                      key={platform.value}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={filters.platforms.includes(platform.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleFilterChange("platforms", [
                              ...filters.platforms,
                              platform.value,
                            ]);
                          } else {
                            handleFilterChange(
                              "platforms",
                              filters.platforms.filter(
                                (p) => p !== platform.value
                              )
                            );
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {platform.icon} {platform.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Price Range
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Min
                    </label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange("minPrice", e.target.value)
                      }
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Max
                    </label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange("maxPrice", e.target.value)
                      }
                      placeholder="1000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Condition Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Condition
                </h3>
                <div className="space-y-2">
                  {conditionOptions.map((condition) => (
                    <label
                      key={condition.value}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="radio"
                        name="condition"
                        value={condition.value}
                        checked={filters.condition === condition.value}
                        onChange={(e) =>
                          handleFilterChange("condition", e.target.value)
                        }
                        className="border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {condition.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Location
                </h3>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                  placeholder="City, State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Verified Sellers Only */}
              <div className="mb-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly}
                    onChange={(e) =>
                      handleFilterChange("verifiedOnly", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Verified sellers only
                  </span>
                </label>
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Sort by
                </h3>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price">Lowest Price</option>
                  <option value="listings">Most Listings</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {filters.q
                    ? `Search Results for "${filters.q}"`
                    : "Browse Products"}
                </h1>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>

              {/* Stats */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.totalProducts || 0}
                    </div>
                    <div className="text-sm text-blue-800">Product Groups</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {stats.totalListings || 0}
                    </div>
                    <div className="text-sm text-green-800">Total Listings</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {stats.totalSellers || 0}
                    </div>
                    <div className="text-sm text-purple-800">
                      Active Sellers
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {stats.verifiedSellers || 0}
                    </div>
                    <div className="text-sm text-orange-800">
                      Verified Sellers
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-red-800">
                  <X className="w-5 h-5" />
                  <span>Error: {error}</span>
                </div>
                <button
                  onClick={fetchGroupedProducts}
                  className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Price Comparison Table */}
            <PriceComparisonTable
              groupedProducts={groupedProducts}
              searchQuery={filters.q}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
