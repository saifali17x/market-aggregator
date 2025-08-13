# 🚀 Market Aggregator - Enhanced Price Comparison Marketplace

A comprehensive marketplace platform that aggregates products from multiple sources, provides intelligent product matching, and displays them in a price comparison view grouped by product similarity.

## ✨ Key Features

### 🕷️ **Multi-Platform Scraping**

- **Amazon, eBay, Shopify** - Traditional e-commerce platforms
- **Facebook Marketplace** - Social commerce integration
- **Instagram Sellers** - Social media seller discovery
- **OLX** - Local marketplace aggregation
- **Configurable Scrapers** - Easy to add new platforms

### 🧠 **Intelligent Product Matching**

- **AI-Powered Matching** - Advanced similarity algorithms
- **Brand & Model Recognition** - Automatic product grouping
- **Confidence Scoring** - Match quality indicators
- **Duplicate Prevention** - Smart deduplication across sources

### 💰 **Price Comparison Engine**

- **Grouped Product View** - Similar products displayed together
- **Price Range Analysis** - Min/max pricing across sellers
- **Platform Comparison** - Side-by-side seller analysis
- **Best Price Highlighting** - Cheapest options emphasized

### 🛡️ **Seller Verification System**

- **Verification Badges** - Trust indicators for users
- **Admin Controls** - Manual verification management
- **Filter Options** - Show verified sellers only
- **Quality Assurance** - Maintain marketplace integrity

### ⏰ **Automated Scraping**

- **Scheduled Jobs** - Cron-based automation
- **Real-time Monitoring** - Job status tracking
- **Manual Triggers** - On-demand scraping
- **Error Handling** - Graceful failure management

### 📊 **Advanced Analytics**

- **Click Tracking** - Outbound link performance
- **Seller Performance** - Rating and response metrics
- **Product Trends** - Popular items and categories
- **Platform Insights** - Source performance analysis

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Price Comp.    │    │  Scraper       │    │  Product       │
│  Table          │    │  Service       │    │  Matching      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Click Tracking │    │  Cron Scheduler │    │  Analytics     │
│  System         │    │  (node-cron)    │    │  Dashboard     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Git

### 1. Clone & Install

```bash
git clone https://github.com/saifali/market-aggregator.git
cd market-aggregator
npm run install:all
```

### 2. Database Setup

```bash
# Create database and run migrations
npm run setup:db
npm run migrate:db
```

### 3. Environment Configuration

```bash
cp .env.example .env
# Edit .env with your database credentials and API keys
```

### 4. Generate Admin Password

```bash
npm run generate-hash
# Copy the hash to ADMIN_PASSWORD in .env
```

### 5. Start Development

```bash
npm run dev
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

## 🔧 Configuration

### Scraping Platforms

Each platform has its own configuration file in `backend/config/sites/`:

```json
{
  "name": "Amazon",
  "baseUrl": "https://www.amazon.com",
  "selectors": {
    "product": "[data-testid='product-card']",
    "title": "h2 a span",
    "price": ".a-price-whole"
  },
  "rateLimiting": {
    "delayBetweenRequests": 2000,
    "maxConcurrentRequests": 3
  }
}
```

### Scraping Schedules

Configure automated scraping using cron expressions:

```bash
# Every 6 hours
0 */6 * * *

# Daily at midnight
0 0 * * *

