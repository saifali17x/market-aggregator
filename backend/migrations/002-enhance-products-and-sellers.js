"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new columns to products table
    await queryInterface.addColumn("products", "brand", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn("products", "model", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn("products", "category_path", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("products", "keywords", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("products", "specifications", {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    await queryInterface.addColumn("products", "is_active", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });

    // Add new columns to sellers table
    await queryInterface.addColumn("sellers", "platform", {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: "marketplace",
    });

    await queryInterface.addColumn("sellers", "platform_seller_id", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("sellers", "platform_url", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("sellers", "rating_count", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });

    await queryInterface.addColumn("sellers", "response_time", {
      type: Sequelize.INTEGER, // in hours
      allowNull: true,
    });

    await queryInterface.addColumn("sellers", "shipping_info", {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    // Add new columns to listings table
    await queryInterface.addColumn("listings", "platform_listing_id", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("listings", "platform_url", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("listings", "shipping_cost", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("listings", "total_price", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("listings", "availability_quantity", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("listings", "last_verified", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Create product_matches table for grouping similar products
    await queryInterface.createTable("product_matches", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      matched_product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      confidence_score: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      match_type: {
        type: Sequelize.ENUM("exact", "similar", "partial"),
        allowNull: false,
        defaultValue: "partial",
      },
      matched_fields: {
        type: Sequelize.JSONB,
        allowNull: true,
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

    // Create scraping_jobs table for scheduling
    await queryInterface.createTable("scraping_jobs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      platform: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "running", "completed", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },
      schedule: {
        type: Sequelize.STRING(100), // cron expression
        allowNull: true,
      },
      last_run: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      next_run: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      config: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      results: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    // Create indexes
    await queryInterface.addIndex("products", ["brand"]);
    await queryInterface.addIndex("products", ["model"]);
    await queryInterface.addIndex("products", ["is_active"]);
    await queryInterface.addIndex("sellers", ["platform"]);
    await queryInterface.addIndex("sellers", ["platform_seller_id"]);
    await queryInterface.addIndex("sellers", ["is_verified"]);
    await queryInterface.addIndex("listings", ["platform_listing_id"]);
    await queryInterface.addIndex("listings", ["total_price"]);
    await queryInterface.addIndex("product_matches", ["product_id"]);
    await queryInterface.addIndex("product_matches", ["confidence_score"]);
    await queryInterface.addIndex("scraping_jobs", ["platform"]);
    await queryInterface.addIndex("scraping_jobs", ["status"]);
    await queryInterface.addIndex("scraping_jobs", ["next_run"]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove product_matches table
    await queryInterface.dropTable("product_matches");

    // Remove scraping_jobs table
    await queryInterface.dropTable("scraping_jobs");

    // Remove columns from listings
    await queryInterface.removeColumn("listings", "platform_listing_id");
    await queryInterface.removeColumn("listings", "platform_url");
    await queryInterface.removeColumn("listings", "shipping_cost");
    await queryInterface.removeColumn("listings", "total_price");
    await queryInterface.removeColumn("listings", "availability_quantity");
    await queryInterface.removeColumn("listings", "last_verified");

    // Remove columns from sellers
    await queryInterface.removeColumn("sellers", "platform");
    await queryInterface.removeColumn("sellers", "platform_seller_id");
    await queryInterface.removeColumn("sellers", "platform_url");
    await queryInterface.removeColumn("sellers", "rating_count");
    await queryInterface.removeColumn("sellers", "response_time");
    await queryInterface.removeColumn("sellers", "shipping_info");

    // Remove columns from products
    await queryInterface.removeColumn("products", "brand");
    await queryInterface.removeColumn("products", "model");
    await queryInterface.removeColumn("products", "category_path");
    await queryInterface.removeColumn("products", "keywords");
    await queryInterface.removeColumn("products", "specifications");
    await queryInterface.removeColumn("products", "is_active");
  },
};
