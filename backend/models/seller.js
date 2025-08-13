module.exports = (sequelize, DataTypes) => {
  const Seller = sequelize.define(
    "Seller",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 100],
        },
      },
      website: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
      },
      logo: {
        type: DataTypes.STRING,
      },
      contactEmail: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
        field: "contact_email",
      },
      contactPhone: {
        type: DataTypes.STRING,
        field: "contact_phone",
      },
      address: {
        type: DataTypes.TEXT,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0,
        validate: {
          min: 0,
          max: 5,
        },
      },
      totalRatings: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "total_ratings",
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_verified",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "is_active",
      },
      source: {
        type: DataTypes.STRING,
        comment: "Source of the seller data (scraped, manual, api)",
      },
      externalId: {
        type: DataTypes.STRING,
        comment: "External ID from source system",
        field: "external_id",
      },
    },
    {
      tableName: "sellers",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ["name"],
        },
        {
          fields: ["source", "external_id"],
          unique: true,
        },
      ],
    }
  );

  return Seller;
};
