import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Star,
  MapPin,
  Shield,
  TrendingDown,
  Info,
} from "lucide-react";
import { trackClick } from "../services/clickTracking";

export default function PriceComparisonTable({ groupedProducts, searchQuery }) {
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [sortBy, setSortBy] = useState("relevance"); // relevance, price, listings
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const toggleGroup = (groupId) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleSellerClick = async (listing) => {
    if (listing.link) {
      await trackClick({
        url: listing.link,
        listingId: listing.id,
        sellerId: listing.sellerId,
        source: "price_comparison_table",
        openInNewTab: true,
      });
    }
  };

  const sortGroups = (groups) => {
    switch (sortBy) {
      case "price":
        return [...groups].sort((a, b) => {
          const minPriceA = a.priceRange.min || 0;
          const minPriceB = b.priceRange.min || 0;
          return minPriceA - minPriceB;
        });
      case "listings":
        return [...groups].sort((a, b) => b.totalListings - a.totalListings);
      case "relevance":
      default:
        return groups; // Already sorted by relevance
    }
  };

  const filteredGroups = showVerifiedOnly
    ? groupedProducts.filter((group) => group.verifiedSellers > 0)
    : groupedProducts;

  const sortedGroups = sortGroups(filteredGroups);

  const formatPrice = (price, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case "new":
        return "bg-green-100 text-green-800";
      case "used":
        return "bg-yellow-100 text-yellow-800";
      case "refurbished":
        return "bg-blue-100 text-blue-800";
      case "like_new":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlatformIcon = (platform) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes("amazon")) return "🛒";
    if (platformLower.includes("ebay")) return "📦";
    if (platformLower.includes("facebook")) return "📘";
    if (platformLower.includes("instagram")) return "📷";
    if (platformLower.includes("olx")) return "🏪";
    if (platformLower.includes("shopify")) return "🛍️";
    return "🌐";
  };

  if (sortedGroups.length === 0) {
    return (
      <div className="text-center py-12">
        <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-600">
          {searchQuery
            ? `No results found for "${searchQuery}". Try adjusting your search terms.`
            : "No products available for comparison at the moment."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showVerifiedOnly}
              onChange={(e) => setShowVerifiedOnly(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Verified sellers only</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="relevance">Relevance</option>
            <option value="price">Lowest Price</option>
            <option value="listings">Most Listings</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Found <strong>{sortedGroups.length}</strong> product groups with{" "}
          <strong>
            {sortedGroups.reduce((sum, group) => sum + group.totalListings, 0)}
          </strong>{" "}
          total listings
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Product Groups */}
      <div className="space-y-4">
        {sortedGroups.map((group, groupIndex) => {
          const isExpanded = expandedGroups.has(group.product.id);
          const cheapestListing = group.listings[0];
          const hasVerifiedSellers = group.verifiedSellers > 0;

          return (
            <div
              key={group.product.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Group Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        onClick={() => toggleGroup(group.product.id)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>

                      <h3 className="text-lg font-semibold text-gray-900">
                        {group.product.title}
                      </h3>

                      {group.product.brand && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {group.product.brand}
                        </span>
                      )}
                    </div>

                    {group.product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {group.product.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {group.platforms.join(", ")}
                      </span>

                      <span className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        {group.verifiedSellers} verified sellers
                      </span>

                      <span className="flex items-center gap-1">
                        <TrendingDown className="w-4 h-4" />
                        {group.listings.length} listings
                      </span>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {formatPrice(group.priceRange.min)}
                    </div>
                    {group.priceRange.max &&
                      group.priceRange.max > group.priceRange.min && (
                        <div className="text-sm text-gray-500">
                          to {formatPrice(group.priceRange.max)}
                        </div>
                      )}
                    <div className="text-xs text-gray-400 mt-1">
                      {group.totalListings} total listings
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Listings */}
              {isExpanded && (
                <div className="bg-gray-50">
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      All Listings
                    </h4>

                    <div className="space-y-3">
                      {group.listings.map((listing, listingIndex) => {
                        const isCheapest = listingIndex === 0;
                        const totalPrice = listing.total_price || listing.price;

                        return (
                          <div
                            key={listing.id}
                            className={`bg-white rounded-lg border p-4 ${
                              isCheapest
                                ? "border-green-300 bg-green-50"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                {/* Seller Info */}
                                <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold text-sm">
                                      {listing.seller?.name?.charAt(0) || "S"}
                                    </span>
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-gray-900">
                                        {listing.seller?.name ||
                                          "Unknown Seller"}
                                      </span>

                                      {listing.seller?.verified && (
                                        <Shield className="w-4 h-4 text-green-600" />
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                      <span>
                                        {getPlatformIcon(
                                          listing.seller?.platform || "unknown"
                                        )}
                                      </span>
                                      <span>
                                        {listing.seller?.platform ||
                                          "marketplace"}
                                      </span>

                                      {listing.seller?.rating && (
                                        <div className="flex items-center gap-1">
                                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                          <span>{listing.seller.rating}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Listing Details */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span
                                      className={`px-2 py-1 text-xs rounded-full ${getConditionColor(
                                        listing.condition
                                      )}`}
                                    >
                                      {listing.condition
                                        .charAt(0)
                                        .toUpperCase() +
                                        listing.condition.slice(1)}
                                    </span>

                                    {listing.location && (
                                      <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {listing.location}
                                      </span>
                                    )}
                                  </div>

                                  {listing.shipping_cost && (
                                    <div className="text-sm text-gray-500">
                                      +{formatPrice(listing.shipping_cost)}{" "}
                                      shipping
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Price and Action */}
                              <div className="text-right">
                                <div
                                  className={`text-xl font-bold ${
                                    isCheapest
                                      ? "text-green-600"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {formatPrice(totalPrice, listing.currency)}
                                </div>

                                {isCheapest && (
                                  <div className="text-xs text-green-600 font-medium">
                                    Best Price
                                  </div>
                                )}

                                <button
                                  onClick={() => handleSellerClick(listing)}
                                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Go to Seller
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
