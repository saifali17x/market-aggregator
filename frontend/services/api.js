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
      console.log(`🌐 Making API request to: ${url}`);
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
        console.log("📍 Endpoint:", endpoint);
        const mockData = this.getMockData(endpoint);
        console.log("📦 Mock data result:", mockData);
        return mockData;
      }
      throw error;
    }
  }

  // Mock data fallback for production demo
  getMockData(endpoint) {
    try {
      // Import mock data dynamically to avoid build issues
      const mockData = require("../data/products");
      
      // Handle different endpoint patterns
      if (endpoint.includes("/products")) {
        if (endpoint.includes("?")) {
          // Handle filtered products
          return mockData.products.slice(0, 20); // Return first 20 products
        } else if (endpoint.match(/\/products\/\d+$/)) {
          // Handle single product
          const id = endpoint.split("/").pop();
          return mockData.products.find(p => p.id == id) || mockData.products[0];
        } else {
          // Handle all products
          return mockData.products;
        }
      } else if (endpoint.includes("/categories")) {
        if (endpoint.includes("/popular")) {
          return mockData.categories.slice(0, 6); // Return popular categories
        } else {
          return mockData.categories;
        }
      } else if (endpoint.includes("/sellers")) {
        if (endpoint.includes("/products")) {
          // Handle seller products
          return mockData.products.slice(0, 10);
        } else if (endpoint.match(/\/sellers\/\d+$/)) {
          // Handle single seller
          const id = endpoint.split("/").pop();
          return mockData.sellers.find(s => s.id == id) || mockData.sellers[0];
        } else {
          return mockData.sellers;
        }
      } else if (endpoint.includes("/search")) {
        // Handle search results
        return mockData.products.slice(0, 15);
      } else if (endpoint.includes("/health")) {
        return { status: "ok", message: "Mock data mode active" };
      }
      
      // Default fallback
      return [];
    } catch (error) {
      console.error("Mock data fallback failed:", error);
      return [];
    }
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