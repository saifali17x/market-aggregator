#!/usr/bin/env node

const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Database configuration for setup
const setupConfig = {
  user: process.env.DB_USER || "marketplace_user",
  host: process.env.DB_HOST || "localhost",
  database: "postgres", // Connect to default postgres DB first
  password: process.env.DB_PASSWORD || "your_password",
  port: process.env.DB_PORT || 5432,
};

const targetConfig = {
  ...setupConfig,
  database: process.env.DB_NAME || "marketplace_aggregator",
};

async function createDatabase() {
  const client = new Pool(setupConfig);

  try {
    console.log("🔍 Checking if database exists...");

    // Check if database exists
    const checkDb = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [targetConfig.database]
    );

    if (checkDb.rows.length === 0) {
      console.log(`📝 Creating database: ${targetConfig.database}`);
      await client.query(`CREATE DATABASE "${targetConfig.database}"`);
      console.log("✅ Database created successfully");
    } else {
      console.log("✅ Database already exists");
    }
  } catch (error) {
    console.error("❌ Error creating database:", error.message);
    throw error;
  } finally {
    await client.end();
  }
}

async function runSchema() {
  const client = new Pool(targetConfig);

  try {
    console.log("📋 Running database schema...");

    // Read and execute schema file
    const schemaPath = path.join(__dirname, "../backend/database/schema.sql");

    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    const schemaSQL = fs.readFileSync(schemaPath, "utf8");

    // Split by statements and execute each one
    const statements = schemaSQL
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      try {
        await client.query(statement);
      } catch (error) {
        // Skip errors for existing objects
        if (!error.message.includes("already exists")) {
          console.warn(`⚠️  Warning in statement ${i + 1}: ${error.message}`);
        }
      }
    }

    console.log("✅ Schema executed successfully");
  } catch (error) {
    console.error("❌ Error running schema:", error.message);
    throw error;
  } finally {
    await client.end();
  }
}

async function runMigrations() {
  const client = new Pool(targetConfig);

  try {
    console.log("🔄 Running migrations...");

    const migrationsPath = path.join(__dirname, "../backend/migrations");

    if (!fs.existsSync(migrationsPath)) {
      console.log("⚠️  No migrations directory found, skipping migrations");
      return;
    }

    const migrationFiles = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith(".js"))
      .sort();

    for (const file of migrationFiles) {
      try {
        console.log(`📝 Running migration: ${file}`);
        const migration = require(path.join(migrationsPath, file));
        await migration.up(client.query.bind(client), { DataTypes: {} });
        console.log(`✅ Migration ${file} completed`);
      } catch (error) {
        console.warn(`⚠️  Warning in migration ${file}: ${error.message}`);
      }
    }

    console.log("✅ All migrations completed");
  } catch (error) {
    console.error("❌ Error running migrations:", error.message);
    throw error;
  } finally {
    await client.end();
  }
}

async function runSeeders() {
  const client = new Pool(targetConfig);

  try {
    console.log("🌱 Running seeders...");

    const seedersPath = path.join(__dirname, "../backend/seeders");

    if (!fs.existsSync(seedersPath)) {
      console.log("⚠️  No seeders directory found, skipping seeders");
      return;
    }

    const seederFiles = fs
      .readdirSync(seedersPath)
      .filter((file) => file.endsWith(".js"))
      .sort();

    for (const file of seederFiles) {
      try {
        console.log(`🌱 Running seeder: ${file}`);
        const seeder = require(path.join(seedersPath, file));
        await seeder.up(client.query.bind(client), { DataTypes: {} });
        console.log(`✅ Seeder ${file} completed`);
      } catch (error) {
        console.warn(`⚠️  Warning in seeder ${file}: ${error.message}`);
      }
    }

    console.log("✅ All seeders completed");
  } catch (error) {
    console.error("❌ Error running seeders:", error.message);
    throw error;
  } finally {
    await client.end();
  }
}