# Weekly on Sunday
0 0 * * 0
```

## 📊 API Endpoints

### Product Search & Comparison

```http
GET /api/listings/grouped?q=iphone&verifiedOnly=true
GET /api/listings/search/suggestions?q=iphone
GET /api/listings/categories/popular
```

### Scraping Management

```http
GET    /api/admin/scraping/jobs
POST   /api/admin/scraping/jobs
POST   /api/admin/scraping/jobs/:id/run
DELETE /api/admin/scraping/jobs/:id
```

### Seller Management

```http
GET /api/admin/sellers?verified=true&search=john
PUT /api/admin/sellers/:id/verify
```

### Click Tracking

```http
POST /api/track/click
GET  /api/track/stats
GET  /api/track/listing/:id
```

## 🎯 Product Matching Algorithm

The system uses a multi-factor similarity scoring algorithm:

1. **Title Similarity (40%)** - Word-based Jaccard similarity + length comparison
2. **Brand Matching (30%)** - Exact brand name comparison
3. **Model Matching (20%)** - Product model number similarity
4. **Description Similarity (10%)** - Key phrase extraction and comparison

### Confidence Levels

- **Exact Match (90%+)** - Same product, different sellers
- **Similar Match (70-89%)** - Very similar products
- **Partial Match (40-69%)** - Related products
- **No Match (<40%)** - Different products

## 🕷️ Scraping Architecture

### Production-Ready Scraping System

The marketplace aggregator uses a **productionized scraping architecture** with Playwright-based workers, Redis job queues, and intelligent compliance management.

#### Core Components

- **Playwright Workers** - Headless Chromium browsers for reliable scraping
- **Redis Job Queue** - BullMQ-powered job management with retry logic
- **Compliance Engine** - Automated robots.txt parsing and risk assessment
- **Rate Limiting** - Configurable delays and concurrent request management
- **Error Handling** - Exponential backoff and graceful failure recovery

#### Supported Platforms

| Platform  | Method     | Auth Required | Risk Level | Rate Limit |
| --------- | ---------- | ------------- | ---------- | ---------- |
| Amazon    | Playwright | No            | Medium     | 3 req/min  |
| eBay      | Playwright | No            | Medium     | 3 req/min  |
| Facebook  | Playwright | Yes           | High       | 2 req/min  |
| Instagram | Playwright | Yes           | High       | 1 req/min  |
| OLX       | Playwright | No            | Medium     | 3 req/min  |
| Shopify   | Playwright | No            | Low        | 3 req/min  |

#### Worker Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Admin API     │    │   Redis Queue   │    │   Playwright    │
│   (Job Creator) │───►│   (BullMQ)      │───►│   Workers      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Job Scheduler  │    │  Job Monitor    │    │  Result Store   │
│  (node-cron)    │    │  (Real-time)    │    │  (Database)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Key Features

- **Headless Browsers** - Full JavaScript rendering and interaction
- **Session Management** - Persistent cookies and authentication
- **Proxy Rotation** - IP rotation for high-volume scraping
- **User Agent Rotation** - Multiple browser fingerprints
- **Automatic Retries** - Configurable retry logic with backoff
- **Health Monitoring** - Worker status and performance metrics

## 🔒 Compliance & Risk Management

The marketplace aggregator implements **enterprise-grade compliance and risk management** to ensure responsible scraping practices and legal compliance across all operations.

### Core Compliance Features

#### 1. **Automated Robots.txt Compliance**

- **Real-time Parsing** - Automatically fetches and parses robots.txt for target domains
- **Intelligent Caching** - 24-hour cache with automatic refresh for efficiency
- **Path Validation** - Checks all scraping URLs against disallow rules
- **Override Controls** - Development-only override with comprehensive logging

#### 2. **Multi-Level Risk Assessment**

- **Site Classification** - Automatic risk level assignment (Low/Medium/High)
- **Dynamic Risk Calculation** - Based on site type, ToS, and legal requirements
- **Compliance Scoring** - Real-time risk assessment before job execution
- **Audit Trail** - Complete logging of all compliance decisions

#### 3. **Social Media Protection**

**⚠️ CRITICAL: Social media scrapers are disabled by default and require explicit opt-in.**

High-risk platforms (Facebook, Instagram, LinkedIn) require dual confirmation:

```bash
ENABLE_HIGH_RISK_SCRAPERS=true
TOS_RISK_ACK=true
```

### Risk Classification System

| Risk Level | Characteristics                     | Requirements                         | Examples                           |
| ---------- | ----------------------------------- | ------------------------------------ | ---------------------------------- |
| **Low**    | Public APIs, news sites, open data  | Basic robots.txt compliance          | Reddit, News APIs, Public datasets |
| **Medium** | E-commerce, job boards, classifieds | Robots.txt + rate limiting           | Amazon, eBay, LinkedIn Jobs        |
| **High**   | Social media, private networks      | Full compliance + session validation | Facebook, Instagram, LinkedIn      |

### Compliance Engine Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Job Request  │    │  Compliance     │    │  Risk          │
│   (Admin API)  │───►│  Engine         │───►│  Assessment    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Robots.txt     │    │  Site           │    │  Job           │
│  Parser         │    │  Configuration  │    │  Execution     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Environment Variables

| Variable                    | Default | Description                      | Production Use  |
| --------------------------- | ------- | -------------------------------- | --------------- |
| `OVERRIDE_ROBOTS`           | `false` | Override robots.txt restrictions | ❌ Never        |
| `ENABLE_HIGH_RISK_SCRAPERS` | `false` | Enable high-risk site scraping   | ⚠️ With caution |
| `TOS_RISK_ACK`              | `false` | Acknowledge ToS risks            | ⚠️ With caution |
| `HASH_IPS`                  | `false` | Hash IP addresses for privacy    | ✅ Recommended  |

### Compliance Validation Flow

1. **Job Creation**

   - Site risk level assessment
   - Robots.txt compliance check
   - Authentication requirement validation

2. **Pre-Execution**

   - Real-time compliance revalidation
   - Rate limiting verification
   - Session state validation

3. **Execution Monitoring**
   - Continuous compliance monitoring
   - Automatic job termination on violations
   - Real-time alerting

### Error Handling & Reporting

Compliance failures return structured, actionable errors:

```javascript
{
  success: false,
  reason: "robots_disallow" | "high_risk_disabled" | "login_required" | "rate_limit_exceeded",
  site: "site_name",
  error: "Human readable error message",
  compliance: {
    blocked: true,
    reason: "specific_reason",
    risk_level: "high",
    required_flags: ["ENABLE_HIGH_RISK_SCRAPERS", "TOS_RISK_ACK"]
  },
  recommendations: [
    "Review robots.txt for /search path",
    "Enable high-risk scrapers if appropriate",
    "Provide valid authentication cookies"
  ]
}
```

### Legal & Ethical Considerations

**⚠️ CRITICAL DISCLAIMER**: This software provides technical capabilities but does not constitute legal advice.

#### User Responsibilities

- **Terms of Service Compliance** - Respect all website ToS
- **Intellectual Property Rights** - Honor copyright and trademark protections
- **Data Protection Laws** - Comply with GDPR, CCPA, and local regulations
- **Rate Limiting** - Implement appropriate request throttling
- **Commercial Use Permissions** - Obtain necessary licenses for business use

#### Best Practices

1. **Always respect robots.txt** - Only override in development/testing
2. **Implement rate limiting** - Don't overwhelm target servers
3. **Prefer official APIs** - Use scraping only when APIs unavailable
4. **Monitor for blocks** - Implement IP/user-agent block detection
5. **Maintain valid sessions** - Keep authentication current for login sites
6. **Regular ToS review** - Website terms change frequently
7. **Legal consultation** - Seek counsel for commercial applications

### Development vs Production

#### Development Mode

```bash
# Temporary override for testing (logs warnings)
OVERRIDE_ROBOTS=true

