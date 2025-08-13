// backend/workers/scraperWorker.js - Compliance-focused scraper worker
const robotsService = require('../services/robotsService');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

class ComplianceError extends Error {
  constructor(message, reason, site) {
    super(message);
    this.name = 'ComplianceError';
    this.reason = reason;
    this.site = site;
  }
}

class ScraperWorker {
  constructor() {
    this.siteConfigs = this.loadSiteConfigs();
    this.browser = null;
  }

  /**
   * Initialize the worker
   */
  async initialize() {
    logger.info('Initializing ScraperWorker...');
    // Browser initialization can be added here if needed
    logger.info('ScraperWorker initialized successfully');
  }

  /**
   * Shutdown the worker
   */
  async shutdown() {
    logger.info('Shutting down ScraperWorker...');
    if (this.browser) {
      await this.browser.close();
    }
    logger.info('ScraperWorker shutdown completed');
  }

  /**
   * Load all site configuration files
   */
  loadSiteConfigs() {
    const configsPath = path.join(__dirname, '../config/sites');
    const configs = {};

    try {
      const files = fs.readdirSync(configsPath);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const siteName = file.replace('.json', '');
          const configPath = path.join(configsPath, file);
          configs[siteName] = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
      }

      logger.info('Loaded site configurations', { 
        sites: Object.keys(configs),
        count: Object.keys(configs).length 
      });
    } catch (error) {
      logger.error('Failed to load site configurations', { error: error.message });
    }

