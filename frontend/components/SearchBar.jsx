import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { apiService } from "../services/api";

export default function SearchBar({
  onSearch,
  initialValue = "",
  showFilters = false,
  onFilterChange,
}) {
  const [query, setQuery] = useState(initialValue);
  const [showFiltersPanel, setShowFiltersPanel] = useState(showFilters);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    condition: "",
    availability: "",
  });

  // Load categories from backend
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await apiService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        console.error("Failed to load categories:", response.error);
        // Fallback to basic categories if API fails
        setCategories([
          { id: "electronics", name: "Electronics" },
          { id: "clothing", name: "Clothing" },
          { id: "home-garden", name: "Home & Garden" },
          { id: "sports-outdoors", name: "Sports & Outdoors" },
          { id: "books-media", name: "Books & Media" },
          { id: "automotive", name: "Automotive" },
          { id: "health-beauty", name: "Health & Beauty" },
        ]);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      // Fallback to basic categories if API fails
      setCategories([
        { id: "electronics", name: "Electronics" },
        { id: "clothing", name: "Clothing" },
        { id: "home-garden", name: "Home & Garden" },
        { id: "sports-outdoors", name: "Sports & Outdoors" },
        { id: "books-media", name: "Books & Media" },
        { id: "automotive", name: "Automotive" },
        { id: "health-beauty", name: "Health & Beauty" },
      ]);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Update query when initialValue changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: "",
      minPrice: "",
      maxPrice: "",
      condition: "",
      availability: "",
    };
    setFilters(clearedFilters);
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="w-full">
      {/* Main Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, brands, or categories..."
            className="w-full pl-10 pr-20 py-3 text-lg text-gray-900 bg-white rounded-lg border-0 shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filter Toggle - Only show if not in search page */}
      {!showFilters && (
        <div className="mt-4 flex items-center justify-center">
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </button>
        </div>
      )}

      {/* Filters Panel */}
      {showFiltersPanel && (
        <div className="mt-4 bg-white rounded-lg p-4 shadow-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
              >
                <option value="">All Categories</option>
                {loadingCategories ? (
                  <option value="">Loading categories...</option>
                ) : (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                placeholder="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
              />
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                value={filters.condition}
                onChange={(e) =>
                  handleFilterChange("condition", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
              >
                <option value="">Any Condition</option>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="refurbished">Refurbished</option>
                <option value="for-parts">For Parts</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) =>
                  handleFilterChange("availability", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
              >
                <option value="">Any Availability</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="pending">Pending</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Clear Filters</span>
            </button>

            <button
              onClick={() => setShowFiltersPanel(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
