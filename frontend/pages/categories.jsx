import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import { ShoppingBag, TrendingUp, Star, Users, ArrowRight } from "lucide-react";
import { apiService } from "../services/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        console.error("Failed to load categories:", response.error);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Categories - SeezyMart</title>
        <meta
          name="description"
          content="Browse all product categories on SeezyMart"
        />
      </Head>

      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Product Categories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover amazing products across all categories, from cutting-edge
              electronics to timeless fashion pieces
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 hover:border-blue-300 overflow-hidden"
              >
                <div className="p-8 relative">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Category Icon */}
                  <div className="text-5xl mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>

                  {/* Category Info */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 relative z-10">
                    {category.name}
                  </h3>

                  {/* Product Count */}
                  <div className="flex items-center text-sm text-gray-600 mb-6 relative z-10">
                    <ShoppingBag className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="font-medium">
                      {category.count} products available
                    </span>
                  </div>

                  {/* Hover Effect */}
                  <div className="flex items-center text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 relative z-10">
                    Explore {category.name}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 bg-green-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Marketplace Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="text-4xl font-bold text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                  {categories
                    .reduce((total, cat) => total + cat.count, 0)
                    .toLocaleString()}
                </div>
                <div className="text-gray-600 font-medium">Total Products</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-green-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                  {categories.length}
                </div>
                <div className="text-gray-600 font-medium">Categories</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-purple-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                  4.8
                </div>
                <div className="text-gray-600 font-medium">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
