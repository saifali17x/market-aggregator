// backend/tests/integration.test.js
const { describe, test, beforeEach, afterEach, expect } = require('@jest/globals');
const { ScraperWorker } = require('../workers/scraperWorker');
const robotsService = require('../services/robotsService');

// Mock logger to avoid console output in tests
jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}));

describe('Compliance System Integration', () => {
  let worker;
  
  beforeEach(() => {
    worker = new ScraperWorker();
    // Reset environment variables
    delete process.env.ENABLE_HIGH_RISK_SCRAPERS;
    delete process.env.TOS_RISK_ACK;
    delete process.env.OVERRIDE_ROBOTS;
  });

  test('should load site configurations correctly', () => {
    expect(worker.siteConfigs).toBeDefined();
    expect(Object.keys(worker.siteConfigs).length).toBeGreaterThan(0);
    
    // Check that essential sites are loaded
    const siteNames = Object.keys(worker.siteConfigs);
    expect(siteNames).toContain('amazon');
    expect(siteNames).toContain('ebay');
  });

  test('should identify site configurations by domain', () => {
    const amazonResult = worker.getSiteConfig('https://amazon.com/product/B123');
    expect(amazonResult.siteName).toBe('amazon');
    expect(amazonResult.config.name).toBe('amazon');
    
    const ebayResult = worker.getSiteConfig('https://ebay.com/itm/123');
    expect(ebayResult.siteName).toBe('ebay');
    expect(ebayResult.config.name).toBe('ebay');
  });

  test('should handle unknown sites with default config', () => {
    const unknownResult = worker.getSiteConfig('https://unknown-site.com/page');
    expect(unknownResult.siteName).toBe('unknown');
    expect(unknownResult.config.risk_level).toBe('medium');
    expect(unknownResult.config.allow_scrape).toBe(true);
  });

  test('should check high-risk scraper flags correctly', () => {
    expect(worker.areHighRiskScrapersEnabled()).toBe(false);
    
    process.env.ENABLE_HIGH_RISK_SCRAPERS = 'true';
    expect(worker.areHighRiskScrapersEnabled()).toBe(false); // Still need TOS_RISK_ACK
    
    process.env.TOS_RISK_ACK = 'true';
    expect(worker.areHighRiskScrapersEnabled()).toBe(true);
  });

  test('should validate session data correctly', () => {
    const siteConfig = { requiresAuth: true };
    
    // Valid session with auth cookie
    const validSession = {
      cookies: [
        { name: 'sessionid', value: 'abc123' },
        { name: 'other', value: 'xyz' }
      ]
    };
    
    // Invalid session without auth cookie
    const invalidSession = {
      cookies: [
        { name: 'other', value: 'xyz' }
      ]
    };
    
    expect(worker.validateSession(siteConfig, validSession)).toBe(true);
    expect(worker.validateSession(siteConfig, invalidSession)).toBe(false);
    expect(worker.validateSession(siteConfig, null)).toBe(false);
  });

  test('should handle backward compatibility for login fields', () => {
    const siteConfig1 = { requiresAuth: true };
    const siteConfig2 = { requires_login: true };
    const siteConfig3 = { requiresAuth: false, requires_login: false };
    
    const sessionData = {
      cookies: [{ name: 'sessionid', value: 'abc123' }]
    };
    
    expect(worker.validateSession(siteConfig1, sessionData)).toBe(true);
    expect(worker.validateSession(siteConfig2, sessionData)).toBe(true);
    expect(worker.validateSession(siteConfig3, sessionData)).toBe(true);
  });
});

describe('Robots Service Integration', () => {
  test('should have canScrape method', () => {
    expect(typeof robotsService.canScrape).toBe('function');
  });

  test('should have clearCache method', () => {
    expect(typeof robotsService.clearCache).toBe('function');
  });

  test('should have getCacheStats method', () => {
    expect(typeof robotsService.getCacheStats).toBe('function');
  });
});
