import {
  Star,
  ExternalLink,
  Clock,
  Tag,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { trackClick } from "../services/clickTracking";

export default function LeadCard({ listing }) {
  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case "new":
        return "bg-green-100 text-green-800";
      case "used":
        return "bg-yellow-100 text-yellow-800";
      case "refurbished":
        return "bg-blue-100 text-blue-800";
      case "for-parts":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800";
      case "sold":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "reserved":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case "available":
        return "Available";
      case "sold":
        return "Sold";
      case "pending":
        return "Pending";
      case "reserved":
        return "Reserved";
      default:
        return availability;
    }
  };

  const handleContactSellerClick = async (event) => {
    event.preventDefault();

    if (listing.link) {
      await trackClick({
        url: listing.link,
        listingId: listing.id,
        sellerId: listing.sellerId,
        source: "contact_seller_button",
        openInNewTab: true,
      });
    }
  };

  const handleTagClick = (event) => {
    event.preventDefault();
    // Future: Add to favorites or wishlist
    console.log("Tag clicked for listing:", listing.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        <img
          src={
            listing.images && listing.images.length > 0
              ? listing.images[0]
              : "https://via.placeholder.com/300x300/F3F4F6/9CA3AF?text=No+Image"
          }
          alt={listing.title}
          className="w-full h-full object-cover"
        />

        {/* Discount Badge */}
        {listing.originalPrice && listing.price < listing.originalPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -
            {Math.round(
              ((listing.originalPrice - listing.price) /
                listing.originalPrice) *
                100
            )}
            %
          </div>
        )}

        {/* Condition Badge */}
        <div
          className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded ${getConditionColor(
            listing.condition
          )}`}
        >
          {listing.condition.charAt(0).toUpperCase() +
            listing.condition.slice(1)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
          {listing.title}
        </h3>

        {/* Category */}
        {listing.category && (
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {listing.category.name}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(listing.price, listing.currency)}
          </span>
          {listing.originalPrice && listing.originalPrice > listing.price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(listing.originalPrice, listing.currency)}
            </span>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {listing.seller?.name?.charAt(0) || "S"}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-700 font-medium block">
                {listing.seller?.name || "Unknown Seller"}
              </span>
              {listing.seller?.verified && (
                <span className="text-xs text-blue-600 flex items-center">
                  ✓ Verified
                </span>
              )}
            </div>
          </div>

          {listing.seller?.rating && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">
                {listing.seller.rating}
              </span>
              {listing.seller.totalReviews && (
                <span className="text-xs text-gray-500">
                  ({listing.seller.totalReviews})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Location */}
        {(listing.city || listing.state || listing.country) && (
          <div className="flex items-center space-x-1 mb-3 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>
              {[listing.city, listing.state, listing.country]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        )}

        {/* Availability & Date */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${getAvailabilityColor(
              listing.availabilityStatus
            )}`}
          >
            {getAvailabilityText(listing.availabilityStatus)}
          </span>

          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>
              {formatDate(listing.createdAt || listing.scrapedAt || new Date())}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {listing.link ? (
            <button
              onClick={handleContactSellerClick}
              className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Contact Seller</span>
              <MessageCircle className="w-4 h-4" />
            </button>
          ) : (
            <button className="flex-1 bg-gray-300 text-gray-500 text-sm font-medium py-2 px-4 rounded-md cursor-not-allowed">
              Contact Unavailable
            </button>
          )}

          <button
            onClick={handleTagClick}
            className="bg-gray-100 text-gray-700 p-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Tag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
