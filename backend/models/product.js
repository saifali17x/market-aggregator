// backend/models/Product.js
// Sequelize model for PostgreSQL

const { DataTypes } = require("sequelize");

const ProductModel = (sequelize) => {
  return sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
          len: [1, 500],
        },
      },
      brand: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      model: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      categoryPath: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "category_path",
      },
      keywords: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      specifications: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_active",
      },
    },
    {
      tableName: "products",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ["title"],
        },
        {
          fields: ["brand"],
        },
        {
          fields: ["category_path"],
        },
      ],
    }
  );
};

module.exports = ProductModel;
