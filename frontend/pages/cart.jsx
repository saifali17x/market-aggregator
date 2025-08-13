import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Shield, Truck, Clock } from "lucide-react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock cart data for portfolio
    const mockCartItems = [
      {
        id: 1,
        productId: 1,
        title: "iPhone 15 Pro Max - 256GB",
        price: 1199.99,
        originalPrice: 1299.99,
        image: "/api/placeholder/150/150",
        quantity: 1,
        inStock: true,
        seller: "TechStore Pro",
        shipping: {
          free: true,
          estimated: "2-4 business days"
        }
      },
      {
        id: 2,
        productId: 4,
        title: "Nike Air Force 1 '07",
        price: 89.99,
        originalPrice: 109.99,
        image: "/api/placeholder/150/150",
        quantity: 2,
        inStock: true,
        seller: "SneakerHead",
        shipping: {
          free: true,
          estimated: "3-5 business days"
        }
      },
      {
        id: 3,
        productId: 6,
        title: "Instant Pot Duo 7-in-1",
        price: 79.99,
        originalPrice: 99.99,
        image: "/api/placeholder/150/150",
        quantity: 1,
        inStock: true,
        seller: "Kitchen Essentials",
        shipping: {
          free: false,
          cost: 9.99,
          estimated: "1-2 business days"
        }
      }
    ];

    setCartItems(mockCartItems);
    setLoading(false);
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.shipping.free ? 0 : item.shipping.cost);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax rate
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const calculateSavings = () => {
    return cartItems.reduce((sum, item) => {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <Head>
          <title>Your Cart - MarketPlace</title>
          <meta name="description" content="Your shopping cart" />
        </Head>

        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h3>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-block"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Your Cart - MarketPlace</title>
        <meta name="description" content="Review and checkout your cart items" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <ShoppingBag className="w-6 h-6 mr-2" />
                    Shopping Cart ({cartItems.length} items)
                  </h1>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="bg-gray-200 w-24 h-24 rounded-lg"></div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900 mb-1">
                                {item.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                Sold by <span className="font-medium">{item.seller}</span>
                              </p>
                              
                              {/* Shipping Info */}
                              <div className="flex items-center text-sm text-gray-600 mb-3">
                                <Truck className="w-4 h-4 mr-1" />
                                {item.shipping.free ? (
                                  <span className="text-green-600 font-medium">Free shipping</span>
                                ) : (
                                  <span>Shipping: ${item.shipping.cost}</span>
                                )}
                                <span className="mx-2">•</span>
                                <span>{item.shipping.estimated}</span>
                              </div>

                              {/* Stock Status */}
                              <div className="flex items-center text-sm">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  item.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}>
                                  {item.inStock ? "In Stock" : "Out of Stock"}
                                </span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                              {item.originalPrice > item.price && (
                                <div className="text-sm text-gray-500 line-through">
                                  ${(item.originalPrice * item.quantity).toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700 transition-colors flex items-center"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={calculateShipping() === 0 ? "text-green-600 font-medium" : ""}>
                      {calculateShipping() === 0 ? "Free" : `$${calculateShipping().toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>

                  {calculateSavings() > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>You Save</span>
                      <span>-${calculateSavings().toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    or 4 interest-free payments of ${(calculateTotal() / 4).toFixed(2)}
                  </p>
                </div>

                {/* Checkout Button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center mb-4">
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>

                {/* Security & Trust */}
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-600" />
                    Secure checkout with SSL encryption
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-600" />
                    30-day return policy
                  </div>
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-2 text-purple-600" />
                    Fast, reliable shipping
                  </div>
                </div>

                {/* Continue Shopping */}
                <div className="mt-6 pt-6 border-t">
                  <Link
                    href="/products"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Products */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
                  <div className="bg-gray-200 h-32 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-6 bg-blue-200 rounded w-1/3 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
