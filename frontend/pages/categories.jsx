import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import { ShoppingBag, TrendingUp, Star, Users } from "lucide-react";

export default function CategoriesPage() {
  const categories = [
    {
      id: "electronics",
      name: "Electronics",
      icon: "📱",
      description: "Latest gadgets, smartphones, laptops, and tech accessories",
      productCount: 1247,
      topSeller: "TechStore Pro",
      avgRating: 4.6,
      featuredProducts: [
        "iPhone 15 Pro Max",
        "Samsung Galaxy S24",
        "MacBook Pro M3",
        "Sony WH-1000XM5"
      ]
    },
    {
      id: "fashion",
      name: "Fashion & Apparel",
      icon: "👗",
      description: "Trendy clothing, shoes, accessories, and style essentials",
      productCount: 892,
      topSeller: "StyleHub",
      avgRating: 4.4,
      featuredProducts: [
        "Nike Air Force 1",
        "Adidas Ultraboost",
        "Designer Handbags",
        "Premium Watches"
      ]
    },
    {
      id: "home-garden",
      name: "Home & Garden",
      icon: "🏠",
      description: "Everything for your home, garden, and outdoor living",
      productCount: 567,
      topSeller: "Home Essentials",
      avgRating: 4.5,
      featuredProducts: [
        "Instant Pot Duo",
        "Garden Tools",
        "Kitchen Appliances",
        "Furniture"
      ]
    },
    {
      id: "sports",
      name: "Sports & Outdoors",
      icon: "⚽",
      description: "Sports equipment, outdoor gear, and fitness essentials",
      productCount: 423,
      topSeller: "Sports Central",
      avgRating: 4.3,
      featuredProducts: [
        "Fitness Equipment",
        "Camping Gear",
        "Team Sports",
        "Hiking Equipment"
      ]
    },
    {
      id: "books",
      name: "Books & Media",
      icon: "📚",
      description: "Books, e-readers, educational materials, and entertainment",
      productCount: 789,
      topSeller: "Book Haven",
      avgRating: 4.7,
      featuredProducts: [
        "Kindle Paperwhite",
        "Best Sellers",
        "Educational Books",
        "Audiobooks"
      ]
    },
    {
      id: "automotive",
      name: "Automotive",
      icon: "🚗",
      description: "Car parts, accessories, tools, and automotive care",
      productCount: 234,
      topSeller: "Auto Parts Pro",
      avgRating: 4.2,
      featuredProducts: [
        "Car Accessories",
        "Maintenance Tools",
        "Performance Parts",
        "Car Care Products"
      ]
    },
    {
      id: "beauty",
      name: "Beauty & Health",
      icon: "💄",
      description: "Cosmetics, skincare, health products, and wellness items",
      productCount: 456,
      topSeller: "Beauty Box",
      avgRating: 4.4,
      featuredProducts: [
        "Skincare Sets",
        "Makeup Kits",
        "Health Supplements",
        "Wellness Products"
      ]
    },
    {
      id: "toys",
      name: "Toys & Games",
      icon: "🎮",
      description: "Toys, games, puzzles, and entertainment for all ages",
      productCount: 345,
      topSeller: "Toy World",
      avgRating: 4.6,
      featuredProducts: [
        "Board Games",
        "Educational Toys",
        "Video Games",
        "Collectibles"
      ]
    }
  ];

  const stats = [
    { icon: ShoppingBag, value: "5,000+", label: "Total Products" },
    { icon: Users, value: "500+", label: "Active Sellers" },
    { icon: Star, value: "4.5", label: "Average Rating" },
    { icon: TrendingUp, value: "98%", label: "Customer Satisfaction" }
  ];

  return (
    <Layout>
      <Head>
        <title>Product Categories - MarketPlace</title>
        <meta name="description" content="Explore all product categories on MarketPlace" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Shop by Category
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover amazing products across all categories, from electronics to fashion, 
                home & garden to sports, and everything in between.
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

        {/* Categories Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-6">
                    {/* Category Header */}
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">{category.icon}</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {category.description}
                      </p>
                    </div>

                    {/* Category Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-lg font-bold text-blue-600">
                          {category.productCount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Products</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-lg font-bold text-green-600">
                          {category.avgRating}
                        </div>
                        <div className="text-sm text-gray-600">Rating</div>
                      </div>
                    </div>

                    {/* Top Seller */}
                    <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Top Seller</div>
                      <div className="font-medium text-blue-900">{category.topSeller}</div>
                    </div>

                    {/* Featured Products */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Featured Products</h4>
                      <ul className="space-y-1">
                        {category.featuredProducts.map((product, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            {product}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/category/${category.id}`}
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Browse {category.name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Category */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Category: Electronics</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Discover the latest in technology with our comprehensive electronics category. 
                From smartphones to laptops, headphones to smart home devices.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">📱</div>
                <h3 className="text-xl font-semibold mb-2">Smartphones</h3>
                <p className="opacity-90">Latest models from top brands</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">💻</div>
                <h3 className="text-xl font-semibold mb-2">Laptops</h3>
                <p className="opacity-90">Powerful computing solutions</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">🎧</div>
                <h3 className="text-xl font-semibold mb-2">Audio</h3>
                <p className="opacity-90">Premium sound experiences</p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                href="/category/electronics"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Explore Electronics
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our comprehensive search and filtering system helps you find exactly what you need
            </p>
            <div className="space-x-4">
              <Link
                href="/products"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Browse All Products
              </Link>
              <Link
                href="/search"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Advanced Search
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
