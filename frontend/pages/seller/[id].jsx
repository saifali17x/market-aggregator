import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import {
  Star,
  Users,
  Package,
  TrendingUp,
  Clock,
  MapPin,
  Globe,
  Mail,
  Phone,
  Shield,
  Award,
  Eye,
  ShoppingCart,
} from "lucide-react";
import { apiService } from "../../services/api";

export default function SellerProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    console.log("🔄 Seller page useEffect triggered");
    console.log("📋 Router query:", router.query);
    console.log("🆔 ID from router:", id);
    console.log("🆔 ID type:", typeof id);
    console.log("🔄 Router is ready:", router.isReady);

    // Wait for router to be ready and have query parameters
    if (router.isReady && id) {
      console.log("✅ Router ready and ID exists, calling loadSellerData");
      loadSellerData();
    } else if (!router.isReady) {
      console.log("⏳ Router not ready yet, waiting...");
    } else {
      console.log("❌ No ID found in router query");
    }
  }, [id, router.isReady, router.query]);

  const loadSellerData = async () => {
    try {
      setLoading(true);
      console.log("🔄 Starting to load seller data for ID:", id);

      // Load seller data
      console.log("📞 Calling getSeller API with ID:", parseInt(id));
      const sellerResponse = await apiService.getSeller(parseInt(id));
      console.log("📦 Seller API response:", sellerResponse);

      if (sellerResponse.success && sellerResponse.data) {
        console.log("✅ Seller loaded successfully:", sellerResponse.data.name);
        setSeller(sellerResponse.data);
      } else {
        console.error("❌ Failed to load seller:", sellerResponse.error);
        console.error("❌ Full response:", sellerResponse);
      }

      // Load seller products
      console.log("🔄 Loading seller products for seller ID:", id);
      const productsResponse = await apiService.getSellerProducts(parseInt(id));
      console.log("📦 Seller products API response:", productsResponse);

      if (productsResponse.success && productsResponse.data) {
        console.log(
          `✅ Loaded ${productsResponse.data.length} seller products`
        );
        setProducts(productsResponse.data);
      } else {
        console.error(
          "❌ Failed to load seller products:",
          productsResponse.error
        );
        setProducts([]);
      }
    } catch (err) {
      console.error("❌ Error loading seller data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Utility function for safe number formatting
  const safeToLocaleString = (value, fallback = "0") => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === "number" && !isNaN(value)) {
      return value.toLocaleString();
    }
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        return parsed.toLocaleString();
      }
    }
    return fallback;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Seller not found
          </h3>
          <p className="text-gray-600">
            The seller you're looking for doesn't exist or failed to load
          </p>
          <div className="mt-4">
            <Link
              href="/sellers"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              ← Back to Sellers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{seller.name} - MarketPlace</title>
        <meta name="description" content={seller.description} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Cover Image */}
        <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-700">
          {seller.coverImage && (
            <img
              src={seller.coverImage}
              alt={`${seller.name} cover`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 h-full flex items-end pb-8">
            <div className="flex items-end space-x-6">
              <div className="bg-white rounded-lg p-2 shadow-lg">
                {seller.logo ? (
                  <img
                    src={seller.logo}
                    alt={`${seller.name} logo`}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 w-24 h-24 rounded-lg flex items-center justify-center text-2xl text-gray-500">
                    {seller.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">{seller.name}</h1>
                <p className="text-lg opacity-90">{seller.tagline}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-16">
          {/* Seller Info Card - FIXED LAYOUT */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Info - FIXED WIDTH */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {seller.name}
                  </h2>
                  {seller.verified && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                      Verified Store
                    </span>
                  )}
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  {seller.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {seller.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Member since {seller.memberSince}
                  </div>
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    {seller.products || seller.totalProducts} products
                  </div>
                </div>
              </div>

              {/* Stats - FIXED LAYOUT TO PREVENT CUTOFF */}
              <div className="lg:col-span-1">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {seller.rating}
                    </div>
                    <div className="flex items-center justify-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(seller.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      {safeToLocaleString(seller.reviewCount)} reviews
                    </div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {safeToLocaleString(seller.totalSales)}
                    </div>
                    <div className="text-sm text-gray-600">Total Sales</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: "products", label: "Products", count: products.length },
                  { id: "about", label: "About" },
                  { id: "policies", label: "Policies" },
                  { id: "analytics", label: "Analytics" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                    {tab.count && (
                      <span className="ml-2 text-gray-400">({tab.count})</span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "products" && (
                <div>
                  {products.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No products found
                      </h3>
                      <p className="text-gray-600">
                        This seller hasn't added any products yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow overflow-hidden"
                        >
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.title || product.name || "Product"}
                              className="h-48 w-full object-cover"
                              onError={(e) => {
                                e.target.src = "/placeholder-product.jpg";
                              }}
                            />
                          ) : (
                            <div className="bg-gray-200 h-48 w-full flex items-center justify-center text-gray-500">
                              No Image
                            </div>
                          )}
                          <div className="p-4">
                            <div className="flex items-center mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(product.rating || 0)
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600 ml-2">
                                ({safeToLocaleString(product.reviewCount)})
                              </span>
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                              {product.title ||
                                product.name ||
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
                                {safeToLocaleString(product.views)}
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
                  )}
                </div>
              )}

              {activeTab === "about" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(seller.categories || []).map((category) => (
                        <span
                          key={category}
                          className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Badges & Achievements
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(seller.badges || []).map((badge) => (
                        <span
                          key={badge}
                          className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full flex items-center"
                        >
                          <Award className="w-4 h-4 mr-1" />
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Contact Information
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      {seller.website && (
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2 text-blue-600" />
                          <a
                            href={seller.website}
                            className="text-blue-600 hover:underline"
                          >
                            {seller.website}
                          </a>
                        </div>
                      )}
                      {seller.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-blue-600" />
                          {seller.email}
                        </div>
                      )}
                      {seller.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-blue-600" />
                          {seller.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "policies" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Shipping Policy
                    </h3>
                    <p className="text-gray-700">
                      {seller.policies?.shipping ||
                        "Standard shipping within 3-5 business days. Free shipping on orders over $50."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Return Policy
                    </h3>
                    <p className="text-gray-700">
                      {seller.policies?.returns ||
                        "30-day return policy for unused items in original packaging. Return shipping costs may apply."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Warranty
                    </h3>
                    <p className="text-gray-700">
                      {seller.policies?.warranty ||
                        "1-year manufacturer warranty on all products. Extended warranty options available."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Customer Support
                    </h3>
                    <p className="text-gray-700">
                      {seller.policies?.support ||
                        "24/7 customer support via email and phone. Response time within 2-4 hours during business days."}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "analytics" && (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">
                        {safeToLocaleString(
                          seller.analytics?.monthlyViews || 12500
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Monthly Views</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <ShoppingCart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">
                        {seller.analytics?.monthlySales || 89}
                      </div>
                      <div className="text-sm text-gray-600">Monthly Sales</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {(
                          (seller.analytics?.conversionRate || 0.15) * 100
                        ).toFixed(1)}
                        %
                      </div>
                      <div className="text-sm text-gray-600">
                        Conversion Rate
                      </div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        ${seller.analytics?.avgOrderValue || 125}
                      </div>
                      <div className="text-sm text-gray-600">
                        Avg. Order Value
                      </div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {seller.analytics?.customerSatisfaction || 4.8}
                      </div>
                      <div className="text-sm text-gray-600">
                        Customer Satisfaction
                      </div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {((seller.analytics?.returnRate || 0.08) * 100).toFixed(
                          1
                        )}
                        %
                      </div>
                      <div className="text-sm text-gray-600">Return Rate</div>
                    </div>
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
