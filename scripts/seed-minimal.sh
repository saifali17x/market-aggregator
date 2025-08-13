#!/bin/bash

# Minimal data seeding script
# Creates 10 sample listings across 3 sources with mixed currencies

set -e

echo "🌱 Seeding minimal sample data..."

# Check if .env exists and source it
if [ -f .env ]; then
    echo "📄 Loading environment from .env file..."
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  No .env file found. Using default values..."
    export DATABASE_URL="postgresql://marketplace_user:marketplace_pass@localhost:5432/marketplace"
    export REDIS_URL="redis://localhost:6379"
fi

# Check if database is accessible
echo "🔍 Checking database connectivity..."
if ! psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Cannot connect to database. Please ensure PostgreSQL is running."
    echo "   Run: scripts/run-local-stack.sh"
    exit 1
fi

echo "✅ Database connection successful"

# Create sample data SQL
cat > /tmp/sample_data.sql << 'EOF'
-- Sample data for marketplace aggregator
-- 10 listings across 3 sources with mixed currencies

-- Clear existing data (if any)
TRUNCATE TABLE listings, products, sellers CASCADE;

-- Insert sample sellers
INSERT INTO sellers (id, name, domain, country, created_at, updated_at) VALUES
(1, 'TechStore US', 'techstore.com', 'US', NOW(), NOW()),
(2, 'Electronics UK', 'electronics-uk.co.uk', 'GB', NOW(), NOW()),
(3, 'GadgetShop EU', 'gadgetshop.eu', 'DE', NOW(), NOW());

-- Insert sample products
INSERT INTO products (id, title, brand, category, model, created_at, updated_at) VALUES
(1, 'iPhone 15 Pro', 'Apple', 'Smartphones', 'iPhone 15 Pro', NOW(), NOW()),
(2, 'Samsung Galaxy S24', 'Samsung', 'Smartphones', 'Galaxy S24', NOW(), NOW()),
(3, 'MacBook Pro 14"', 'Apple', 'Laptops', 'MacBook Pro 14"', NOW(), NOW()),
(4, 'Sony WH-1000XM5', 'Sony', 'Headphones', 'WH-1000XM5', NOW(), NOW()),
(5, 'Nike Air Force 1', 'Nike', 'Shoes', 'Air Force 1', NOW(), NOW());

-- Insert sample listings with mixed currencies
INSERT INTO listings (id, seller_id, product_id, title, price, currency, url, condition, availability, created_at, updated_at) VALUES
-- TechStore US (USD)
(1, 1, 1, 'Apple iPhone 15 Pro 128GB Natural Titanium', 999.00, 'USD', 'https://techstore.com/iphone15pro', 'new', 'in_stock', NOW(), NOW()),
(2, 1, 2, 'Samsung Galaxy S24 128GB Phantom Black', 799.99, 'USD', 'https://techstore.com/galaxys24', 'new', 'in_stock', NOW(), NOW()),
(3, 1, 3, 'MacBook Pro 14" M3 Pro 512GB Space Gray', 1999.00, 'USD', 'https://techstore.com/macbookpro14', 'new', 'in_stock', NOW(), NOW()),
(4, 1, 4, 'Sony WH-1000XM5 Wireless Noise Canceling Headphones', 399.99, 'USD', 'https://techstore.com/sony-wh1000xm5', 'new', 'in_stock', NOW(), NOW()),

-- Electronics UK (GBP)
(5, 2, 1, 'Apple iPhone 15 Pro 128GB Natural Titanium', 899.00, 'GBP', 'https://electronics-uk.co.uk/iphone15pro', 'new', 'in_stock', NOW(), NOW()),
(6, 2, 2, 'Samsung Galaxy S24 128GB Phantom Black', 699.99, 'GBP', 'https://electronics-uk.co.uk/galaxys24', 'new', 'in_stock', NOW(), NOW()),
(7, 2, 5, 'Nike Air Force 1 Low White Men Shoe', 89.99, 'GBP', 'https://electronics-uk.co.uk/nike-af1', 'new', 'in_stock', NOW(), NOW()),

-- GadgetShop EU (EUR)
(8, 3, 3, 'MacBook Pro 14" M3 Pro 512GB Space Gray', 1899.00, 'EUR', 'https://gadgetshop.eu/macbookpro14', 'new', 'in_stock', NOW(), NOW()),
(9, 3, 4, 'Sony WH-1000XM5 Wireless Noise Canceling Headphones', 379.99, 'EUR', 'https://gadgetshop.eu/sony-wh1000xm5', 'new', 'in_stock', NOW(), NOW()),
(10, 3, 5, 'Nike Air Force 1 Low White Men Shoe', 99.99, 'EUR', 'https://gadgetshop.eu/nike-af1', 'new', 'in_stock', NOW(), NOW());

-- Display summary
SELECT 
    'Data Summary' as info,
    COUNT(DISTINCT s.id) as sellers,
    COUNT(DISTINCT p.id) as products,
    COUNT(DISTINCT l.id) as listings,
    COUNT(DISTINCT l.currency) as currencies
FROM sellers s
CROSS JOIN products p
CROSS JOIN listings l;
EOF

echo "📊 Inserting sample data..."
psql "$DATABASE_URL" -f /tmp/sample_data.sql

echo "✅ Sample data seeded successfully!"
echo ""
echo "📈 Data Summary:"
echo "   • 3 sellers (US, UK, EU)"
echo "   • 5 products (iPhone, Galaxy, MacBook, Sony Headphones, Nike Shoes)"
echo "   • 10 listings"
echo "   • 3 currencies (USD, GBP, EUR)"
echo ""
echo "🔍 View data:"
echo "   psql $DATABASE_URL -c \"SELECT * FROM listings;\""
echo "   psql $DATABASE_URL -c \"SELECT * FROM products;\""
echo "   psql $DATABASE_URL -c \"SELECT * FROM sellers;\""

# Clean up
rm -f /tmp/sample_data.sql