    return configs;
  }

  /**
   * Get site configuration by URL or site name
   */
  getSiteConfig(url) {
    const domain = new URL(url).hostname.toLowerCase();
    
    // Try to match by domain
    for (const [siteName, config] of Object.entries(this.siteConfigs)) {
      const configDomain = new URL(config.baseUrl).hostname.toLowerCase();
      if (domain === configDomain || domain.includes(configDomain.replace('www.', ''))) {
        return { siteName, config };
      }
    }

    // Return default config for unknown sites
    return {
      siteName: 'unknown',
      config: {
        name: 'Unknown Site',
        allow_scrape: true,
        requiresAuth: false,
        requires_login: false,
        risk_level: 'medium',
        compliance_notes: 'Site not in configuration database'
      }
    };
  }

  /**
   * Check if high-risk scrapers are enabled
   */
  areHighRiskScrapersEnabled() {
    return process.env.ENABLE_HIGH_RISK_SCRAPERS === 'true' && 
           process.env.TOS_RISK_ACK === 'true';
  }

  /**
   * Validate session/cookies for login-required sites
   */
  validateSession(siteConfig, sessionData = null) {
    // Handle both field names for backward compatibility
    const requiresAuth = siteConfig.requiresAuth || siteConfig.requires_login;
    if (!requiresAuth) {
      return true;
    }

    // Check if we have valid session data (cookies, tokens, etc.)
    if (!sessionData || !sessionData.cookies) {
      return false;
    }

    // Basic validation - check for common auth cookies
    const authCookies = ['sessionid', 'auth_token', 'access_token', 'PHPSESSID', 'connect.sid'];
    const hasAuthCookie = sessionData.cookies.some(cookie => 
      authCookies.some(authName => 
        cookie.name.toLowerCase().includes(authName.toLowerCase())
      )
    );

    return hasAuthCookie;
  }

  /**
   * Perform compliance checks before scraping
   */
  async performComplianceChecks(url, sessionData = null) {
    const { siteName, config: siteConfig } = this.getSiteConfig(url);
    
    logger.info('Starting compliance checks', { 
      url, 
      siteName, 
      riskLevel: siteConfig.risk_level,
      allowScrape: siteConfig.allow_scrape,
      requiresAuth: siteConfig.requiresAuth || siteConfig.requires_login
    });

    // Check 1: Site-specific allow_scrape flag
    if (siteConfig.allow_scrape !== true) {
      const highRiskEnabled = this.areHighRiskScrapersEnabled();
      
      if (!highRiskEnabled) {
        const reason = 'high_risk_disabled';
        logger.warn('Scraping blocked - high risk site not enabled', {
          site: siteName,
          url,
          reason,
          riskLevel: siteConfig.risk_level,
          requiresFlags: 'ENABLE_HIGH_RISK_SCRAPERS=true AND TOS_RISK_ACK=true'
        });
        
        throw new ComplianceError(
          `Scraping blocked for ${siteName}. High-risk scrapers disabled. ` +
          `Set ENABLE_HIGH_RISK_SCRAPERS=true and TOS_RISK_ACK=true to enable.`,
          reason,
          siteName
        );
      } else {
        logger.warn('High-risk scraping enabled by environment flags', {
          site: siteName,
          url,
          riskLevel: siteConfig.risk_level
        });
      }
    }

    // Check 2: Login requirements
    const requiresAuth = siteConfig.requiresAuth || siteConfig.requires_login;
    if (requiresAuth) {
      const hasValidSession = this.validateSession(siteConfig, sessionData);
      
      if (!hasValidSession) {
        const reason = 'login_required';
        logger.warn('Scraping blocked - login required but no valid session', {
          site: siteName,
          url,
          reason,
          hasSessionData: !!sessionData
        });
        
        throw new ComplianceError(
          `Scraping blocked for ${siteName}. Site requires login but no valid session provided.`,
          reason,
          siteName
        );
      }
    }

    // Check 3: Robots.txt compliance
    const robotsAllowed = await robotsService.canScrape(url);
    
    if (!robotsAllowed) {
      const reason = 'robots_disallow';
      logger.warn('Scraping blocked by robots.txt', {
        site: siteName,
        url,
        reason
      });
      
      throw new ComplianceError(
        `Scraping blocked by robots.txt for ${url}. ` +
        `Set OVERRIDE_ROBOTS=true to bypass (not recommended).`,
        reason,
        siteName
      );
    }

    logger.info('All compliance checks passed', {
      site: siteName,
      url,
      riskLevel: siteConfig.risk_level
    });

    return { siteName, siteConfig };
  }

  /**
   * Main scraping method with compliance checks
   */
  async scrape(url, options = {}) {
    try {
      // Perform compliance checks first
      const { siteName, siteConfig } = await this.performComplianceChecks(
        url, 
        options.sessionData
      );

      // Log successful compliance check
      logger.info('Compliance checks passed, proceeding with scrape', {
        site: siteName,
        url,
        riskLevel: siteConfig.risk_level
      });

      // Proceed with actual scraping logic
      const result = await this.performScraping(url, siteConfig, options);

      logger.info('Scraping completed successfully', {
        site: siteName,
        url,
        dataPoints: Object.keys(result).length
      });

      return {
        success: true,
        site: siteName,
        url,
        data: result,
        compliance: {
          riskLevel: siteConfig.risk_level,
          requiresAuth: siteConfig.requiresAuth || siteConfig.requires_login,
          robotsChecked: true
        }
      };

    } catch (error) {
      if (error instanceof ComplianceError) {
        // Log compliance failures
        logger.warn('Scraping blocked by compliance check', {
          site: error.site,
          url,
          reason: error.reason,
          message: error.message
        });

        return {
          success: false,
          error: error.message,
          reason: error.reason,
          site: error.site,
          compliance: {
            blocked: true,
            reason: error.reason
          }
        };
      }

      // Handle other scraping errors
      logger.error('Scraping failed with non-compliance error', {
        url,
        error: error.message,
        stack: error.stack
      });

      throw error;
    }
  }

  /**
   * Placeholder for actual scraping implementation
   * This can be integrated with your existing EnhancedScraperService
   */
  async performScraping(url, siteConfig, options) {
    // This would contain your actual scraping logic
    // using your existing EnhancedScraperService or Playwright
    
    // For demonstration purposes:
    return {
      title: "Sample scraped title",
      content: "Sample scraped content",
      timestamp: new Date().toISOString(),
      source: url
    };
  }

  /**
   * Process a scraping job from the queue
   */
  async processJob(jobData) {
    try {
      logger.info('Processing scraping job', { jobId: jobData.id, url: jobData.url });
      
      const result = await this.scrape(jobData.url, {
        sessionData: jobData.sessionData,
        options: jobData.options
      });
      
      logger.info('Job completed', { jobId: jobData.id, success: result.success });
      return result;
      
    } catch (error) {
      logger.error('Job failed', { jobId: jobData.id, error: error.message });
      throw error;
    }
  }
}

module.exports = { ScraperWorker, ComplianceError };
