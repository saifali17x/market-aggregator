// backend/models/scrapingJob.js
// Sequelize model for PostgreSQL

const { DataTypes } = require("sequelize");

const ProductModel = (sequelize) => {
  return sequelize.define(
    "ScrapingJob",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      platform: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      status: {
        type: DataTypes.ENUM("pending", "running", "completed", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },
      schedule: {
        type: DataTypes.STRING(100), // cron expression
        allowNull: true,
      },
      lastRun: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "last_run",
      },
      nextRun: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "next_run",
      },
      config: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      results: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "error_message",
      },
    },
    {
      tableName: "scraping_jobs",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ["platform"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["next_run"],
        },
        {
          fields: ["schedule"],
        },
      ],
    }
  );
};

module.exports = ProductModel;
