// Auto-detect environment and set appropriate API URL
const isProduction =
  typeof window !== "undefined" && window.location.hostname !== "localhost";
const API_BASE_URL = isProduction
  ? "https://your-backend-project.vercel.app/api" // Replace with your actual backend Vercel URL
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log("🌐 API Service initialized with:", this.baseURL);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      // Fallback to mock data for production demo
      if (
        typeof window !== "undefined" &&
        window.location.hostname !== "localhost"
      ) {
        console.log("🔄 Falling back to mock data for production demo");
        return this.getMockData(endpoint);
      }
      throw error;
    }
  }

  // Mock data fallback for production demo
  getMockData(endpoint) {
    // Import mock data dynamically to avoid build issues
    const mockData = {
      "/products": require("../data/products").products,
      "/categories": require("../data/products").categories,
      "/sellers": require("../data/products").sellers,
    };

    // Extract the base path from endpoint
    const basePath = endpoint.split("?")[0].split("/")[1];
    const fullPath = `/${basePath}`;

    return mockData[fullPath] || [];
  }

  // Product APIs
  async getProducts(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/products?${queryParams}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async getCategories() {
    return this.request("/categories");
  }

  async getPopularCategories() {
    return this.request("/categories/popular");
  }

  // Seller APIs
  async getSellers() {
    return this.request("/sellers");
  }

  async getSeller(id) {
    return this.request(`/sellers/${id}`);
  }

  async getSellerProducts(sellerId) {
    return this.request(`/sellers/${sellerId}/products`);
  }

  // Search APIs
  async searchProducts(query, filters = {}) {
    const params = { q: query, ...filters };
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`/search?${queryParams}`);
  }

  // Cart APIs (simulated for now)
  async getCart() {
    // For now, return mock data
    return {
      items: [],
      total: 0,
      itemCount: 0,
    };
  }

  async addToCart(productId, quantity = 1) {
    // Simulate API call
    console.log(
      `Adding product ${productId} to cart with quantity ${quantity}`
    );
    return { success: true, message: "Product added to cart" };
  }

  async updateCartItem(itemId, quantity) {
    console.log(`Updating cart item ${itemId} with quantity ${quantity}`);
    return { success: true, message: "Cart updated" };
  }

  async removeFromCart(itemId) {
    console.log(`Removing cart item ${itemId}`);
    return { success: true, message: "Item removed from cart" };
  }

  // Analytics APIs
  async getProductAnalytics(productId) {
    return this.request(`/analytics/products/${productId}`);
  }

  async getSellerAnalytics(sellerId) {
    return this.request(`/analytics/sellers/${sellerId}`);
  }

  // Health check
  async healthCheck() {
    try {
      return await this.request("/health");
    } catch (error) {
      return { status: "error", message: "Backend not available" };
    }
  }
}

export const apiService = new ApiService();
export default apiService;
