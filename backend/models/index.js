const { sequelize, Sequelize } = require("../config/database");

// Only import models if sequelize is available
let User, Seller, Product, Category, Listing, ClickLog, ProductMatch, Price;

if (sequelize) {
  // Import models when database is available
  User = require("./user")(sequelize, Sequelize);
  Seller = require("./seller")(sequelize, Sequelize);
  Product = require("./product")(sequelize, Sequelize);
  Category = require("./category")(sequelize, Sequelize);
  Listing = require("./listing")(sequelize, Sequelize);
  ClickLog = require("./clickLog")(sequelize, Sequelize);
  ProductMatch = require("./productMatch")(sequelize, Sequelize);
  Price = require("./price")(sequelize, Sequelize);
} else {
  // Create dummy models when running without database
  console.log("📝 Running without database - using dummy models");
  User = null;
  Seller = null;
  Product = null;
  Category = null;
  Listing = null;
  ClickLog = null;
  ProductMatch = null;
  Price = null;
}

// Define associations only if models exist
if (sequelize && User && Seller && Product && Category && Listing && ClickLog && ProductMatch) {
  User.hasMany(Listing, { foreignKey: "userId", as: "listings" });
  Listing.belongsTo(User, { foreignKey: "userId", as: "user" });

  Seller.hasMany(Listing, { foreignKey: "sellerId", as: "listings" });
  Listing.belongsTo(Seller, { foreignKey: "sellerId", as: "seller" });

  Product.hasMany(Listing, { foreignKey: "productId", as: "listings" });
  Listing.belongsTo(Product, { foreignKey: "productId", as: "product" });

  Category.hasMany(Listing, { foreignKey: "categoryId", as: "listings" });
  Listing.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

  // Click tracking associations
  Listing.hasMany(ClickLog, { foreignKey: "listingId", as: "clickLogs" });
  ClickLog.belongsTo(Listing, { foreignKey: "listingId", as: "listing" });

  Seller.hasMany(ClickLog, { foreignKey: "sellerId", as: "clickLogs" });
  ClickLog.belongsTo(Seller, { foreignKey: "sellerId", as: "seller" });

  // Product matching associations
  Product.hasMany(ProductMatch, { foreignKey: "productId", as: "matches" });
  ProductMatch.belongsTo(Product, { foreignKey: "productId", as: "product" });

  Product.hasMany(ProductMatch, {
    foreignKey: "matchedProductId",
    as: "matchedBy",
  });
  ProductMatch.belongsTo(Product, {
    foreignKey: "matchedProductId",
    as: "matchedProduct",
  });
}

// Export models and sequelize instance
module.exports = {
  sequelize,
  Sequelize,
  User,
  Seller,
  Product,
  Category,
  Listing,
  ClickLog,
  ProductMatch,
  // ScrapingJob, // Temporarily disabled
  Price,
};
