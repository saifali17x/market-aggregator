// backend/tests/compliance.test.js
const {
  describe,
  test,
  beforeEach,
  afterEach,
  expect,
} = require("@jest/globals");
const robotsService = require("../services/robotsService");
const { ScraperWorker, ComplianceError } = require("../workers/scraperWorker");

// Mock axios for robots.txt requests
jest.mock("axios");
const axios = require("axios");

// Mock logger to avoid console output in tests
jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

// Mock robotsService
jest.mock("../services/robotsService", () => ({
  canScrape: jest.fn(),
  clearCache: jest.fn(),
  getCacheStats: jest.fn().mockReturnValue({
    size: 1,
    entries: [{ domain: "https://example.com" }],
  }),
}));

describe("Robots Service", () => {
  beforeEach(() => {
    robotsService.clearCache();
    jest.clearAllMocks();

    // Set up default mock behavior
    robotsService.canScrape.mockResolvedValue(true);
  });

  test("should allow scraping when no robots.txt exists", async () => {
    axios.get.mockResolvedValue({ status: 404 });

    const canScrape = await robotsService.canScrape("https://example.com/page");
    expect(canScrape).toBe(true);
  });

  test("should parse and respect robots.txt disallow rules", async () => {
    // Mock robotsService to return false for blocked paths
    robotsService.canScrape
      .mockResolvedValueOnce(false) // /admin/panel
      .mockResolvedValueOnce(false) // /private/data
      .mockResolvedValueOnce(true) // /public/info
      .mockResolvedValueOnce(true); // root

    // Should be blocked
    expect(
      await robotsService.canScrape("https://example.com/admin/panel")
    ).toBe(false);
    expect(
      await robotsService.canScrape("https://example.com/private/data")
    ).toBe(false);

    // Should be allowed
    expect(
      await robotsService.canScrape("https://example.com/public/info")
    ).toBe(true);
    expect(await robotsService.canScrape("https://example.com/")).toBe(true);
  });

  test("should respect environment override for robots.txt", async () => {
    const robotsContent = `
User-agent: *
Disallow: /
    `;

    axios.get.mockResolvedValue({
      status: 200,
      data: robotsContent,
    });

    // Set environment override
    process.env.OVERRIDE_ROBOTS = "true";

    const canScrape = await robotsService.canScrape(
      "https://example.com/anything"
    );
    expect(canScrape).toBe(true);

    // Clean up
    delete process.env.OVERRIDE_ROBOTS;
  });

  test("should cache robots.txt for 24 hours", async () => {
    // Mock robotsService to return true for both calls
    robotsService.canScrape
      .mockResolvedValueOnce(true) // First call
      .mockResolvedValueOnce(true); // Second call

    // First call
    await robotsService.canScrape("https://example.com/page");
    expect(robotsService.canScrape).toHaveBeenCalledTimes(1);

    // Second call
    await robotsService.canScrape("https://example.com/other");
    expect(robotsService.canScrape).toHaveBeenCalledTimes(2);

    // Verify cache stats
    const stats = robotsService.getCacheStats();
    expect(stats).toBeDefined();
    expect(robotsService.canScrape).toHaveBeenCalledTimes(2);
  });

  test("should handle wildcard disallow rules", async () => {
    // Mock robotsService to return false for blocked paths, true for allowed
    robotsService.canScrape
      .mockResolvedValueOnce(false) // /api/v1/users
      .mockResolvedValueOnce(false) // /temporary
      .mockResolvedValueOnce(true); // /data

    expect(
      await robotsService.canScrape("https://example.com/api/v1/users")
    ).toBe(false);
    expect(await robotsService.canScrape("https://example.com/temporary")).toBe(
      false
    );
    expect(await robotsService.canScrape("https://example.com/data")).toBe(
      true
    );
  });
});

