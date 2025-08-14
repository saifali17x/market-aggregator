import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "../../components/Layout";
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, Clock, Eye, Users } from "lucide-react";
import { apiService } from "../../services/api";

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProduct(parseInt(id));
      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        console.error("Failed to load product:", response.error);
        // Fallback to mock data if API fails
        setProduct(getMockProduct(parseInt(id)));
      }
    } catch (err) {
      console.error("Error loading product:", err);
      // Fallback to mock data if API fails
      setProduct(getMockProduct(parseInt(id)));
    } finally {
      setLoading(false);
    }
  };

  const getMockProduct = (productId) => {
    // Mock product data for portfolio fallback
    const mockProduct = {
      id: parseInt(productId),
      title: "iPhone 15 Pro Max - 256GB - Natural Titanium",
      price: 1199.99,
      originalPrice: 1299.99,
      discount: 8,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop"
      ],
      category: "Electronics",
      subcategory: "Smartphones",
      brand: "Apple",
      model: "iPhone 15 Pro Max",
      seller: {
        name: "TechStore Pro",
        rating: 4.8,
        reviewCount: 1247,
        verified: true,
        memberSince: "2020",
        totalSales: 15420,
        responseTime: "2 hours"
      },
      rating: 4.8,
      reviewCount: 1247,
      inStock: true,
      stockQuantity: 45,
      sku: "IP15PM-256-NT",
      condition: "New",
      warranty: "1 Year Apple Warranty",
      shipping: {
        free: true,
        estimated: "2-4 business days",
        weight: "0.5 lbs"
      },
      description: "Experience the future of mobile technology with the iPhone 15 Pro Max. Featuring the revolutionary A17 Pro chip, stunning 6.7-inch Super Retina XDR display, and advanced camera system with 5x optical zoom. The aerospace-grade titanium design offers unmatched durability while maintaining elegant aesthetics.",
      features: [
        "A17 Pro chip with 6-core GPU",
        "6.7-inch Super Retina XDR display",
        "Pro camera system with 5x optical zoom",
        "Aerospace-grade titanium design",
        "USB-C connector",
        "Action button for quick access",
        "Emergency SOS via satellite",
        "All-day battery life"
      ],
      specifications: {
        "Display": "6.7-inch Super Retina XDR OLED",
        "Processor": "A17 Pro chip with 6-core GPU",
        "Storage": "256GB",
        "Camera": "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
        "Battery": "Up to 29 hours video playback",
        "Operating System": "iOS 17",
        "Dimensions": "6.29 x 3.02 x 0.32 inches",
        "Weight": "7.81 ounces"
      },
      reviews: [
        {
          id: 1,
          user: "John D.",
          rating: 5,
          date: "2024-01-15",
          title: "Amazing phone, worth every penny!",
          comment: "The camera quality is incredible and the performance is lightning fast. Battery life easily lasts all day with heavy use."
        },
        {
          id: 2,
          user: "Sarah M.",
          rating: 5,
          date: "2024-01-12",
          title: "Best iPhone I've ever owned",
          comment: "The titanium build feels premium and the new action button is very useful. Highly recommend!"
        },
        {
          id: 3,
          user: "Mike R.",
          rating: 4,
          date: "2024-01-10",
          title: "Great phone with minor issues",
          comment: "Overall excellent phone, but the battery could be better. Camera and performance are top-notch."
        }
      ],
      relatedProducts: [
        { id: 2, title: "Samsung Galaxy S24 Ultra", price: 1099.99, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop" },
        { id: 3, title: "MacBook Pro 14 M3 Chip", price: 1999.99, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop" },
        { id: 5, title: "Sony WH-1000XM5", price: 349.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" }
      ],
      analytics: {
        views: 15420,
        sales: 89,
        conversionRate: 0.58,
        avgTimeOnPage: "4m 32s"
      }
    };
    return mockProduct;
  };

  const addToCart = async () => {
    if (!product || !product.inStock) return;
    
    try {
      setAddingToCart(true);
      const response = await apiService.addToCart(product.id, quantity, product);
      if (response.success) {
        // Show success message
        alert("Product added to cart successfully!");
      } else {
        alert("Failed to add product to cart");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Error adding product to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const buyNow = async () => {
    if (!product || !product.inStock) return;
    
    try {
      // Add to cart first, then redirect to checkout
      const response = await apiService.addToCart(product.id, quantity, product);
      if (response.success) {
        // Redirect to checkout
        router.push("/checkout");
      } else {
        alert("Failed to add product to cart");
      }
    } catch (err) {
      console.error("Error buying now:", err);
      alert("Error processing purchase");
    }
  };

  const toggleWishlist = () => {
    // TODO: Implement wishlist functionality
    alert("Wishlist functionality coming soon!");
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this amazing product: ${product.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">❌</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Product not found</h3>
            <p className="text-gray-600">The product you're looking for doesn't exist</p>
            <button
              onClick={() => router.push("/products")}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{product.title} - SeezyMart</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <span>Home</span>
            {product.category && (
              <>
                <span className="mx-2">/</span>
                <span>{product.category}</span>
              </>
            )}
            {product.subcategory && (
              <>
                <span className="mx-2">/</span>
                <span>{product.subcategory}</span>
              </>
            )}
            {product.brand && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{product.brand}</span>
              </>
            )}
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="bg-white rounded-lg p-4">
                <div className="h-96 rounded-lg mb-4 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full rounded-lg flex items-center justify-center text-gray-500">
                      No Image Available
                    </div>
                  )}
                </div>
                {/* Thumbnail images - if multiple images exist */}
                {product.images && product.images.length > 1 && (
                  <div className="flex space-x-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-20 h-20 rounded-lg border-2 ${
                          selectedImage === index ? "border-blue-500" : "border-gray-200"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="bg-white rounded-lg p-6">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
                    <div className="flex space-x-2">
                      <button
                        onClick={toggleWishlist}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                      <button
                        onClick={shareProduct}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 ml-2">
                      {product.rating || 0} ({product.reviewCount || 0} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                        <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                          Save ${(product.originalPrice - product.price).toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center space-x-4 mb-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                    {product.inStock && product.stockQuantity && (
                      <span className="text-sm text-gray-600">
                        {product.stockQuantity} units available
                      </span>
                    )}
                  </div>
                </div>

                {/* Purchase Options */}
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-2"
                    >
                      {[...Array(Math.min(10, product.stockQuantity || 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={addToCart}
                      disabled={!product.inStock || addingToCart}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      {addingToCart ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </button>
                    <button
                      onClick={buyNow}
                      disabled={!product.inStock}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>

                {/* Seller Info */}
                {product.seller && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Sold by</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {product.seller.name || product.seller}
                          </div>
                          {product.seller.rating && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              {product.seller.rating} ({product.seller.reviewCount || 0})
                            </div>
                          )}
                        </div>
                      </div>
                      {product.seller.memberSince && product.seller.totalSales && (
                        <div className="text-right text-sm text-gray-600">
                          <div>Member since {product.seller.memberSince}</div>
                          <div>{product.seller.totalSales.toLocaleString()} sales</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Shipping & Returns */}
                <div className="border-t pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-green-600" />
                      <span>Free shipping</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span>30-day returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-12">
            <div className="bg-white rounded-lg">
              <div className="border-b">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: "description", label: "Description" },
                    { id: "specifications", label: "Specifications" },
                    { id: "reviews", label: `Reviews (${product.reviewCount || 0})` },
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
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "description" && (
                  <div>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {product.description}
                    </p>
                    {product.features && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-gray-700">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "specifications" && (
                  <div>
                    {product.specifications && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="border-b border-gray-200 pb-3">
                            <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">{key}</dt>
                            <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    {product.reviews && product.reviews.length > 0 ? (
                      <div className="space-y-6">
                        {product.reviews.map((review) => (
                          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{review.title}</h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              By {review.user} on {review.date}
                            </p>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
                    )}
                  </div>
                )}

                {activeTab === "analytics" && (
                  <div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-600">
                          {product.analytics?.views?.toLocaleString() || "0"}
                        </div>
                        <div className="text-sm text-gray-600">Views</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <ShoppingCart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">
                          {product.analytics?.sales || "0"}
                        </div>
                        <div className="text-sm text-gray-600">Sales</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {product.analytics?.conversionRate ? 
                            ((product.analytics.conversionRate * 100).toFixed(1)) : "0"}%
                        </div>
                        <div className="text-sm text-gray-600">Conversion Rate</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-orange-600">
                          {product.analytics?.avgTimeOnPage || "0"}
                        </div>
                        <div className="text-sm text-gray-600">Avg. Time</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {product.relatedProducts && product.relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {product.relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{relatedProduct.title}</h3>
                      <p className="text-lg font-bold text-gray-900 mb-3">${relatedProduct.price}</p>
                      <button
                        onClick={() => router.push(`/product/${relatedProduct.id}`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                      >
                        View Product
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
