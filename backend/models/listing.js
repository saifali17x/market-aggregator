const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Listing = sequelize.define(
    "Listing",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 255],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      originalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: "original_price",
      },
      currency: {
        type: DataTypes.STRING(3),
        defaultValue: "USD",
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      condition: {
        type: DataTypes.ENUM("new", "used", "refurbished", "for-parts"),
        defaultValue: "new",
      },
      availabilityStatus: {
        type: DataTypes.ENUM("available", "sold", "pending", "reserved"),
        defaultValue: "available",
        field: "availability_status",
      },
      images: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      viewsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "views_count",
      },
      favoritesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "favorites_count",
      },
      externalSource: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "external_source",
      },
      externalId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "external_id",
      },
      externalUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "external_url",
      },
      link: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      scrapedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "scraped_at",
      },
      searchVector: {
        type: DataTypes.TSVECTOR,
        allowNull: true,
        field: "search_vector",
      },
      sellerId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "seller_id",
        references: {
          model: "sellers",
          key: "id",
        },
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "category_id",
        references: {
          model: "categories",
          key: "id",
        },
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "product_id",
        references: {
          model: "products",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      source: {
        type: DataTypes.STRING(50),
        defaultValue: "scraper",
      },
    },
    {
      tableName: "listings",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ["seller_id"],
        },
        {
          fields: ["category_id"],
        },
        {
          fields: ["price"],
        },
        {
          fields: ["location"],
        },
        {
          fields: ["city"],
        },
        {
          fields: ["availability_status"],
        },
        {
          fields: ["created_at"],
        },
        {
          fields: ["search_vector"],
          using: "gin",
        },
        {
          fields: ["category_id", "price"],
        },
        {
          fields: ["location", "price"],
        },
        {
          fields: ["availability_status", "created_at"],
        },
      ],
    }
  );

  // Static methods for search functionality - simplified and moved to route handler

  // Instance methods
  Listing.prototype.incrementViews = async function () {
    this.viewsCount += 1;
    await this.save();
  };

  return Listing;
};
