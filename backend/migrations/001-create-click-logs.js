"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("click_logs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      referrerIp: {
        type: Sequelize.STRING(45), // IPv6 compatible
        allowNull: false,
      },
      userAgent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sessionId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      listingId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "listings",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      sellerId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "sellers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      source: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "listing_card",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Create indexes
    await queryInterface.addIndex("click_logs", ["url"]);
    await queryInterface.addIndex("click_logs", ["timestamp"]);
    await queryInterface.addIndex("click_logs", ["referrerIp"]);
    await queryInterface.addIndex("click_logs", ["listingId"]);
    await queryInterface.addIndex("click_logs", ["sellerId"]);
    await queryInterface.addIndex("click_logs", ["createdAt"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("click_logs");
  },
};
