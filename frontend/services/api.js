// API service for backend communication
const getApiBaseUrl = () => {
  // Always prioritize the environment variable for backend URL
  if (process.env.NEXT_PUBLIC_API_URL) {
    console.log(
      "🔗 Using configured backend:",
      process.env.NEXT_PUBLIC_API_URL
    );
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Fallback to local development
  console.log("🔗 Falling back to local development backend");
  return "http://localhost:3001/api";
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  constructor() {
    console.log("🌐 API Service initialized - connecting to backend");
    console.log("🔗 API Base URL:", API_BASE_URL);
  }

  // Helper method for API calls
  async apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Product APIs
  async getProducts(filters = {}) {
    console.log("📦 Getting products with filters:", filters);
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/products?${queryParams}` : "/products";
    return this.apiCall(endpoint);
  }

  async getProduct(id) {
    console.log("📦 Getting product:", id);
    return this.apiCall(`/products/${id}`);
  }

  async getCategories() {
    console.log("🏷️ Getting categories");
    return this.apiCall("/categories");
  }

  async getPopularCategories() {
    console.log("🏷️ Getting popular categories");
    return this.apiCall("/categories/popular");
  }

  // Seller APIs
  async getSellers() {
    console.log("👥 Getting sellers");
    return this.apiCall("/sellers");
  }

  async getSeller(id) {
    console.log("👥 Getting seller:", id);
    return this.apiCall(`/sellers/${id}`);
  }

  async getSellerProducts(sellerId) {
    console.log("📦 Getting seller products:", sellerId);
    return this.apiCall(`/sellers/${sellerId}/products`);
  }

  // Search APIs
  async searchProducts(query, filters = {}) {
    console.log("🔍 Searching products:", query, filters);
    const params = { q: query, ...filters };
    const queryParams = new URLSearchParams(params).toString();
    return this.apiCall(`/search?${queryParams}`);
  }

  // Cart APIs
  async getCart() {
    try {
      return await this.apiCall("/cart");
    } catch (error) {
      console.error("Failed to get cart:", error);
      return {
        success: false,
        data: {
          items: [],
          total: 0,
          itemCount: 0,
        },
      };
    }
  }

  async addToCart(productId, quantity = 1, product) {
    console.log(
      `🛒 Adding product ${productId} to cart with quantity ${quantity}`
    );
    return this.apiCall("/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId, quantity, product }),
    });
  }

  async updateCartItem(itemId, quantity) {
    console.log(`🛒 Updating cart item ${itemId} with quantity ${quantity}`);
    return this.apiCall(`/cart/update/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId) {
    console.log(`🛒 Removing cart item ${itemId}`);
    return this.apiCall(`/cart/remove/${itemId}`, {
      method: "DELETE",
    });
  }

  async clearCart() {
    console.log("🛒 Clearing cart");
    return this.apiCall("/cart/clear", {
      method: "DELETE",
    });
  }

  // Profile APIs
  async getProfile() {
    try {
      return await this.apiCall("/profile");
    } catch (error) {
      console.error("Failed to get profile:", error);
      return {
        success: false,
        data: null,
      };
    }
  }

  async updateProfile(profileData) {
    return this.apiCall("/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  // Order APIs
  async getOrders() {
    try {
      return await this.apiCall("/orders");
    } catch (error) {
      console.error("Failed to get orders:", error);
      return {
        success: false,
        data: [],
      };
    }
  }

  async getOrder(orderId) {
    return this.apiCall(`/orders/${orderId}`);
  }

  async createOrder(orderData) {
    return this.apiCall("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  // Checkout APIs
  async processCheckout(checkoutData) {
    return this.apiCall("/checkout", {
      method: "POST",
      body: JSON.stringify(checkoutData),
    });
  }

  async getShippingOptions() {
    return this.apiCall("/checkout/shipping-options");
  }

  async validateAddress(address) {
    return this.apiCall("/checkout/validate-address", {
      method: "POST",
      body: JSON.stringify({ address }),
    });
  }

  async calculateTax(subtotal, shippingAddress) {
    return this.apiCall("/checkout/calculate-tax", {
      method: "POST",
      body: JSON.stringify({ subtotal, shippingAddress }),
    });
  }

  // Analytics APIs
  async getProductAnalytics(productId) {
    return { views: 1000, sales: 50, revenue: 5000 };
  }

  async getSellerAnalytics(sellerId) {
    return { totalSales: 15000, totalProducts: 200, rating: 4.8 };
  }

  // Health check
  async healthCheck() {
    try {
      return await this.apiCall("/health");
    } catch (error) {
      return { status: "error", message: "Backend connection failed" };
    }
  }
}

export const apiService = new ApiService();
export default apiService;
