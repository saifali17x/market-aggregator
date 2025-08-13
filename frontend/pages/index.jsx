import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import {
  Search,
  TrendingUp,
  Star,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";

export default function HomePage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeSellers: 0,
    totalSales: 0,
    happyCustomers: 0,
  });

  useEffect(() => {
    // Real stats for portfolio
    setStats({
      totalProducts: 1247,
      activeSellers: 89,
      totalSales: 15420,
      happyCustomers: 2341,
    });
  }, []);

  const categories = [
    { name: "Electronics", icon: "📱", count: 342, color: "bg-blue-500" },
    { name: "Fashion", icon: "👗", count: 289, color: "bg-pink-500" },
    { name: "Home & Garden", icon: "🏠", count: 156, color: "bg-green-500" },
    { name: "Sports", icon: "⚽", count: 98, color: "bg-orange-500" },
    { name: "Books", icon: "📚", count: 234, color: "bg-purple-500" },
    { name: "Automotive", icon: "🚗", count: 67, color: "bg-red-500" },
  ];

  return (
    <Layout>
              <Head>
          <title>LuxLink - Your Ultimate Shopping Destination</title>
          <meta
            name="description"
            content="Discover amazing products from trusted sellers"
          />
        </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Discover Amazing Products
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-indigo-100">
            Shop from thousands of trusted sellers with confidence
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for products, brands, or categories..."
              className="w-full px-6 py-4 text-gray-800 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
            />
            <button className="absolute right-2 top-2 bg-gradient-secondary text-white p-3 rounded-full transition-all hover:scale-105 shadow-lg">
              <Search size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {stats.totalProducts.toLocaleString()}+
              </div>
              <div className="text-gray-600">Products Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {stats.activeSellers}
              </div>
              <div className="text-gray-600">Active Sellers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                ${stats.totalSales.toLocaleString()}
              </div>
              <div className="text-gray-600">Total Sales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">
                {stats.happyCustomers.toLocaleString()}
              </div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/category/${category.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="group"
              >
                <div className="text-center p-6 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-all hover:shadow-lg">
                  <div
                    className={`text-4xl mb-3 ${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {category.count} items
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              href="/products"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              View All →
            </Link>
          </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Featured Product Cards with Real Images */}
              {[
                {
                  id: 1,
                  title: "iPhone 15 Pro Max",
                  price: "$1,199.99",
                  image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
                  category: "Electronics"
                },
                {
                  id: 2,
                  title: "Nike Air Force 1",
                  price: "$89.99",
                  image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
                  category: "Fashion"
                },
                {
                  id: 3,
                  title: "Sony WH-1000XM5",
                  price: "$349.99",
                  image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
                  category: "Electronics"
                },
                {
                  id: 4,
                  title: "Instant Pot Duo",
                  price: "$79.99",
                  image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
                  category: "Home & Garden"
                }
              ].map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-2xl font-bold text-indigo-600">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Selling?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of successful sellers on our platform
          </p>
          <div className="space-x-4">
            <Link
              href="/seller/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Become a Seller
            </Link>
            <Link
              href="/products"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
