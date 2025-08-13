const { sequelize, Sequelize } = require("../config/database");

// Import models
const User = require("./user")(sequelize, Sequelize);
const Seller = require("./seller")(sequelize, Sequelize);
const Product = require("./product")(sequelize, Sequelize);
const Category = require("./category")(sequelize, Sequelize);
const Listing = require("./listing")(sequelize, Sequelize);
const ClickLog = require("./clickLog")(sequelize, Sequelize);
const ProductMatch = require("./productMatch")(sequelize, Sequelize);
// Temporarily disabled to get basic API running
// const ScrapingJob = require("./scrapingJob")(sequelize, Sequelize);
const Price = require("./price")(sequelize, Sequelize);

// Define associations
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
