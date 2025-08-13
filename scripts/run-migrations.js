#!/usr/bin/env node

/**
 * Database Migration Runner
 * Runs all pending migrations in the correct order
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

console.log("🚀 Starting database migrations...\n");

const migrationsDir = path.join(__dirname, "../backend/migrations");
const migrations = [];

// Read migration files
try {
  const files = fs.readdirSync(migrationsDir);
  files.forEach((file) => {
    if (file.endsWith(".js")) {
      const migrationNumber = file.split("-")[0];
      migrations.push({
        number: parseInt(migrationNumber),
        file: file,
        path: path.join(migrationsDir, file),
      });
    }
  });
} catch (error) {
  console.error("❌ Error reading migrations directory:", error.message);
  process.exit(1);
}

// Sort migrations by number
migrations.sort((a, b) => a.number - b.number);

console.log(`📋 Found ${migrations.length} migration(s):`);
migrations.forEach((migration) => {
  console.log(
    `  ${migration.number.toString().padStart(3, "0")}: ${migration.file}`
  );
});

console.log("\n🔄 Running migrations...\n");

// Run each migration
for (const migration of migrations) {
  try {
    console.log(`📝 Running migration ${migration.number}: ${migration.file}`);

    // Use Sequelize CLI to run the migration
    const command = `npx sequelize-cli db:migrate --migrations-path ${migrationsDir}`;

    console.log(`   Executing: ${command}`);
    execSync(command, {
      stdio: "inherit",
      cwd: path.join(__dirname, "../backend"),
    });

    console.log(`✅ Migration ${migration.number} completed successfully\n`);
  } catch (error) {
    console.error(`❌ Migration ${migration.number} failed:`, error.message);
    console.log("\n💡 Make sure your database is running and accessible");
    console.log("💡 Check that all required environment variables are set");
    process.exit(1);
  }
}

console.log("🎉 All migrations completed successfully!");
console.log("\n📊 Database schema is now up to date");
console.log("🚀 You can now start the application");