# Enable high-risk scrapers (use with extreme caution)
ENABLE_HIGH_RISK_SCRAPERS=true
TOS_RISK_ACK=true
```

#### Production Mode

```bash
# Strict compliance enforcement
OVERRIDE_ROBOTS=false
ENABLE_HIGH_RISK_SCRAPERS=false
TOS_RISK_ACK=false
HASH_IPS=true
```

**⚠️ Never use override flags in production without legal review.**

## 🎨 Frontend Components

### Price Comparison Table

- **Expandable Groups** - Click to see all listings
- **Sorting Options** - By relevance, price, or listing count
- **Verified Seller Filter** - Show only verified sellers
- **Platform Icons** - Visual platform identification
- **Price Range Display** - Min/max pricing per group

### Admin Dashboard

The marketplace aggregator includes a **comprehensive admin interface** for managing scraping operations, monitoring system health, and controlling marketplace operations.

#### Core Admin Features

- **Scraping Management** - Create, schedule, and monitor scraping jobs
- **Seller Verification** - Approve or reject seller claims and manage verification status
- **Analytics Overview** - Real-time platform performance metrics and insights
- **System Monitoring** - Worker health, queue status, and error tracking
- **Compliance Controls** - Risk management and robots.txt compliance monitoring

#### Admin Dashboard Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dashboard     │    │   Scraping      │    │   Seller        │
│   Overview      │    │   Management    │    │   Management    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  System         │    │  Compliance     │    │  Analytics      │
│  Monitoring     │    │  Dashboard      │    │  & Reports      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Dashboard Overview

- **Real-time Metrics** - Active jobs, queue length, success rates
- **System Health** - Worker status, Redis connectivity, database performance
- **Recent Activity** - Latest scraping jobs, seller verifications, system events
- **Quick Actions** - Start/stop workers, clear queues, emergency shutdown

#### Scraping Management Interface

- **Job Creation** - Platform selection, search queries, scheduling options
- **Job Monitoring** - Real-time status, progress bars, error details
- **Queue Management** - Priority adjustment, job cancellation, bulk operations
- **Schedule Management** - Cron-based automation, recurring job setup

#### Seller Verification System

- **Claim Review** - Seller verification requests with supporting documentation
- **Verification Workflow** - Approve, reject, or request additional information
- **Seller Profiles** - Performance metrics, verification history, contact details
- **Quality Control** - Automated and manual verification processes

#### Compliance Dashboard

- **Risk Assessment** - Site-by-site compliance status and risk levels
- **Robots.txt Monitoring** - Compliance violations and override logs
- **Rate Limiting** - Current scraping rates and limit enforcement
- **Audit Trail** - Complete logging of all compliance decisions

#### System Monitoring

- **Worker Health** - Individual worker status, memory usage, uptime
- **Queue Performance** - Job processing rates, failure analysis, retry statistics
- **Resource Usage** - CPU, memory, and network utilization
- **Error Tracking** - Real-time error monitoring and alerting

#### Analytics & Reporting

- **Performance Metrics** - Success rates, processing times, error frequencies
- **Platform Insights** - Site-specific performance and compliance data
- **Trend Analysis** - Historical performance and usage patterns
- **Export Capabilities** - CSV, JSON, and PDF report generation

#### Access Control

- **Role-based Permissions** - Admin, moderator, and viewer access levels
- **Authentication** - JWT-based secure access with session management
- **Audit Logging** - Complete record of all admin actions and changes
- **IP Restrictions** - Optional IP whitelisting for enhanced security

## 🔒 Security Features

- **JWT Authentication** - Secure admin access
- **Rate Limiting** - API abuse prevention
- **Input Sanitization** - XSS and injection protection
- **CORS Configuration** - Cross-origin request control
- **Helmet Security** - HTTP header security

## 📈 Performance Optimizations

- **Database Indexing** - Optimized query performance
- **Caching Layer** - Redis-based result caching
- **Connection Pooling** - Efficient database connections
- **Async Processing** - Non-blocking scraping operations
- **Lazy Loading** - Progressive data loading

## 🧪 Testing & CI

The marketplace aggregator includes **comprehensive testing infrastructure** with automated CI/CD pipelines for reliable deployment and quality assurance.

### Testing Strategy

#### Test Types

- **Unit Tests** - Individual component and function testing
- **Integration Tests** - API endpoint and database interaction testing
- **End-to-End Tests** - Complete user workflow testing with Playwright
- **Performance Tests** - Load testing and performance benchmarking
- **Compliance Tests** - Robots.txt and risk assessment validation

#### Test Coverage

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Unit Tests    │    │ Integration     │    │   E2E Tests     │
│   (Jest)        │    │ Tests (Jest)    │    │ (Playwright)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Performance    │    │  Compliance     │    │  Security       │
│  Tests          │    │  Tests          │    │  Tests          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Running Tests

#### 1. **Unit & Integration Tests**

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit
npm run test:integration

# Run tests in watch mode
npm run test:watch
```

