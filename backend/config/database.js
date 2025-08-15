const { Sequelize } = require("sequelize");
const path = require("path");

// Load .env from parent directory (project root) - only in development
if (process.env.NODE_ENV !== "production") {
  try {
    require("dotenv").config({ path: path.join(__dirname, "../../.env") });
  } catch (error) {
    console.log("No .env file found, using environment variables");
  }
}

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
let sequelize = null;

try {
  if (dbConfig.use_env_variable && process.env[dbConfig.use_env_variable]) {
    sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
  } else if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, dbConfig);
  } else {
    console.log("No database URL found, running without database");
  }
} catch (error) {
  console.log("Failed to initialize database connection:", error.message);
  sequelize = null;
}

// Test database connection
const testConnection = async () => {
  if (!sequelize) {
    console.log("No database connection available");
    return false;
  }
  
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

// Close database connection
const closeConnection = async () => {
  if (!sequelize) {
    return;
  }
  
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
