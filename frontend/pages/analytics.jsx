import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  DollarSign,
  Star,
  Eye,
  BarChart3,
  Calendar,
  Target,
  Activity,
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [loading, setLoading] = useState(false);

  // Mock analytics data - in a real app, this would come from the API
  const analyticsData = {
    overview: {
      totalRevenue: 125000,
      totalOrders: 2847,
      totalCustomers: 1247,
      averageOrderValue: 43.89,
      conversionRate: 3.2,
      customerSatisfaction: 4.6,
    },
    trends: {
      revenue: { current: 125000, previous: 118000, change: 5.9 },
      orders: { current: 2847, previous: 2650, change: 7.4 },
      customers: { current: 1247, previous: 1180, change: 5.7 },
    },
    topCategories: [
      { name: "Electronics", revenue: 45000, orders: 890, growth: 12.5 },
      { name: "Fashion", revenue: 32000, orders: 1240, growth: 8.3 },
      { name: "Home & Garden", revenue: 28000, orders: 567, growth: 15.2 },
      { name: "Sports", revenue: 20000, orders: 150, growth: 22.1 },
    ],
    topProducts: [
      { name: "iPhone 15 Pro Max", revenue: 8500, orders: 45, views: 1250 },
      { name: "Samsung Galaxy S24", revenue: 7200, orders: 38, views: 980 },
      { name: "MacBook Pro M3", revenue: 6800, orders: 12, views: 450 },
      { name: "Nike Air Force 1", revenue: 5200, orders: 89, views: 2100 },
    ],
    customerMetrics: {
      newCustomers: 89,
      returningCustomers: 1158,
      customerRetention: 92.8,
      averageLifetimeValue: 156.78,
    },
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getChangeColor = (change) => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    );
  };

  return (
    <Layout>
      <Head>
        <title>Analytics - SeezyMart</title>
        <meta
          name="description"
          content="Business analytics and insights for SeezyMart"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600">
                  Track your business performance and insights
                </p>
              </div>

              {/* Time Range Selector */}
              <div className="mt-4 sm:mt-0">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(analyticsData.overview.totalRevenue)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span
                  className={`flex items-center ${getChangeColor(
                    analyticsData.trends.revenue.change
                  )}`}
                >
                  {getChangeIcon(analyticsData.trends.revenue.change)}
                  <span className="ml-1">
                    {analyticsData.trends.revenue.change}%
                  </span>
                </span>
                <span className="text-gray-500 ml-2">vs last period</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(analyticsData.overview.totalOrders)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span
                  className={`flex items-center ${getChangeColor(
                    analyticsData.trends.orders.change
                  )}`}
                >
                  {getChangeIcon(analyticsData.trends.orders.change)}
                  <span className="ml-1">
                    {analyticsData.trends.orders.change}%
                  </span>
                </span>
                <span className="text-gray-500 ml-2">vs last period</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Customers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(analyticsData.overview.totalCustomers)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span
                  className={`flex items-center ${getChangeColor(
                    analyticsData.trends.customers.change
                  )}`}
                >
                  {getChangeIcon(analyticsData.trends.customers.change)}
                  <span className="ml-1">
                    {analyticsData.trends.customers.change}%
                  </span>
                </span>
                <span className="text-gray-500 ml-2">vs last period</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg Order Value
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(analyticsData.overview.averageOrderValue)}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Target className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">Per order</span>
              </div>
            </div>
          </div>

          {/* Charts and Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Categories by Revenue
              </h3>
              <div className="space-y-4">
                {analyticsData.topCategories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {category.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatNumber(category.orders)} orders
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(category.revenue)}
                      </p>
                      <p
                        className={`text-sm ${getChangeColor(category.growth)}`}
                      >
                        +{category.growth}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Products by Revenue
              </h3>
              <div className="space-y-4">
                {analyticsData.topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatNumber(product.views)} views
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(product.revenue)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatNumber(product.orders)} orders
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Metrics */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Customer Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatNumber(analyticsData.customerMetrics.newCustomers)}
                </div>
                <div className="text-sm text-gray-600">New Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatNumber(
                    analyticsData.customerMetrics.returningCustomers
                  )}
                </div>
                <div className="text-sm text-gray-600">Returning Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {analyticsData.customerMetrics.customerRetention}%
                </div>
                <div className="text-sm text-gray-600">Retention Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {formatCurrency(
                    analyticsData.customerMetrics.averageLifetimeValue
                  )}
                </div>
                <div className="text-sm text-gray-600">Avg Lifetime Value</div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Conversion Rate</span>
                  <span className="font-semibold text-gray-900">
                    {analyticsData.overview.conversionRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Customer Satisfaction</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold text-gray-900">
                      {analyticsData.overview.customerSatisfaction}/5
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Page Views</span>
                  <span className="font-semibold text-gray-900">45,230</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  Export Report
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  Generate Insights
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  Schedule Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
