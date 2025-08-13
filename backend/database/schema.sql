-- Create database schema for marketplace aggregator
-- Run this file to set up your database structure

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sellers table
CREATE TABLE sellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    sku VARCHAR(100),
    category_id UUID REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create listings table with full-text search
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    location VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    condition VARCHAR(50) DEFAULT 'new',
    availability_status VARCHAR(50) DEFAULT 'available',
    images JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    external_source VARCHAR(100),
    external_id VARCHAR(255),
    external_url TEXT,
    link TEXT,
    scraped_at TIMESTAMP,
    search_vector TSVECTOR,
    seller_id UUID NOT NULL REFERENCES sellers(id),
    category_id UUID REFERENCES categories(id),
    product_id UUID REFERENCES products(id),
    user_id UUID REFERENCES users(id),
    source VARCHAR(50) DEFAULT 'scraper',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_listings_seller_id ON listings(seller_id);
CREATE INDEX idx_listings_category_id ON listings(category_id);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_location ON listings(location);
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_state ON listings(state);
CREATE INDEX idx_listings_availability_status ON listings(availability_status);
CREATE INDEX idx_listings_created_at ON listings(created_at);
CREATE INDEX idx_listings_search_vector ON listings USING GIN(search_vector);
CREATE INDEX idx_listings_category_price ON listings(category_id, price);
CREATE INDEX idx_listings_location_price ON listings(location, price);
CREATE INDEX idx_listings_status_created ON listings(availability_status, created_at);

-- Create full-text search index
CREATE INDEX idx_listings_title_description ON listings USING GIN(
    to_tsvector('english', title || ' ' || COALESCE(description, ''))
);

-- Create trigger function for updating search_vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.brand, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search_vector updates
CREATE TRIGGER listings_search_vector_update
    BEFORE INSERT OR UPDATE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_search_vector();

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at updates
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sellers_updated_at BEFORE UPDATE ON sellers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Electronic devices and accessories'),
('Clothing', 'clothing', 'Apparel and fashion items'),
('Home & Garden', 'home-garden', 'Home improvement and garden supplies'),
('Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear'),
('Books & Media', 'books-media', 'Books, movies, and music'),
('Automotive', 'automotive', 'Vehicle parts and accessories'),
('Health & Beauty', 'health-beauty', 'Health products and beauty supplies'),
('Toys & Games', 'toys-games', 'Children toys and entertainment');

-- Insert sample sellers
INSERT INTO sellers (name, email, rating, total_reviews, verified, city, state) VALUES
('TechStore Pro', 'contact@techstore.com', 4.8, 1250, true, 'New York', 'NY'),
('Fashion Forward', 'hello@fashion.com', 4.6, 890, true, 'Los Angeles', 'CA'),
('Home Essentials', 'info@homeessentials.com', 4.7, 650, true, 'Chicago', 'IL'),
('Sports Central', 'sales@sportscentral.com', 4.5, 420, true, 'Miami', 'FL');

-- Insert sample products
INSERT INTO products (title, description, brand, sku, category_id) VALUES
('Wireless Bluetooth Headphones', 'High-quality wireless headphones with noise cancellation', 'AudioTech', 'ATH-WH1000', (SELECT id FROM categories WHERE slug = 'electronics')),
('Smart Fitness Watch', 'Advanced fitness tracking with heart rate monitor', 'FitTech', 'FT-SMART01', (SELECT id FROM categories WHERE slug = 'electronics')),
('Organic Cotton T-Shirt', 'Comfortable organic cotton t-shirt in various colors', 'EcoWear', 'EW-TSHIRT01', (SELECT id FROM categories WHERE slug = 'clothing')),
('Garden Tool Set', 'Complete set of essential garden tools', 'GreenThumb', 'GT-TOOLS01', (SELECT id FROM categories WHERE slug = 'home-garden'));

-- Insert sample listings
INSERT INTO listings (title, description, price, currency, location, city, state, condition, seller_id, category_id, product_id, source) VALUES
('Wireless Bluetooth Headphones - Like New', 'Excellent condition wireless headphones, barely used', 89.99, 'USD', 'Downtown', 'New York', 'NY', 'used', 
 (SELECT id FROM sellers WHERE name = 'TechStore Pro'), 
 (SELECT id FROM categories WHERE slug = 'electronics'),
 (SELECT id FROM products WHERE sku = 'ATH-WH1000'), 'sample'),
('Smart Fitness Watch - Brand New', 'Latest model fitness watch with all features', 199.99, 'USD', 'Westside', 'Los Angeles', 'CA', 'new',
 (SELECT id FROM sellers WHERE name = 'Sports Central'),
 (SELECT id FROM categories WHERE slug = 'electronics'),
 (SELECT id FROM products WHERE sku = 'FT-SMART01'), 'sample'),
('Organic Cotton T-Shirt - Multiple Colors', 'Soft organic cotton t-shirt available in blue, green, and white', 24.99, 'USD', 'Midtown', 'Chicago', 'IL', 'new',
 (SELECT id FROM sellers WHERE name = 'Fashion Forward'),
 (SELECT id FROM categories WHERE slug = 'clothing'),
 (SELECT id FROM products WHERE sku = 'EW-TSHIRT01'), 'sample'),
('Professional Garden Tool Set', 'Complete garden tool set including shovel, rake, and pruners', 79.99, 'USD', 'Suburbs', 'Miami', 'FL', 'new',
 (SELECT id FROM sellers WHERE name = 'Home Essentials'),
 (SELECT id FROM categories WHERE slug = 'home-garden'),
 (SELECT id FROM products WHERE sku = 'GT-TOOLS01'), 'sample');

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO marketplace_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO marketplace_user;
