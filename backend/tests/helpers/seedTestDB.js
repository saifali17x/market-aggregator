// backend/tests/helpers/seedTestDB.js
const { Pool } = require("pg");

// Use test database URL or fallback to main database
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL_TEST ||
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/marketplace_test",
});

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Note: adapt table/column names to your schema if needed.
    // Create minimal sellers and products if not present.
    await client.query(`
      INSERT INTO sellers (id, name, email, verified, created_at, updated_at)
      VALUES 
        (gen_random_uuid(), 'Seller A', 'a@example.com', true, now(), now()),
        (gen_random_uuid(), 'Seller B', 'b@example.com', true, now(), now()),
        (gen_random_uuid(), 'Seller C', 'c@example.com', true, now(), now())
      ON CONFLICT DO NOTHING;
    `);

    // We'll create two product groups "TestProduct A" and "TestProduct B"
    const now = new Date().toISOString();

    // Insert 6 listings across 2 products and 3 "sources"
    await client.query(`
      INSERT INTO listings (id, title, price, currency, price_base, link, source, seller_id, created_at, updated_at)
      VALUES
        (gen_random_uuid(), 'TestProduct A - Variant 1', 100, 'USD', 100, 'https://s1/a', 'source1', (SELECT id FROM sellers LIMIT 1), now(), now()),
        (gen_random_uuid(), 'TestProduct A - Variant 2', 110, 'USD', 110, 'https://s2/a', 'source2', (SELECT id FROM sellers LIMIT 1 OFFSET 1), now(), now()),
        (gen_random_uuid(), 'TestProduct A - Variant 3', 105, 'USD', 105, 'https://s3/a', 'source3', (SELECT id FROM sellers LIMIT 1 OFFSET 2), now(), now()),
        (gen_random_uuid(), 'TestProduct B - Variant 1', 200, 'USD', 200, 'https://s1/b', 'source1', (SELECT id FROM sellers LIMIT 1), now(), now()),
        (gen_random_uuid(), 'TestProduct B - Variant 2', 210, 'USD', 210, 'https://s2/b', 'source2', (SELECT id FROM sellers LIMIT 1 OFFSET 1), now(), now()),
        (gen_random_uuid(), 'TestProduct B - Variant 3', 205, 'USD', 205, 'https://s3/b', 'source3', (SELECT id FROM sellers LIMIT 1 OFFSET 2), now(), now())
      ON CONFLICT DO NOTHING;
    `);

    await client.query("COMMIT");
    console.log("Test database seeded successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error seeding test DB", err);
    throw err;
  } finally {
    client.release();
  }
}

async function cleanup() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "DELETE FROM listings WHERE title ILIKE 'TestProduct %'"
    );
    await client.query(
      "DELETE FROM sellers WHERE email IN ('a@example.com','b@example.com','c@example.com')"
    );
    await client.query("COMMIT");
    console.log("Test database cleaned up successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error cleaning up test DB", err);
  } finally {
    client.release();
    await pool.end();
  }
}

module.exports = seed;
module.exports.cleanup = cleanup;