#### 2. **End-to-End Tests**

```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests in headed mode
npm run test:e2e:headed

# Run specific E2E test file
npm run test:e2e -- tests/e2e/scraping.spec.js
```

#### 3. **Performance Tests**

```bash
# Run load tests
npm run test:performance

# Run stress tests
npm run test:stress

# Run memory leak tests
npm run test:memory
```

#### 4. **Compliance Tests**

```bash
# Test robots.txt compliance
npm run test:compliance

# Test risk assessment
npm run test:risk

# Test rate limiting
npm run test:rate-limit
```

### Test Configuration

#### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/*.test.js",
    "!src/**/*.spec.js",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

#### Playwright Configuration

```javascript
// playwright.config.js
module.exports = {
  testDir: "./tests/e2e",
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
};
```

### Continuous Integration

#### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      redis:
        image: redis
        ports: [6379:6379]
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: test
        ports: [5432:5432]
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

#### Pre-commit Hooks

```bash
# Install pre-commit hooks
npm run install:hooks

# Run pre-commit checks
npm run pre-commit

# Available hooks
npm run lint          # ESLint code quality
npm run format        # Prettier code formatting
npm run type-check    # TypeScript type checking
npm run test:quick    # Fast unit tests
```

### Test Data Management

#### Database Seeding

```bash
# Seed test database
npm run test:seed

# Reset test database
npm run test:reset

# Create test fixtures
npm run test:fixtures
```

#### Mock Services

```bash
# Start mock services
npm run test:mocks

# Available mocks
npm run mock:redis    # Mock Redis server
npm run mock:scraper  # Mock scraping responses
npm run mock:email    # Mock email service
```

### Performance Testing

#### Load Testing with Artillery

```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery run tests/performance/load-test.yml

# Run stress test
artillery run tests/performance/stress-test.yml
```

#### Load Test Configuration

