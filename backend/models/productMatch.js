module.exports = (sequelize, DataTypes) => {
  const ProductMatch = sequelize.define(
    "ProductMatch",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "product_id",
        references: {
          model: "products",
          key: "id",
        },
      },
      matchedProductId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "matched_product_id",
        references: {
          model: "products",
          key: "id",
        },
      },
      confidenceScore: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.0,
        field: "confidence_score",
        validate: {
          min: 0.0,
          max: 1.0,
        },
      },
      matchType: {
        type: DataTypes.ENUM("exact", "similar", "partial"),
        allowNull: false,
        defaultValue: "partial",
        field: "match_type",
      },
      matchedFields: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: "matched_fields",
      },
    },
    {
      tableName: "product_matches",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ["product_id"],
        },
        {
          fields: ["matched_product_id"],
        },
        {
          fields: ["confidence_score"],
        },
        {
          fields: ["match_type"],
        },
      ],
    }
  );

  ProductMatch.associate = (models) => {
    ProductMatch.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
    ProductMatch.belongsTo(models.Product, {
      foreignKey: "matchedProductId",
      as: "matchedProduct",
    });
  };

  return ProductMatch;
};
