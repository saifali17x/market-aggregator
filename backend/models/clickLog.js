module.exports = (sequelize, DataTypes) => {
  const ClickLog = sequelize.define(
    "ClickLog",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          isUrl: true,
        },
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      referrerIp: {
        type: DataTypes.STRING(45), // IPv6 compatible
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        field: "referrer_ip",
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "user_agent",
      },
      sessionId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "session_id",
      },
      listingId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "listings",
          key: "id",
        },
        field: "listing_id",
      },
      sellerId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "sellers",
          key: "id",
        },
        field: "seller_id",
      },
      source: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "listing_card",
      },
    },
    {
      tableName: "click_logs",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ["url"],
        },
        {
          fields: ["timestamp"],
        },
        {
          fields: ["referrer_ip"],
        },
        {
          fields: ["listing_id"],
        },
        {
          fields: ["seller_id"],
        },
        {
          fields: ["created_at"],
        },
      ],
    }
  );

  ClickLog.associate = (models) => {
    ClickLog.belongsTo(models.Listing, {
      foreignKey: "listingId",
      as: "listing",
    });
    ClickLog.belongsTo(models.Seller, {
      foreignKey: "sellerId",
      as: "seller",
    });
  };

  return ClickLog;
};
