const { Sequelize } = require("sequelize");
const path = require("path");

// Load .env from parent directory (project root)
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

// Database configuration
const config = {
  development: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  test: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    logging: false,
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  },
};

// Get current environment
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

// Create Sequelize instance
let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    throw error;
  }
};

// Close database connection
const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error closing database connection:", error.message);
  }
};

module.exports = {
  sequelize,
  Sequelize,
  config: dbConfig,
  testConnection,
  closeConnection,
};