```yaml
# tests/performance/load-test.yml
config:
  target: "http://localhost:3001"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 300
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"

scenarios:
  - name: "API endpoints"
    weight: 70
    flow:
      - get:
          url: "/api/health"
      - think: 1
      - get:
          url: "/api/listings"
      - think: 2
      - get:
          url: "/api/categories"

  - name: "Scraping jobs"
    weight: 30
    flow:
      - post:
          url: "/api/admin/scraping/jobs"
          json:
            platform: "amazon"
            searchQuery: "test"
```

### Security Testing

#### OWASP ZAP Integration

```bash
# Run security scan
npm run test:security

# Generate security report
npm run test:security:report

# Available security tests
npm run test:sql-injection
npm run test:xss
npm run test:csrf
npm run test:auth
```

### Test Utilities

#### Test Helpers

```javascript
// tests/helpers/database.js
export const createTestUser = async (userData = {}) => {
  const defaultUser = {
    email: "test@example.com",
    password: "password123",
    role: "user",
  };

  return await User.create({ ...defaultUser, ...userData });
};

export const createTestListing = async (listingData = {}) => {
  const defaultListing = {
    title: "Test Product",
    price: 99.99,
    currency: "USD",
  };

  return await Listing.create({ ...defaultListing, ...listingData });
};
```

#### API Testing Utilities

```javascript
// tests/helpers/api.js
export const createAuthenticatedRequest = async (app, userData = {}) => {
  const user = await createTestUser(userData);
  const token = generateJWT(user);

  return {
    user,
    token,
    request: (method, url, data = {}) => {
      return request(app)
        [method.toLowerCase()](url)
        .set("Authorization", `Bearer ${token}`)
        .send(data);
    },
  };
};
```

### Quality Gates

#### Coverage Requirements

- **Unit Tests**: Minimum 80% coverage
- **Integration Tests**: Minimum 70% coverage
- **E2E Tests**: Critical user flows covered
- **Performance Tests**: Response time < 200ms under load

#### Code Quality

- **Linting**: ESLint with strict rules
- **Formatting**: Prettier with consistent style
- **Type Safety**: TypeScript or JSDoc type checking
- **Security**: OWASP Top 10 compliance

### Debugging Tests

#### Test Debugging

```bash
# Run tests with debug output
DEBUG=* npm test

# Run specific test with debugging
npm run test:debug -- --testNamePattern="should create listing"

# Run tests with verbose output
npm test -- --verbose
```

#### E2E Debugging

```bash
# Run E2E tests in headed mode
npm run test:e2e:headed

# Run E2E tests with slow motion
npm run test:e2e -- --headed --slowMo=1000

# Debug specific E2E test
npm run test:e2e:debug -- tests/e2e/scraping.spec.js
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

## ⚙️ Running the Worker

The marketplace aggregator uses **Playwright-based workers** with Redis job queues for reliable, scalable scraping operations.

### Worker Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Admin API     │    │   Redis Queue   │    │   Playwright    │
│   (Job Creator) │───►│   (BullMQ)      │───►│   Workers      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Job Scheduler  │    │  Job Monitor    │    │  Result Store   │
│  (node-cron)    │    │  (Real-time)    │    │  (Database)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Starting the Worker

#### 1. **Local Development**

```bash
# Start Redis (required for job queue)
redis-server

# Start the worker in a new terminal
cd backend
npm run worker:start

# Or start with specific concurrency
WORKER_CONCURRENCY=3 npm run worker:start
```

#### 2. **Production Deployment**

```bash
# Start with PM2 process manager
pm2 start ecosystem.config.js --env production

# Or start directly
NODE_ENV=production npm run worker:start
```

#### 3. **Docker Deployment**

```bash
# Start Redis and Worker services
docker-compose up -d redis worker

# View worker logs
docker-compose logs -f worker

# Scale workers
docker-compose up -d --scale worker=3
```

### Worker Configuration

#### Environment Variables

| Variable              | Default                  | Description                           |
| --------------------- | ------------------------ | ------------------------------------- |
| `WORKER_CONCURRENCY`  | `2`                      | Number of concurrent scraping jobs    |
| `REDIS_URL`           | `redis://localhost:6379` | Redis connection string               |
| `PLAYWRIGHT_HEADLESS` | `true`                   | Run browsers in headless mode         |
| `MATCH_THRESHOLD`     | `0.82`                   | Product matching confidence threshold |
| `BASE_CURRENCY`       | `USD`                    | Base currency for price conversion    |
| `FX_JSON`             | `{"USD":1,"EUR":1.09}`   | Currency exchange rates               |

#### Performance Tuning

