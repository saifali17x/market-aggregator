const app = require("./app");
const { sequelize, Seller, Product, Listing, Category } = require("./models");
const PORT = process.env.PORT || 3001;

// Seed initial data function
async function seedInitialData() {
  try {
    // Create sample categories
    const categories = await Category.bulkCreate([
      {
        name: "Electronics",
        slug: "electronics",
        description: "Electronic devices and gadgets",
      },
      {
        name: "Fashion",
        slug: "fashion",
        description: "Clothing and accessories",
      },
      {
        name: "Home & Garden",
        slug: "home-garden",
        description: "Home improvement and garden items",
      },
      {
        name: "Sports",
        slug: "sports",
        description: "Sports equipment and gear",
      },
      { name: "Books", slug: "books", description: "Books and publications" },
    ]);

    // Create sample sellers
    const sellers = await Seller.bulkCreate([
      {
        name: "TechStore US",
        website: "https://techstore.com",
        contactEmail: "info@techstore.com",
        rating: 4.5,
        totalRatings: 120,
        isVerified: true,
        source: "manual",
      },
      {
        name: "Electronics UK",
        website: "https://electronics-uk.co.uk",
        contactEmail: "sales@electronics-uk.co.uk",
        rating: 4.2,
        totalRatings: 85,
        isVerified: true,
        source: "manual",
      },
      {
        name: "GadgetShop EU",
        website: "https://gadgetshop.eu",
        contactEmail: "hello@gadgetshop.eu",
        rating: 4.7,
        totalRatings: 200,
        isVerified: true,
        source: "manual",
      },
    ]);

    // Create sample products
    const products = await Product.bulkCreate([
      {
        title: "iPhone 15 Pro",
        brand: "Apple",
        model: "iPhone 15 Pro",
        categoryPath: "Electronics/Smartphones",
        keywords: ["iphone", "smartphone", "apple", "5g"],
        isActive: true,
      },
      {
        title: "Samsung Galaxy S24",
        brand: "Samsung",
        model: "Galaxy S24",
        categoryPath: "Electronics/Smartphones",
        keywords: ["samsung", "smartphone", "galaxy", "5g"],
        isActive: true,
      },
      {
        title: 'MacBook Pro 14"',
        brand: "Apple",
        model: 'MacBook Pro 14"',
        categoryPath: "Electronics/Laptops",
        keywords: ["macbook", "laptop", "apple", "m3"],
        isActive: true,
      },
      {
        title: "Sony WH-1000XM5",
        brand: "Sony",
        model: "WH-1000XM5",
        categoryPath: "Electronics/Headphones",
        keywords: ["sony", "headphones", "noise-canceling", "wireless"],
        isActive: true,
      },
      {
        title: "Nike Air Force 1",
        brand: "Nike",
        model: "Air Force 1",
        categoryPath: "Fashion/Shoes",
        keywords: ["nike", "shoes", "sneakers", "athletic"],
        isActive: true,
      },
    ]);

    // Create sample listings
    await Listing.bulkCreate([
      {
        sellerId: sellers[0].id,
        productId: products[0].id,
        title: "Apple iPhone 15 Pro 128GB Natural Titanium",
        price: 999.0,
        currency: "USD",
        condition: "new",
        availabilityStatus: "available",
        location: "New York, NY",
        city: "New York",
        state: "NY",
        country: "US",
      },
      {
        sellerId: sellers[0].id,
        productId: products[1].id,
        title: "Samsung Galaxy S24 128GB Phantom Black",
        price: 799.99,
        currency: "USD",
        condition: "new",
        availabilityStatus: "available",
        location: "New York, NY",
        city: "New York",
        state: "NY",
        country: "US",
      },
      {
        sellerId: sellers[1].id,
        productId: products[0].id,
        title: "Apple iPhone 15 Pro 128GB Natural Titanium",
        price: 899.0,
        currency: "GBP",
        condition: "new",
        availabilityStatus: "available",
        location: "London, UK",
        city: "London",
        country: "GB",
      },
      {
        sellerId: sellers[2].id,
        productId: products[2].id,
        title: 'MacBook Pro 14" M3 Pro 512GB Space Gray',
        price: 1899.0,
        currency: "EUR",
        condition: "new",
        availabilityStatus: "available",
        location: "Berlin, Germany",
        city: "Berlin",
        country: "DE",
      },
    ]);

    console.log(
      `✅ Created ${categories.length} categories, ${sellers.length} sellers, ${products.length} products, and sample listings`
    );
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  }
}

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Sync database models (in development) - FORCE RECREATE EVERYTHING
    if (process.env.NODE_ENV === "development") {
      console.log("🗑️  Dropping and recreating all tables...");
      await sequelize.sync({ force: true });
      console.log("✅ Database models synchronized with clean slate.");

      // Seed initial data
      console.log("🌱 Seeding initial data...");
      await seedInitialData();
      console.log("✅ Initial data seeded successfully.");
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received, shutting down gracefully...");
  await sequelize.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received, shutting down gracefully...");
  await sequelize.close();
  process.exit(0);
});

startServer();
