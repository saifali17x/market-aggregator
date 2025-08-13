import { useState, useEffect } from "react";
import { Search, TrendingUp, Tag, MapPin, DollarSign } from "lucide-react";
import SearchBar from "../components/SearchBar";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [suggestedCategories, setSuggestedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch suggested categories
    fetchSuggestedCategories();
  }, []);

  const fetchSuggestedCategories = async () => {
    try {
      const response = await fetch("/api/listings/categories/popular");
      if (response.ok) {
        const data = await response.json();
        setSuggestedCategories(data.data.slice(0, 6)); // Show top 6 categories
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryClick = (categorySlug) => {
    router.push(`/search?category=${encodeURIComponent(categorySlug)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find the Best
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {" "}
              Deals{" "}
            </span>
            Online
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Search across multiple marketplaces to discover amazing products at
            unbeatable prices
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">10K+</h3>
            <p className="text-gray-600">Products Available</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">50+</h3>
            <p className="text-gray-600">Marketplaces</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">$2M+</h3>
            <p className="text-gray-600">In Savings</p>
          </div>
        </div>

        {/* Suggested Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Popular Categories
          </h2>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {suggestedCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className="group p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:from-blue-600 group-hover:to-indigo-700 transition-colors">
                      <Tag className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.listingCount} items
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Smart Search
              </h3>
            </div>
            <p className="text-gray-600">
              Find exactly what you're looking for with our intelligent search
              that understands context and suggests relevant results.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Local & Global
              </h3>
            </div>
            <p className="text-gray-600">
              Discover deals from local sellers and global marketplaces, all in
              one convenient search.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Are You a Seller?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              List your products on our marketplace and reach thousands of
              potential customers. Our verification process ensures quality and
              trust for all users.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/seller/onboard")}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Selling
              </button>
              <button
                onClick={() => router.push("/search")}
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Browse Listings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