```bash
# High-performance scraping (use with caution)
WORKER_CONCURRENCY=5
PLAYWRIGHT_HEADLESS=true
REDIS_URL=redis://localhost:6379

# Conservative scraping (recommended for production)
WORKER_CONCURRENCY=2
PLAYWRIGHT_HEADLESS=true
REDIS_URL=redis://localhost:6379
```

### Worker Health Monitoring

#### Real-time Status

```bash
# Check worker health
curl http://localhost:3001/api/admin/worker/health

# View active jobs
curl http://localhost:3001/api/admin/worker/jobs

# Monitor queue status
curl http://localhost:3001/api/admin/worker/queue
```

#### Log Monitoring

```bash
# View worker logs
tail -f logs/worker.log

# Filter by job type
grep "SCRAPING_JOB" logs/worker.log

# Monitor errors
grep "ERROR" logs/worker.log
```

### Job Management

#### Creating Scraping Jobs

```bash
# Create a new scraping job
curl -X POST http://localhost:3001/api/admin/scraping/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "amazon",
    "searchQuery": "iphone 15",
    "maxPages": 5,
    "priority": "high"
  }'
```

#### Job Scheduling

```bash
# Schedule recurring jobs
curl -X POST http://localhost:3001/api/admin/scraping/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "amazon",
    "searchQuery": "laptop",
    "cronExpression": "0 */6 * * *",
    "enabled": true
  }'
```

#### Job Monitoring

```bash
# View all jobs
curl http://localhost:3001/api/admin/scraping/jobs

# Get job details
curl http://localhost:3001/api/admin/scraping/jobs/{jobId}

# Cancel a job
curl -X DELETE http://localhost:3001/api/admin/scraping/jobs/{jobId}
```

### Troubleshooting

#### Common Issues

1. **Worker Not Starting**

   ```bash
   # Check Redis connection
   redis-cli ping

   # Verify environment variables
   echo $REDIS_URL
   echo $WORKER_CONCURRENCY
   ```

2. **Jobs Stuck in Queue**

   ```bash
   # Clear failed jobs
   curl -X POST http://localhost:3001/api/admin/worker/clear-failed

   # Restart worker
   pm2 restart worker
   ```

3. **High Memory Usage**

   ```bash
   # Reduce concurrency
   WORKER_CONCURRENCY=1 npm run worker:start

   # Enable garbage collection
   NODE_OPTIONS="--max-old-space-size=2048" npm run worker:start
   ```

#### Performance Optimization

```bash
# Monitor resource usage
htop
iotop -o

# Check Playwright browser processes
ps aux | grep chromium

# Monitor Redis memory
redis-cli info memory
```

### Docker Deployment

The project includes Docker support for the worker and Redis services:

```bash
# Start Redis and Worker services
docker-compose up -d redis worker

# View worker logs
docker-compose logs -f worker

# Stop services
docker-compose down

# Rebuild worker image
npm run docker:build
```

#### Docker Services

- **Redis**: Job queue backend (port 6379)
- **Worker**: Scraping job processor with Playwright
- **API**: Can run locally or in Docker (optional)

#### Worker Configuration

The worker runs in a separate container with:

- Playwright Chromium browser
- BullMQ job processing
- Automatic retry logic
- Health monitoring

### Environment Variables

```bash
# Required
NODE_ENV=production
PORT=3001
JWT_SECRET=your-secret-key
DATABASE_URL=postgres://user:pass@host/db

# Currency & Pricing
BASE_CURRENCY=USD
FX_JSON={"USD":1,"EUR":1.09,"GBP":1.27,"PKR":0.0036,"INR":0.012,"CAD":0.74,"AUD":0.66,"JPY":0.0067,"CNY":0.14,"KRW":0.00075}

# Product Matching
MATCH_THRESHOLD=0.82

# Compliance & Risk Management
OVERRIDE_ROBOTS=false
TOS_RISK_ACK=false
ENABLE_HIGH_RISK_SCRAPERS=false
HASH_IPS=false

# Optional
REDIS_URL=redis://localhost:6379
LOG_LEVEL=info
HEADLESS=true
```

### Docker Support

```bash
docker build -t market-aggregator .
docker run -p 3001:3001 market-aggregator
```

## 🚀 Deploy Playwright Worker

The marketplace aggregator's **Playwright-based scraping workers** can be deployed to cloud platforms for scalable, production-ready scraping operations.

### Cloud Deployment Options

#### 1. **Render (Recommended)**

Render provides excellent support for Playwright workers with automatic Chromium installation.

**Deployment Steps:**

