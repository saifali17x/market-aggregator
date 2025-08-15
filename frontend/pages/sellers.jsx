import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import {
  Star,
  Users,
  Package,
  TrendingUp,
  Shield,
  Award,
  MapPin,
  Globe,
} from "lucide-react";
import { apiService } from "../services/api";

export default function SellersPage() {
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSellers();
      if (response.success && response.data) {
        setTopSellers(response.data);
      } else {
        console.error("Failed to load sellers:", response.error);
      }
    } catch (err) {
      console.error("Error loading sellers:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const stats = [
    { icon: Users, value: "500+", label: "Active Sellers" },
    { icon: Package, value: "50K+", label: "Products Listed" },
    { icon: Star, value: "4.6", label: "Average Rating" },
    { icon: TrendingUp, value: "95%", label: "Satisfaction Rate" },
  ];

  return (
    <Layout>
      <Head>
        <title>Top Sellers - SeezyMart</title>
        <meta
          name="description"
          content="Discover trusted sellers and stores on SeezyMart"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Top Sellers & Stores
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Shop from our verified and trusted sellers who consistently
                deliver quality products and exceptional customer service.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sellers Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {topSellers.map((seller) => (
                <div
                  key={seller.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Cover Image */}
                  <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                    {seller.coverImage && (
                      <img
                        src={seller.coverImage}
                        alt={`${seller.name} cover`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                      <div className="bg-white rounded-lg p-2">
                        {seller.logo ? (
                          <img
                            src={seller.logo}
                            alt={`${seller.name} logo`}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="bg-gray-200 w-16 h-16 rounded-lg flex items-center justify-center text-lg text-gray-500 font-bold">
                            {seller.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="text-white">
                        <h3 className="text-xl font-bold">{seller.name}</h3>
                        {seller.verified && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            Verified Store
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Rating and Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(seller.rating || 0)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          {seller.rating || 0} (
                          {seller.reviewCount
                            ? seller.reviewCount.toLocaleString()
                            : 0}
                          )
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 text-right sm:text-left">
                        {seller.memberSince && (
                          <div className="font-medium">
                            Member since {seller.memberSince}
                          </div>
                        )}
                        {seller.totalSales && (
                          <div className="text-blue-600 font-semibold">
                            {seller.totalSales.toLocaleString()} sales
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {seller.description && (
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {seller.description}
                      </p>
                    )}

                    {/* Categories */}
                    {seller.categories && seller.categories.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {seller.categories.map((category) => (
                            <span
                              key={category}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Badges */}
                    {seller.badges && seller.badges.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {seller.badges.map((badge) => (
                            <span
                              key={badge}
                              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center"
                            >
                              <Award className="w-3 h-3 mr-1" />
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Location and Website */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 mb-4 space-y-2 sm:space-y-0">
                      {seller.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {seller.location}
                        </div>
                      )}
                      {seller.website && (
                        <a
                          href={seller.website}
                          className="flex items-center text-blue-600 hover:text-blue-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe className="w-4 h-4 mr-1" />
                          Website
                        </a>
                      )}
                    </div>

                    {/* Featured Products */}
                    {seller.featuredProducts &&
                      seller.featuredProducts.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Featured Products
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {seller.featuredProducts.map((product, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                              >
                                {product}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <Link
                        href={`/seller/${seller.id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
                      >
                        View Store
                      </Link>
                      <Link
                        href={`/products?seller=${seller.id}`}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-2 px-4 rounded-lg font-medium transition-colors"
                      >
                        Browse Products
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Become a Seller */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Want to Become a Seller?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join our community of successful sellers and start your business
              journey. We provide the tools, support, and platform you need to
              succeed.
            </p>
            <div className="space-x-4">
              <Link
                href="/seller/onboard"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Start Selling Today
              </Link>
              <Link
                href="/seller/benefits"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors inline-block"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Trust & Security */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Trust Our Sellers?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Verified & Trusted
                </h3>
                <p className="text-gray-600">
                  All sellers go through our rigorous verification process to
                  ensure quality and trustworthiness.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Quality Assured
                </h3>
                <p className="text-gray-600">
                  We maintain high standards and monitor seller performance to
                  ensure consistent quality.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Customer Support
                </h3>
                <p className="text-gray-600">
                  Our dedicated support team is here to help with any questions
                  or concerns about your purchases.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
