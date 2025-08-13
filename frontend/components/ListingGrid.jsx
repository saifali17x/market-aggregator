import { useState, useEffect } from "react";
import LeadCard from "./LeadCard";
import { Loader2, AlertCircle, Package } from "lucide-react";
import { generateTrackingUrl } from "../services/clickTracking";

export default function ListingGrid({
  listings = [],
  searchQuery,
  filters,
  onFilterChange,
}) {
  const [localListings, setLocalListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Mock data for demonstration when no listings provided
  const mockListings = [
    {
      id: "1",
      title: "iPhone 15 Pro Max - 256GB",
      price: 1199.99,
      currency: "USD",
      originalPrice: 1299.99,
      discount: 8,
      condition: "new",
      availabilityStatus: "available",
      images: ["https://via.placeholder.com/300x300/3B82F6/FFFFFF?text=iPhone"],
      category: {
        name: "Electronics",
        slug: "electronics",
      },
      seller: {
        name: "TechStore",
        rating: 4.8,
        totalReviews: 1247,
        verified: true,
        city: "New York",
        state: "NY",
      },
      link: "#",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Samsung Galaxy S24 Ultra - 512GB",
      price: 1099.99,
      currency: "USD",
      originalPrice: 1199.99,
      discount: 8,
      condition: "new",
      availabilityStatus: "available",
      images: ["https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Galaxy"],
      category: {
        name: "Electronics",
        slug: "electronics",
      },
      seller: {
        name: "MobileWorld",
        rating: 4.6,
        totalReviews: 892,
        verified: true,
        city: "Los Angeles",
        state: "CA",
      },
      link: "#",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "MacBook Air M3 - 13-inch",
      price: 1099.99,
      currency: "USD",
      originalPrice: 1199.99,
      discount: 8,
      condition: "new",
      availabilityStatus: "available",
      images: [
        "https://via.placeholder.com/300x300/EF4444/FFFFFF?text=MacBook",
      ],
      category: {
        name: "Electronics",
        slug: "electronics",
      },
      seller: {
        name: "ComputerStore",
        rating: 4.9,
        totalReviews: 2156,
        verified: true,
        city: "Chicago",
        state: "IL",
      },
      link: "#",
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      title: "Nike Air Max 270",
      price: 129.99,
      currency: "USD",
      originalPrice: 150.0,
      discount: 13,
      condition: "new",
      availabilityStatus: "available",
      images: ["https://via.placeholder.com/300x300/10B981/FFFFFF?text=Nike"],
      category: {
        name: "Clothing",
        slug: "clothing",
      },
      seller: {
        name: "SportStore",
        rating: 4.7,
        totalReviews: 634,
        verified: true,
        city: "Miami",
        state: "FL",
      },
      link: "#",
      createdAt: new Date().toISOString(),
    },
    {
      id: "5",
      title: "Sony WH-1000XM5 Headphones",
      price: 349.99,
      currency: "USD",
      originalPrice: 399.99,
      discount: 13,
      condition: "new",
      availabilityStatus: "available",
      images: ["https://via.placeholder.com/300x300/6366F1/FFFFFF?text=Sony"],
      category: {
        name: "Electronics",
        slug: "electronics",
      },
      seller: {
        name: "AudioStore",
        rating: 4.8,
        totalReviews: 445,
        verified: true,
        city: "Seattle",
        state: "WA",
      },
      link: "#",
      createdAt: new Date().toISOString(),
    },
    {
      id: "6",
      title: "Dell XPS 13 Plus Laptop",
      price: 1299.99,
      currency: "USD",
      originalPrice: 1499.99,
      discount: 13,
      condition: "new",
      availabilityStatus: "available",
      images: ["https://via.placeholder.com/300x300/059669/FFFFFF?text=Dell"],
      category: {
        name: "Electronics",
        slug: "electronics",
      },
      seller: {
        name: "TechStore",
        rating: 4.8,
        totalReviews: 1247,
        verified: true,
        city: "New York",
        state: "NY",
      },
      link: "#",
      createdAt: new Date().toISOString(),
    },
  ];

  // Add linkWithRef property to listings
  const addTrackingProperties = (listings) => {
    return listings.map((listing) => ({
      ...listing,
      linkWithRef: listing.link ? generateTrackingUrl(listing.link) : null,
    }));
  };

  useEffect(() => {
    // If listings are provided as props (from search page), use them
    if (listings && listings.length > 0) {
      const listingsWithTracking = addTrackingProperties(listings);
      setLocalListings(listingsWithTracking);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: listings.length,
        hasNextPage: false,
        hasPrevPage: false,
      });
      return;
    }

    // Otherwise, use mock data for home page
    if (searchQuery || Object.values(filters).some((value) => value !== "")) {
      fetchListings();
    } else {
      // Show mock data when no search
      const mockListingsWithTracking = addTrackingProperties(mockListings);
      setLocalListings(mockListingsWithTracking);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: mockListings.length,
        hasNextPage: false,
        hasPrevPage: false,
      });
    }
  }, [listings, searchQuery, filters]);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/listings?search=${searchQuery}&...`)
      // const data = await response.json()

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Filter mock data based on search and filters
      let filteredListings = mockListings.filter((listing) => {
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          if (
            !listing.title.toLowerCase().includes(searchLower) &&
            !listing.category.name.toLowerCase().includes(searchLower)
          ) {
            return false;
          }
        }

        if (filters.category && listing.category.slug !== filters.category) {
          return false;
        }

        if (filters.minPrice && listing.price < parseFloat(filters.minPrice)) {
          return false;
        }

        if (filters.maxPrice && listing.price > parseFloat(filters.maxPrice)) {
          return false;
        }

        if (filters.condition && listing.condition !== filters.condition) {
          return false;
        }

        if (
          filters.availability &&
          listing.availabilityStatus !== filters.availability
        ) {
          return false;
        }

        return true;
      });

      const filteredListingsWithTracking =
        addTrackingProperties(filteredListings);
      setLocalListings(filteredListingsWithTracking);
      setPagination({
        currentPage: 1,
        totalPages: Math.ceil(filteredListings.length / 12),
        totalItems: filteredListings.length,
        hasNextPage: filteredListings.length > 12,
        hasPrevPage: false,
      });
    } catch (err) {
      setError("Failed to fetch listings. Please try again.");
      console.error("Error fetching listings:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading listings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="ml-2 text-red-600">{error}</span>
      </div>
    );
  }

  if (localListings.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No listings found
        </h3>
        <p className="text-gray-600">
          {searchQuery
            ? `No results found for "${searchQuery}". Try adjusting your search terms or filters.`
            : "No listings available at the moment. Please check back later."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Results Summary */}
      <div className="mb-6 text-sm text-gray-600">
        Showing {localListings.length} of {pagination.totalItems} listings
        {searchQuery && ` for "${searchQuery}"`}
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {localListings.map((listing) => (
          <LeadCard key={listing.id} listing={listing} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          <button
            onClick={() => {
              /* Handle previous page */
            }}
            disabled={!pagination.hasPrevPage}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="px-3 py-2 text-sm text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() => {
              /* Handle next page */
            }}
            disabled={!pagination.hasNextPage}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