```bash
# 1. Create render.yaml for automatic deployment
services:
  - type: web
    name: market-aggregator-api
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: market-aggregator-db
          property: connectionString

  - type: worker
    name: market-aggregator-worker
    env: node
    buildCommand: npm install && npm run install:playwright
    startCommand: npm run worker:start
    envVars:
      - key: NODE_ENV
        value: production
      - key: REDIS_URL
        fromService:
          type: redis
          name: market-aggregator-redis
          property: connectionString
      - key: DATABASE_URL
        fromDatabase:
          name: market-aggregator-db
          property: connectionString

databases:
  - name: market-aggregator-db
    databaseName: market_aggregator
    user: market_aggregator_user

  - name: market-aggregator-redis
    type: redis
```

**Environment Variables:**

```bash
# Required for Playwright
NODE_ENV=production
REDIS_URL=redis://your-redis-url:6379
DATABASE_URL=postgresql://user:pass@host/db

# Worker configuration
WORKER_CONCURRENCY=2
PLAYWRIGHT_HEADLESS=true
MATCH_THRESHOLD=0.82

# Compliance settings
OVERRIDE_ROBOTS=false
ENABLE_HIGH_RISK_SCRAPERS=false
TOS_RISK_ACK=false
```

#### 2. **Railway**

Railway offers seamless deployment with automatic environment variable management.

**Deployment Steps:**

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project
railway init

