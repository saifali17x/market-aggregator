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

export default function SellersPage() {
  const topSellers = [
    {
      id: 1,
      name: "TechStore Pro",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop",
      rating: 4.8,
      reviewCount: 1247,
      verified: true,
      memberSince: "2020",
      totalSales: 15420,
      totalProducts: 342,
      location: "San Francisco, CA",
      website: "https://techstorepro.com",
      categories: ["Electronics", "Smartphones", "Laptops"],
      badges: ["Top Seller", "Fast Shipper", "Verified Store"],
      description:
        "Your trusted source for premium electronics and gadgets. We specialize in smartphones, laptops, headphones, and other electronic devices from top brands.",
      featuredProducts: [
        "iPhone 15 Pro Max",
        "Samsung Galaxy S24",
        "MacBook Pro M3",
      ],
    },
    {
      id: 2,
      name: "StyleHub",
      logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop",
      rating: 4.6,
      reviewCount: 892,
      verified: true,
      memberSince: "2019",
      totalSales: 12340,
      totalProducts: 234,
      location: "New York, NY",
      website: "https://stylehub.com",
      categories: ["Fashion", "Shoes", "Accessories"],
      badges: ["Fashion Expert", "Trend Setter", "Verified Store"],
      description:
        "Leading fashion retailer offering the latest trends in clothing, shoes, and accessories. We bring you style and quality from around the world.",
      featuredProducts: [
        "Nike Air Force 1",
        "Designer Handbags",
        "Premium Watches",
      ],
    },
    {
      id: 3,
      name: "Home Essentials",
      logo: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80&h=80&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop",
      rating: 4.7,
      reviewCount: 567,
      verified: true,
      memberSince: "2021",
      totalSales: 8900,
      totalProducts: 156,
      location: "Chicago, IL",
      website: "https://homeessentials.com",
      categories: ["Home & Garden", "Kitchen", "Furniture"],
      badges: ["Home Expert", "Quality Assured", "Fast Delivery"],
      description:
        "Everything you need for your home and garden. From kitchen appliances to outdoor furniture, we make your home beautiful and functional.",
      featuredProducts: [
        "Instant Pot Duo",
        "Garden Tools",
        "Kitchen Appliances",
      ],
    },
    {
      id: 4,
      name: "Sports Central",
      logo: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=80&h=80&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=200&fit=crop",
      rating: 4.5,
      reviewCount: 445,
      verified: true,
      memberSince: "2020",
      totalSales: 6780,
      totalProducts: 98,
      location: "Miami, FL",
      website: "https://sportscentral.com",
      categories: ["Sports", "Fitness", "Outdoor"],
      badges: ["Sports Expert", "Equipment Specialist", "Verified Store"],
      description:
        "Your one-stop shop for all things sports and fitness. We carry top brands in equipment, apparel, and accessories for every sport.",
      featuredProducts: [
        "Fitness Equipment",
        "Team Sports Gear",
        "Hiking Equipment",
      ],
    },
    {
      id: 5,
      name: "Book Haven",
      logo: "/api/placeholder/80/80",
      coverImage: "/api/placeholder/400/200",
      rating: 4.8,
      reviewCount: 1234,
      verified: true,
      memberSince: "2018",
      totalSales: 4560,
      totalProducts: 789,
      location: "Seattle, WA",
      website: "https://bookhaven.com",
      categories: ["Books", "E-readers", "Educational"],
      badges: ["Book Expert", "Educational Partner", "Verified Store"],
      description:
        "Your literary destination for books, e-readers, and educational materials. We believe in the power of knowledge and imagination.",
      featuredProducts: [
        "Kindle Paperwhite",
        "Best Sellers",
        "Educational Books",
      ],
    },
    {
      id: 6,
      name: "Beauty Box",
      logo: "/api/placeholder/80/80",
      coverImage: "/api/placeholder/400/200",
      rating: 4.4,
      reviewCount: 678,
      verified: true,
      memberSince: "2021",
      totalSales: 3450,
      totalProducts: 456,
      location: "Los Angeles, CA",
      website: "https://beautybox.com",
      categories: ["Beauty", "Skincare", "Health"],
      badges: ["Beauty Expert", "Natural Products", "Verified Store"],
      description:
        "Premium beauty and health products for your wellness journey. We curate the best products for your beauty and health needs.",
      featuredProducts: ["Skincare Sets", "Makeup Kits", "Health Supplements"],
    },
  ];

  const stats = [
    { icon: Users, value: "500+", label: "Active Sellers" },
    { icon: Package, value: "50K+", label: "Products Listed" },
    { icon: Star, value: "4.6", label: "Average Rating" },
    { icon: TrendingUp, value: "95%", label: "Satisfaction Rate" },
  ];

  return (
    <Layout>
      <Head>
        <title>Top Sellers - LuxLink</title>
        <meta
          name="description"
          content="Discover trusted sellers and stores on LuxLink"
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
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                      <div className="bg-white rounded-lg p-2">
                        <div className="bg-gray-200 w-16 h-16 rounded-lg"></div>
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
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
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
                        <span className="text-sm text-gray-600">
                          {seller.rating} ({seller.reviewCount})
                        </span>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div>Member since {seller.memberSince}</div>
                        <div>{seller.totalSales.toLocaleString()} sales</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {seller.description}
                    </p>

                    {/* Categories */}
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

                    {/* Badges */}
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

                    {/* Location and Website */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {seller.location}
                      </div>
                      <a
                        href={seller.website}
                        className="flex items-center text-blue-600 hover:text-blue-700"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="w-4 h-4 mr-1" />
                        Website
                      </a>
                    </div>

                    {/* Featured Products */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Featured Products
                      </h4>
                      <div className="flex space-x-2">
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

                    {/* CTA Buttons */}
                    <div className="flex space-x-3">
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
                href="/seller/register"
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
