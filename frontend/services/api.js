// Simple mock data service - no backend needed
import { products, categories, sellers } from "../data/products";

class ApiService {
  constructor() {
    console.log("🌐 Mock API Service initialized - using local data");
  }

  // Product APIs
  async getProducts(filters = {}) {
    console.log("📦 Getting products with filters:", filters);
    return products;
  }

  async getProduct(id) {
    console.log("📦 Getting product:", id);
    return products.find((p) => p.id == id) || products[0];
  }

  async getCategories() {
    console.log("🏷️ Getting categories");
    return categories;
  }

  async getPopularCategories() {
    console.log("🏷️ Getting popular categories");
    return categories.slice(0, 6);
  }

  // Seller APIs
  async getSellers() {
    console.log("👥 Getting sellers");
    return sellers;
  }

  async getSeller(id) {
    console.log("👥 Getting seller:", id);
    return sellers.find((s) => s.id == id) || sellers[0];
  }

  async getSellerProducts(sellerId) {
    console.log("📦 Getting seller products:", sellerId);
    return products.slice(0, 10);
  }

  // Search APIs
  async searchProducts(query, filters = {}) {
    console.log("🔍 Searching products:", query, filters);
    return products.slice(0, 15);
  }

  // Cart APIs (simulated)
  async getCart() {
    return {
      items: [],
      total: 0,
      itemCount: 0,
    };
  }

  async addToCart(productId, quantity = 1) {
    console.log(
      `🛒 Adding product ${productId} to cart with quantity ${quantity}`
    );
    return { success: true, message: "Product added to cart" };
  }

  async updateCartItem(itemId, quantity) {
    console.log(`🛒 Updating cart item ${itemId} with quantity ${quantity}`);
    return { success: true, message: "Cart updated" };
  }

  async removeFromCart(itemId) {
    console.log(`🛒 Removing cart item ${itemId}`);
    return { success: true, message: "Item removed from cart" };
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
    return { status: "ok", message: "Mock API service running" };
  }
}

export const apiService = new ApiService();
export default apiService;