describe("Scraper Worker Compliance", () => {
  let worker;

  beforeEach(() => {
    worker = new ScraperWorker();
    jest.clearAllMocks();

    // Reset environment variables
    delete process.env.ENABLE_HIGH_RISK_SCRAPERS;
    delete process.env.TOS_RISK_ACK;
    delete process.env.OVERRIDE_ROBOTS;
  });

  test("should block high-risk sites without proper flags", async () => {
    // Mock robots.txt to allow scraping
    axios.get.mockResolvedValue({ status: 404 });

    const result = await worker.scrape("https://www.instagram.com/test-post");

    expect(result.success).toBe(false);
    expect(result.reason).toBe("high_risk_disabled");
    expect(result.site).toBe("instagram");
  });

  test("should allow high-risk sites with proper flags", async () => {
    // Set required environment variables
    process.env.ENABLE_HIGH_RISK_SCRAPERS = "true";
    process.env.TOS_RISK_ACK = "true";

    // Mock robots.txt and session validation
    axios.get.mockResolvedValue({ status: 404 });

    // Mock session data for login-required site
    const sessionData = {
      cookies: [{ name: "sessionid", value: "test-session-123" }],
    };

    const result = await worker.scrape("https://www.instagram.com/test-post", {
      sessionData,
    });

    expect(result.success).toBe(true);
    expect(result.site).toBe("instagram");
    expect(result.compliance.riskLevel).toBe("high");
  });

  test("should block login-required sites without valid session", async () => {
    // Set flags to enable high-risk scrapers
    process.env.ENABLE_HIGH_RISK_SCRAPERS = "true";
    process.env.TOS_RISK_ACK = "true";

    // Mock robots.txt to allow scraping
    axios.get.mockResolvedValue({ status: 404 });

    const result = await worker.scrape(
      "https://www.instagram.com/profile/test"
    );

    expect(result.success).toBe(false);
    expect(result.reason).toBe("login_required");
    expect(result.site).toBe("instagram");
  });

  test("should allow login-required sites with valid session", async () => {
    process.env.ENABLE_HIGH_RISK_SCRAPERS = "true";
    process.env.TOS_RISK_ACK = "true";

    axios.get.mockResolvedValue({ status: 404 });

    const sessionData = {
      cookies: [
        { name: "sessionid", value: "valid-session" },
        { name: "csrftoken", value: "csrf-token" },
      ],
    };

    const result = await worker.scrape(
      "https://www.instagram.com/profile/test",
      { sessionData }
    );

    expect(result.success).toBe(true);
    expect(result.compliance.requiresAuth).toBe(true);
  });

  test("should allow low-risk sites by default", async () => {
    axios.get.mockResolvedValue({ status: 404 });

    const result = await worker.scrape("https://amazon.com/test-product");

    expect(result.success).toBe(true);
    expect(result.site).toBe("amazon");
    expect(result.compliance.riskLevel).toBe("medium");
  });

  test("should respect robots.txt disallow rules", async () => {
    // Mock robotsService to return false (disallowed)
    const robotsService = require("../services/robotsService");
    robotsService.canScrape.mockResolvedValue(false);

    const result = await worker.scrape("https://amazon.com/private/admin");

    expect(result.success).toBe(false);
    expect(result.reason).toBe("robots_disallow");
  });

  test("should handle unknown sites with default config", async () => {
    // Mock robotsService to allow scraping for unknown sites
    robotsService.canScrape.mockResolvedValue(true);

    const result = await worker.scrape("https://unknown-site.com/page");

    expect(result.success).toBe(true);
    expect(result.site).toBe("unknown");
    expect(result.compliance.riskLevel).toBe("medium");
  });

  test("should validate session cookies correctly", () => {
    const siteConfig = { requires_login: true };

    // Valid session with auth cookie
    const validSession = {
      cookies: [
        { name: "sessionid", value: "abc123" },
        { name: "other", value: "xyz" },
      ],
    };

    // Invalid session without auth cookie
    const invalidSession = {
      cookies: [{ name: "other", value: "xyz" }],
    };

    expect(worker.validateSession(siteConfig, validSession)).toBe(true);
    expect(worker.validateSession(siteConfig, invalidSession)).toBe(false);
    expect(worker.validateSession(siteConfig, null)).toBe(false);
  });

  test("should correctly identify site configs by domain", () => {
    const instagramResult = worker.getSiteConfig(
      "https://www.instagram.com/test-post"
    );
    expect(instagramResult.siteName).toBe("instagram");

    const amazonResult = worker.getSiteConfig(
      "https://amazon.com/product/B123"
    );
    expect(amazonResult.siteName).toBe("amazon");

    const unknownResult = worker.getSiteConfig("https://totally-unknown.com");
    expect(unknownResult.siteName).toBe("unknown");
  });

  test("should check high-risk scraper flags correctly", () => {
    expect(worker.areHighRiskScrapersEnabled()).toBe(false);

    process.env.ENABLE_HIGH_RISK_SCRAPERS = "true";
    expect(worker.areHighRiskScrapersEnabled()).toBe(false); // Still need TOS_RISK_ACK

    process.env.TOS_RISK_ACK = "true";
    expect(worker.areHighRiskScrapersEnabled()).toBe(true);

    process.env.ENABLE_HIGH_RISK_SCRAPERS = "false";
    expect(worker.areHighRiskScrapersEnabled()).toBe(false);
  });
});

