import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import { CheckCircle, Package, Clock, MapPin, ArrowRight } from "lucide-react";

export default function OrderConfirmation() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const { orderId, orderDetails } = router.query;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push("/products");
    }
  }, [countdown, router]);

  // Mock order details for demonstration
  const order = {
    id: orderId || "ORD-2024-001",
    status: "Confirmed",
    total: "$299.99",
    items: 3,
    estimatedDelivery: "3-5 business days",
    shippingAddress: "123 Main St, City, State 12345"
  };

  return (
    <Layout>
      <Head>
        <title>Order Confirmed - SeezyMart</title>
        <meta name="description" content="Your order has been confirmed successfully" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Order Confirmed!
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your purchase. Your order has been successfully placed and is being processed.
            </p>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-semibold text-gray-900">{order.id}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {order.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-gray-900">{order.total}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-semibold text-gray-900">{order.items}</span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-left">
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <span className="font-semibold text-gray-900 ml-2">{order.estimatedDelivery}</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-left">
                    <span className="text-gray-600">Shipping Address:</span>
                    <span className="font-semibold text-gray-900 ml-2">{order.shippingAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-gray-700">You'll receive an email confirmation shortly</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-gray-700">Your order will be processed and shipped within 24 hours</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-gray-700">Track your order in your account dashboard</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/orders"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium"
              >
                <Package className="w-5 h-5 mr-2" />
                View Orders
              </Link>
              
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continue Shopping
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>

            {/* Auto-redirect notice */}
            <div className="mt-6 text-sm text-gray-500">
              Redirecting to products page in {countdown} seconds...
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
