import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import { Star, Users, Package, TrendingUp, Clock, MapPin, Globe, Mail, Phone, Shield, Award, Eye, ShoppingCart } from "lucide-react";

export default function SellerProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    if (id) {
      // Mock seller data for portfolio
      const mockSeller = {
        id: parseInt(id),
        name: "TechStore Pro",
        tagline: "Your trusted source for premium electronics and gadgets",
        description: "TechStore Pro has been serving customers since 2020 with the latest and greatest in technology. We specialize in smartphones, laptops, headphones, and other electronic devices from top brands like Apple, Samsung, Sony, and more. Our commitment to quality, competitive pricing, and exceptional customer service has made us a favorite among tech enthusiasts.",
        logo: "/api/placeholder/120/120",
        coverImage: "/api/placeholder/800/300",
        rating: 4.8,
        reviewCount: 1247,
        verified: true,
        memberSince: "2020",
        totalSales: 15420,
        totalProducts: 342,
        responseTime: "2 hours",
        location: "San Francisco, CA",
        website: "https://techstorepro.com",
        email: "support@techstorepro.com",
        phone: "+1 (555) 123-4567",
        categories: ["Electronics", "Smartphones", "Laptops", "Headphones", "Accessories"],
        badges: ["Top Seller", "Fast Shipper", "Verified Store", "Premium Partner"],
        analytics: {
          monthlyViews: 45670,
          monthlySales: 234,
          conversionRate: 0.51,
          avgOrderValue: 456.78,
          customerSatisfaction: 4.8,
          returnRate: 0.02
        },
        policies: {
          shipping: "Free shipping on orders over $50",
          returns: "30-day return policy",
          warranty: "Manufacturer warranty included",
          support: "24/7 customer support"
        }
      };

      const mockProducts = [
        {
          id: 1,
          title: "iPhone 15 Pro Max - 256GB",
          price: 1199.99,
          originalPrice: 1299.99,
          image: "/api/placeholder/200/200",
          category: "Electronics",
          rating: 4.8,
          reviewCount: 1247,
          inStock: true,
          discount: 8,
          views: 15420,
          sales: 89
        },
        {
          id: 2,
          title: "Samsung Galaxy S24 Ultra",
          price: 1099.99,
          originalPrice: 1199.99,
          image: "/api/placeholder/200/200",
          category: "Electronics",
          rating: 4.7,
          reviewCount: 892,
          inStock: true,
          discount: 8,
          views: 12890,
          sales: 67
        },
        {
          id: 3,
          title: "MacBook Pro 14" M3 Chip",
          price: 1999.99,
          originalPrice: 2199.99,
          image: "/api/placeholder/200/200",
          category: "Electronics",
          rating: 4.9,
          reviewCount: 567,
          inStock: true,
          discount: 9,
          views: 9870,
          sales: 45
        },
        {
          id: 4,
          title: "Sony WH-1000XM5 Headphones",
          price: 349.99,
          originalPrice: 399.99,
          image: "/api/placeholder/200/200",
          category: "Electronics",
          rating: 4.8,
          reviewCount: 1567,
          inStock: true,
          discount: 13,
          views: 23450,
          sales: 123
        },
        {
          id: 5,
          title: "AirPods Pro (2nd Generation)",
          price: 249.99,
          originalPrice: 279.99,
          image: "/api/placeholder/200/200",
          category: "Electronics",
          rating: 4.6,
          reviewCount: 892,
          inStock: true,
          discount: 11,
          views: 18760,
          sales: 156
        },
        {
          id: 6,
          title: "iPad Air (5th Generation)",
          price: 599.99,
          originalPrice: 649.99,
          image: "/api/placeholder/200/200",
          category: "Electronics",
          rating: 4.7,
          reviewCount: 445,
          inStock: true,
          discount: 8,
          views: 12340,
          sales: 78
        }
      ];

      setSeller(mockSeller);
      setProducts(mockProducts);
      setLoading(false);
    }
  }, [id]);

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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Seller not found</h3>
          <p className="text-gray-600">The seller you're looking for doesn't exist</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{seller.name} - MarketPlace</title>
        <meta name="description" content={seller.tagline} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Cover Image */}
        <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-700">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 h-full flex items-end pb-8">
            <div className="flex items-end space-x-6">
              <div className="bg-white rounded-lg p-2 shadow-lg">
                <div className="bg-gray-200 w-24 h-24 rounded-lg"></div>
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">{seller.name}</h1>
                <p className="text-lg opacity-90">{seller.tagline}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-16">
          {/* Seller Info Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Basic Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{seller.name}</h2>
                  {seller.verified && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                      Verified Store
                    </span>
                  )}
                </div>

                <p className="text-gray-700 mb-4">{seller.description}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-600">
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
                    {seller.totalProducts} products
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{seller.rating}</div>
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
                    {seller.reviewCount} reviews
                  </div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {seller.totalSales.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Sales</div>
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
                  { id: "analytics", label: "Analytics" }
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
                    {tab.count && <span className="ml-2 text-gray-400">({tab.count})</span>}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "products" && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div key={product.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow overflow-hidden">
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
                </div>
              )}

              {activeTab === "about" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {seller.categories.map((category) => (
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Badges & Achievements</h3>
                    <div className="flex flex-wrap gap-2">
                      {seller.badges.map((badge) => (
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-blue-600" />
                        <a href={seller.website} className="text-blue-600 hover:underline">
                          {seller.website}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-blue-600" />
                        {seller.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-blue-600" />
                        {seller.phone}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "policies" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Policy</h3>
                    <p className="text-gray-700">{seller.policies.shipping}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Return Policy</h3>
                    <p className="text-gray-700">{seller.policies.returns}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Warranty</h3>
                    <p className="text-gray-700">{seller.policies.warranty}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Support</h3>
                    <p className="text-gray-700">{seller.policies.support}</p>
                  </div>
                </div>
              )}

              {activeTab === "analytics" && (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">
                        {seller.analytics.monthlyViews.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Monthly Views</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <ShoppingCart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">
                        {seller.analytics.monthlySales}
                      </div>
                      <div className="text-sm text-gray-600">Monthly Sales</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {(seller.analytics.conversionRate * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Conversion Rate</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        ${seller.analytics.avgOrderValue}
                      </div>
                      <div className="text-sm text-gray-600">Avg. Order Value</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {seller.analytics.customerSatisfaction}
                      </div>
                      <div className="text-sm text-gray-600">Customer Satisfaction</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {(seller.analytics.returnRate * 100).toFixed(1)}%
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