async function testConnection() {
  const client = new Pool(targetConfig);

  try {
    console.log("🔗 Testing database connection...");

    const result = await client.query(
      "SELECT NOW() as current_time, version() as pg_version"
    );
    const { current_time, pg_version } = result.rows[0];

    console.log(`✅ Connection successful!`);
    console.log(`📅 Current time: ${current_time}`);
    console.log(`🐘 PostgreSQL: ${pg_version.split(" ")[1]}`);

    // Test if our tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    const tables = tablesResult.rows.map((row) => row.table_name);
    console.log(`📊 Tables found: ${tables.join(", ")}`);

    // Get sample counts
    for (const table of [
      "categories",
      "sellers",
      "listings",
      "products",
      "users",
    ]) {
      if (tables.includes(table)) {
        const countResult = await client.query(
          `SELECT COUNT(*) as count FROM ${table}`
        );
        console.log(`📈 ${table}: ${countResult.rows[0].count} records`);
      }
    }
  } catch (error) {
    console.error("❌ Connection test failed:", error.message);
    throw error;
  } finally {
    await client.end();
  }
}

async function createUser() {
  const client = new Pool(setupConfig);

  try {
    console.log("👤 Setting up database user...");

    // Check if user exists
    const userCheck = await client.query(
      "SELECT 1 FROM pg_user WHERE usename = $1",
      [targetConfig.user]
    );

    if (userCheck.rows.length === 0) {
      console.log(`📝 Creating user: ${targetConfig.user}`);
      await client.query(`
        CREATE USER "${targetConfig.user}" WITH 
        PASSWORD '${targetConfig.password}'
        CREATEDB
      `);
      console.log("✅ User created successfully");
    } else {
      console.log("✅ User already exists");
    }

    // Grant privileges
    console.log("🔐 Granting privileges...");
    await client.query(
      `GRANT ALL PRIVILEGES ON DATABASE "${targetConfig.database}" TO "${targetConfig.user}"`
    );
  } catch (error) {
    console.error("❌ Error setting up user:", error.message);
    // Don't throw here, as user might already exist or be managed externally
  } finally {
    await client.end();
  }
}

async function setupDatabase() {
  console.log("🚀 Starting database setup...");
  console.log("Configuration:");
  console.log(`  Host: ${targetConfig.host}:${targetConfig.port}`);
  console.log(`  Database: ${targetConfig.database}`);
  console.log(`  User: ${targetConfig.user}`);
  console.log("");

  try {
    // Step 1: Create user (optional, might fail if user management is external)
    await createUser();

    // Step 2: Create database
    await createDatabase();

    // Step 3: Run schema
    await runSchema();

    // Step 4: Run migrations
    await runMigrations();

    // Step 5: Run seeders
    await runSeeders();

    // Step 6: Test connection
    await testConnection();

    console.log("");
    console.log("🎉 Database setup completed successfully!");
    console.log("");
    console.log("Next steps:");
    console.log("  1. Start the server: npm run dev");
    console.log("  2. Test the API: curl http://localhost:3001/health");
    console.log(
      '  3. Search listings: curl "http://localhost:3001/api/listings?q=sample"'
    );
  } catch (error) {
    console.error("");
    console.error("💥 Database setup failed:", error.message);
    console.error("");
    console.error("Troubleshooting:");
    console.error("  1. Make sure PostgreSQL is running");
    console.error("  2. Check your .env configuration");
    console.error("  3. Verify database permissions");
    console.error("  4. Check firewall settings");
    process.exit(1);
  }
}

// CLI arguments handling
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "create-db":
    createDatabase()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
    break;
  case "run-schema":
    runSchema()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
    break;
  case "run-migrations":
    runMigrations()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
    break;
  case "run-seeders":
    runSeeders()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
    break;
  case "test":
    testConnection()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
    break;
  case "create-user":
    createUser()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
    break;
  default:
    setupDatabase();
}
