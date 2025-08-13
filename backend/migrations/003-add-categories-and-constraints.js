"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create categories table
    await queryInterface.createTable("categories", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      slug: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      parent_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create prices helper table for currency conversion
    await queryInterface.createTable("prices", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        unique: true,
      },
      rate_to_usd: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: false,
      },
      fetched_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      source: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: "manual",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add unique constraint on listings (source, link) to prevent duplicates
    await queryInterface.addIndex("listings", ["source", "link"], {
      unique: true,
      name: "listings_source_link_unique",
    });

    // Add unique constraint on listings (source, platform_listing_id) if platform_listing_id exists
    await queryInterface.addIndex("listings", ["source", "platform_listing_id"], {
      unique: true,
      name: "listings_source_platform_id_unique",
      where: {
        platform_listing_id: {
          [Sequelize.Op.ne]: null,
        },
      },
    });

    // Add price_base column to listings for normalized pricing
    await queryInterface.addColumn("listings", "price_base", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: "Price converted to base currency (USD)",
    });

    // Add category_id to listings if it doesn't exist
    if (!(await queryInterface.describeTable("listings")).category_id) {
      await queryInterface.addColumn("listings", "category_id", {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }

    // Insert default categories
    const defaultCategories = [
      { slug: "electronics", name: "Electronics", description: "Electronic devices and accessories" },
      { slug: "clothing", name: "Clothing & Fashion", description: "Apparel, shoes, and accessories" },
      { slug: "home-garden", name: "Home & Garden", description: "Home improvement and garden supplies" },
      { slug: "sports", name: "Sports & Outdoors", description: "Sports equipment and outdoor gear" },
      { slug: "books", name: "Books & Media", description: "Books, movies, music, and digital content" },
      { slug: "automotive", name: "Automotive", description: "Cars, parts, and automotive accessories" },
      { slug: "health", name: "Health & Beauty", description: "Health products and beauty supplies" },
      { slug: "toys", name: "Toys & Games", description: "Toys, games, and entertainment" },
      { slug: "jewelry", name: "Jewelry & Watches", description: "Fine jewelry and timepieces" },
      { slug: "collectibles", name: "Collectibles & Art", description: "Collectible items and artwork" },
    ];

    for (const category of defaultCategories) {
      await queryInterface.bulkInsert("categories", [{
        ...category,
        created_at: new Date(),
        updated_at: new Date(),
      }]);
    }

    // Insert default currency rates
    const defaultRates = [
      { currency: "USD", rate_to_usd: 1.000000, source: "default" },
      { currency: "EUR", rate_to_usd: 1.090000, source: "default" },
      { currency: "GBP", rate_to_usd: 1.270000, source: "default" },
      { currency: "PKR", rate_to_usd: 0.003600, source: "default" },
      { currency: "INR", rate_to_usd: 0.012000, source: "default" },
      { currency: "CAD", rate_to_usd: 0.740000, source: "default" },
      { currency: "AUD", rate_to_usd: 0.660000, source: "default" },
    ];

    for (const rate of defaultRates) {
      await queryInterface.bulkInsert("prices", [{
        ...rate,
        fetched_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      }]);
    }

    // Create indexes for performance
    await queryInterface.addIndex("categories", ["slug"]);
    await queryInterface.addIndex("categories", ["parent_id"]);
    await queryInterface.addIndex("categories", ["is_active"]);
    await queryInterface.addIndex("prices", ["currency"]);
    await queryInterface.addIndex("prices", ["fetched_at"]);
    await queryInterface.addIndex("listings", ["category_id"]);
    await queryInterface.addIndex("listings", ["price_base"]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes
    await queryInterface.removeIndex("listings", "listings_source_link_unique");
    await queryInterface.removeIndex("listings", "listings_source_platform_id_unique");
    await queryInterface.removeIndex("listings", ["category_id"]);
    await queryInterface.removeIndex("listings", ["price_base"]);
    await queryInterface.removeIndex("categories", ["slug"]);
    await queryInterface.removeIndex("categories", ["parent_id"]);
    await queryInterface.removeIndex("categories", ["is_active"]);
    await queryInterface.removeIndex("prices", ["currency"]);
    await queryInterface.removeIndex("prices", ["fetched_at"]);

    // Remove columns
    await queryInterface.removeColumn("listings", "price_base");
    if (await queryInterface.describeTable("listings").category_id) {
      await queryInterface.removeColumn("listings", "category_id");
    }

    // Drop tables
    await queryInterface.dropTable("prices");
    await queryInterface.dropTable("categories");
  },
};