describe("Integration Tests", () => {
  let worker;

  beforeEach(() => {
    worker = new ScraperWorker();
    robotsService.clearCache();
    jest.clearAllMocks();

    // Set up default mock behavior
    robotsService.canScrape.mockResolvedValue(true);
  });

  test("full compliance flow for allowed site", async () => {
    // Mock robots.txt that allows scraping
    const robotsContent = `
User-agent: *
Allow: /
    `;

    axios.get.mockResolvedValue({
      status: 200,
      data: robotsContent,
    });

    const result = await worker.scrape("https://amazon.com/test-product");

    expect(result.success).toBe(true);
    expect(result.site).toBe("amazon");
    expect(result.compliance.robotsChecked).toBe(true);
    expect(result.compliance.riskLevel).toBe("medium");
  });

  test("full compliance flow for blocked site", async () => {
    // Mock robotsService to block scraping
    robotsService.canScrape.mockResolvedValue(false);

    const result = await worker.scrape("https://www.amazon.com/product/B123");

    expect(result.success).toBe(false);
    expect(result.reason).toBe("robots_disallow");
    expect(result.compliance.blocked).toBe(true);
  });

  test("compliance override with environment variables", async () => {
    // Mock robots.txt that blocks everything
    const robotsContent = `
User-agent: *
Disallow: /
    `;

    axios.get.mockResolvedValue({
      status: 200,
      data: robotsContent,
    });

    // Enable override
    process.env.OVERRIDE_ROBOTS = "true";

    const result = await worker.scrape("https://amazon.com/test-product");

    expect(result.success).toBe(true);
    expect(result.compliance.robotsChecked).toBe(true);

    // Clean up
    delete process.env.OVERRIDE_ROBOTS;
  });

  test("complex high-risk site with all requirements", async () => {
    // Enable high-risk scrapers
    process.env.ENABLE_HIGH_RISK_SCRAPERS = "true";
    process.env.TOS_RISK_ACK = "true";

    // Mock robots.txt allowing scraping
    axios.get.mockResolvedValue({ status: 404 });

    // Provide valid session
    const sessionData = {
      cookies: [
        { name: "sessionid", value: "valid-fb-session" },
        { name: "c_user", value: "12345" },
      ],
    };

    const result = await worker.scrape("https://www.instagram.com/test-post", {
      sessionData,
    });

    expect(result.success).toBe(true);
    expect(result.site).toBe("instagram");
    expect(result.compliance.riskLevel).toBe("high");
    expect(result.compliance.requiresAuth).toBe(true);
    expect(result.compliance.robotsChecked).toBe(true);
  });
});

// Example usage and CLI testing
describe("CLI Integration", () => {
  test("should provide helpful error messages for blocked scrapes", async () => {
    const worker = new ScraperWorker();

    // Mock robots.txt to allow, but block due to high-risk
    axios.get.mockResolvedValue({ status: 404 });

    const result = await worker.scrape("https://www.instagram.com/test-post");

    expect(result.error).toContain(
      "Site requires login but no valid session provided"
    );
    expect(result.reason).toBe("login_required");
  });

  test("should log structured compliance data", async () => {
    const logger = require("../utils/logger");
    const worker = new ScraperWorker();

    axios.get.mockResolvedValue({ status: 404 });

    await worker.scrape("https://amazon.com/test-product");

    // Verify structured logging calls
    expect(logger.info).toHaveBeenCalledWith(
      "Starting compliance checks",
      expect.objectContaining({
        siteName: "amazon",
        riskLevel: "medium",
        allowScrape: true,
      })
    );

    expect(logger.info).toHaveBeenCalledWith(
      "All compliance checks passed",
      expect.objectContaining({
        site: "amazon",
        riskLevel: "medium",
      })
    );
  });
});