# 4. Deploy services
railway up
```

**railway.json Configuration:**

```json
{
  "build": {
    "builder": "nixpacks",
    "buildCommand": "npm install && npm run install:playwright"
  },
  "deploy": {
    "startCommand": "npm run worker:start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

#### 3. **Heroku**

Heroku requires additional buildpacks for Playwright support.

**Deployment Steps:**

```bash
# 1. Create Heroku app
heroku create your-app-name

# 2. Add Playwright buildpack
heroku buildpacks:add --index 1 https://github.com/heroku/heroku-buildpack-google-chrome

# 3. Add Node.js buildpack
heroku buildpacks:add --index 2 heroku/nodejs

# 4. Deploy
git push heroku main
```

**Heroku-specific Configuration:**

```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set REDIS_URL=your-redis-url
heroku config:set DATABASE_URL=your-postgres-url

# Scale worker dynos
heroku ps:scale worker=1
```

### ⚠️ **Critical: Chromium Installation**

All cloud deployments require proper Chromium installation for Playwright to function.

#### **Render & Railway (Automatic)**

These platforms automatically install Chromium during the build process.

#### **Heroku (Manual)**

Requires the Chrome buildpack for Chromium support.

#### **Other Platforms**

Ensure Chromium is available in the deployment environment:

```dockerfile
# Dockerfile example
FROM mcr.microsoft.com/playwright:v1.40.0-focal

# Install Node.js
RUN apt-get update && apt-get install -y nodejs npm

# Copy application
COPY . /app
WORKDIR /app

# Install dependencies
RUN npm ci

# Install Playwright browsers
RUN npx playwright install chromium

# Start worker
CMD ["npm", "run", "worker:start"]
```

### Environment Configuration

#### **Production Environment Variables**

```bash
# Database & Redis
DATABASE_URL=postgresql://user:pass@host/db
REDIS_URL=redis://your-redis-url:6379

# Worker Configuration
WORKER_CONCURRENCY=2
PLAYWRIGHT_HEADLESS=true
MATCH_THRESHOLD=0.82

# Currency & Pricing
BASE_CURRENCY=USD
FX_JSON={"USD":1,"EUR":1.09,"PKR":0.0036}

# Compliance & Risk
OVERRIDE_ROBOTS=false
TOS_RISK_ACK=false
ENABLE_HIGH_RISK_SCRAPERS=false

# Performance
LOG_LEVEL=info
REQUEST_TIMEOUT=30000
REQUEST_DELAY=1000
MAX_CONCURRENT=5
```

#### **Platform-Specific Variables**

**Render:**

```bash
# Automatic from render.yaml
# No additional configuration needed
```

**Railway:**

```bash
# Set in Railway dashboard
# Variables are automatically available
```

**Heroku:**

```bash
# Set via CLI or dashboard
heroku config:set WORKER_CONCURRENCY=2
heroku config:set PLAYWRIGHT_HEADLESS=true
```

### Monitoring & Scaling

#### **Health Checks**

```bash
# Worker health endpoint
GET /api/admin/worker/health

# Expected response
{
  "status": "healthy",
  "workers": 2,
  "activeJobs": 5,
  "queueLength": 12,
  "uptime": 3600
}
```

#### **Scaling Workers**

**Render:**

```yaml
# render.yaml
services:
  - type: worker
    name: market-aggregator-worker
    # Automatic scaling based on queue length
    autoScaling:
      minInstances: 1
      maxInstances: 5
      targetConcurrency: 2
```

**Railway:**

```bash
# Scale via CLI
railway scale worker=3

# Or via dashboard
# Navigate to service → Settings → Scale
```

**Heroku:**

```bash
# Scale worker dynos
heroku ps:scale worker=3

# Monitor scaling
heroku ps
```

### Troubleshooting Cloud Deployments

#### **Common Issues**

1. **Chromium Not Found**

   ```bash
   # Check if Chromium is installed
   npx playwright --version

   # Reinstall Playwright browsers
   npx playwright install chromium
   ```

2. **Memory Issues**

   ```bash
   # Reduce worker concurrency
   WORKER_CONCURRENCY=1

   # Increase memory allocation (platform-specific)
   # Render: Upgrade to higher tier
   # Railway: Increase memory limit
   # Heroku: Upgrade dyno type
   ```

3. **Redis Connection Issues**

   ```bash
   # Verify Redis URL
   echo $REDIS_URL

   # Test Redis connection
   redis-cli -u $REDIS_URL ping
   ```

#### **Logs & Debugging**

**Render:**

```bash
# View logs in dashboard
# Or via CLI
render logs --service market-aggregator-worker
```

**Railway:**

```bash
# View logs
railway logs --service worker

# Follow logs
railway logs --service worker --follow
```

**Heroku:**

```bash
# View logs
heroku logs --tail --app your-app-name

# Filter worker logs
heroku logs --tail --app your-app-name | grep worker
```

### Performance Optimization

#### **Cloud-Specific Tuning**

**Render:**

```yaml
# render.yaml optimization
services:
  - type: worker
    name: market-aggregator-worker
    envVars:
      - key: WORKER_CONCURRENCY
        value: "2"
      - key: PLAYWRIGHT_HEADLESS
        value: "true"
      - key: NODE_OPTIONS
        value: "--max-old-space-size=2048"
```

**Railway:**

```bash
# Set memory limit
railway variables set NODE_OPTIONS="--max-old-space-size=2048"

# Optimize concurrency
railway variables set WORKER_CONCURRENCY=2
```

**Heroku:**

```bash
# Use appropriate dyno type
heroku ps:type worker=standard-2x

# Set memory optimization
heroku config:set NODE_OPTIONS="--max-old-space-size=2048"
```

### Security Considerations

#### **Production Security**

```bash
# Never use development flags in production
OVERRIDE_ROBOTS=false
ENABLE_HIGH_RISK_SCRAPERS=false
TOS_RISK_ACK=false

# Enable security features
HASH_IPS=true
LOG_LEVEL=info
```

#### **Access Control**

```bash
# Secure admin endpoints
ADMIN_IP_WHITELIST=192.168.1.0/24,10.0.0.0/8

# JWT configuration
JWT_SECRET=your-super-secure-secret
JWT_EXPIRES_IN=24h
```

### Cost Optimization

#### **Resource Management**

**Render:**

- Start with free tier for testing
- Scale up based on actual usage
- Use auto-scaling for cost efficiency

**Railway:**

- Monitor usage in dashboard
- Set spending limits
- Use appropriate instance types

**Heroku:**

- Start with hobby dynos
- Scale based on queue length
- Monitor dyno hours usage

## 🔮 Roadmap

### Phase 2 (Q2 2024)

- [ ] **Mobile Applications** - iOS and Android apps
- [ ] **Advanced Analytics** - User behavior tracking
- [ ] **API Marketplace** - Third-party integrations
- [ ] **Real-time Updates** - WebSocket notifications

### Phase 3 (Q3 2024)

- [ ] **AI-Powered Features** - Smart categorization
- [ ] **Price Prediction** - ML-based pricing insights
- [ ] **Internationalization** - Multi-language support
- [ ] **Enterprise Features** - White-label solutions

### Phase 4 (Q4 2024)

- [ ] **Blockchain Integration** - Decentralized marketplace
- [ ] **AR Product Viewing** - Virtual product inspection
- [ ] **Voice Search** - Natural language queries
- [ ] **Advanced Fraud Detection** - AI-powered security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/saifali/market-aggregator/wiki)
- **Issues**: [GitHub Issues](https://github.com/saifali/market-aggregator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/saifali/market-aggregator/discussions)
- **Email**: saifalisalman4@gmail.com

## 🙏 Acknowledgments

- **Playwright** - Web scraping automation
- **Sequelize** - Database ORM
- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS
- **Node-cron** - Task scheduling

---

**Built with ❤️ by Saif Ali**

_Last updated: August 2025_
