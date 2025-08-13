// backend/services/robotsService.js
const axios = require('axios');
const logger = require('../utils/logger');

class RobotsService {
  constructor() {
    this.cache = new Map();
    this.CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  /**
   * Extract domain from URL
   * @param {string} url 
   * @returns {string}
   */
  getDomain(url) {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.host}`;
    } catch (error) {
      logger.error('Invalid URL provided to getDomain', { url, error: error.message });
      throw new Error(`Invalid URL: ${url}`);
    }
  }

  /**
   * Fetch robots.txt content from domain
   * @param {string} domain 
   * @returns {Promise<string>}
   */
  async fetchRobotsTxt(domain) {
    const robotsUrl = `${domain}/robots.txt`;
    
    try {
      const response = await axios.get(robotsUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Web-Scraper-Bot/1.0'
        },
        validateStatus: (status) => status < 500 // Accept 404 as valid response
      });

      if (response.status === 404) {
        logger.debug('No robots.txt found', { domain });
        return ''; // No robots.txt means no restrictions
      }

      return response.data;
    } catch (error) {
      logger.warn('Failed to fetch robots.txt', { 
        domain, 
        error: error.message 
      });
      return ''; // On error, assume no restrictions
    }
  }

  /**
   * Parse robots.txt content and extract disallow rules for User-agent: *
   * @param {string} robotsContent 
   * @returns {string[]}
   */
  parseRobotsTxt(robotsContent) {
    const lines = robotsContent.split('\n').map(line => line.trim());
    const disallowRules = [];
    let currentUserAgent = null;
    let applicableToAll = false;

    for (const line of lines) {
      // Skip comments and empty lines
      if (line.startsWith('#') || line === '') {
        continue;
      }

      // Check for User-agent directive
      if (line.toLowerCase().startsWith('user-agent:')) {
        const userAgent = line.substring(11).trim();
        currentUserAgent = userAgent;
        applicableToAll = userAgent === '*';
        continue;
      }

      // Check for Disallow directive under User-agent: *
      if (applicableToAll && line.toLowerCase().startsWith('disallow:')) {
        const path = line.substring(9).trim();
        if (path) {
          disallowRules.push(path);
        }
      }
    }

    return disallowRules;
  }

  /**
   * Check if a URL path matches any disallow rule
   * @param {string} urlPath 
   * @param {string[]} disallowRules 
   * @returns {boolean}
   */
  isPathDisallowed(urlPath, disallowRules) {
    for (const rule of disallowRules) {
      if (rule === '/') {
        // Disallow everything
        return true;
      }

      if (rule.endsWith('*')) {
        // Wildcard rule
        const prefix = rule.slice(0, -1);
        if (urlPath.startsWith(prefix)) {
          return true;
        }
      } else {
        // Exact or prefix match
        if (urlPath.startsWith(rule)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get cached robots.txt data or fetch if not cached/expired
   * @param {string} domain 
   * @returns {Promise<string[]>}
   */
  async getRobotsRules(domain) {
    const cacheKey = domain;
    const cached = this.cache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      logger.debug('Using cached robots.txt', { domain });
      return cached.rules;
    }

    logger.debug('Fetching fresh robots.txt', { domain });
    const robotsContent = await this.fetchRobotsTxt(domain);
    const rules = this.parseRobotsTxt(robotsContent);

    // Cache the results
    this.cache.set(cacheKey, {
      rules,
      timestamp: Date.now()
    });

    return rules;
  }

  /**
   * Check if scraping is allowed for the given URL
   * @param {string} url 
   * @param {Object} options 
   * @param {boolean} options.override - Override robots.txt restrictions
   * @returns {Promise<boolean>}
   */
  async canScrape(url, { override = false } = {}) {
    try {
      const domain = this.getDomain(url);
      const urlObj = new URL(url);
      const path = urlObj.pathname + urlObj.search;

      // Get disallow rules for this domain
      const disallowRules = await this.getRobotsRules(domain);

      // Check if path is disallowed
      const isDisallowed = this.isPathDisallowed(path, disallowRules);

      if (isDisallowed) {
        // Check for environment override
        const envOverride = process.env.OVERRIDE_ROBOTS === 'true';
        
        if (envOverride || override) {
          logger.warn('Scraping disallowed by robots.txt but override enabled', {
            url,
            domain,
            path,
            override: override || envOverride,
            disallowRules
          });
          return true;
        }

        logger.info('Scraping blocked by robots.txt', {
          url,
          domain,
          path,
          disallowRules
        });
        return false;
      }

      logger.debug('Scraping allowed by robots.txt', {
        url,
        domain,
        path
      });
      return true;

    } catch (error) {
      logger.error('Error checking robots.txt', {
        url,
        error: error.message
      });
      
      // On error, default to allowing scraping unless explicitly overridden
      return true;
    }
  }

  /**
   * Clear the robots.txt cache
   */
  clearCache() {
    this.cache.clear();
    logger.info('Robots.txt cache cleared');
  }

  /**
   * Get cache statistics
   * @returns {Object}
   */
  getCacheStats() {
    const stats = {
      size: this.cache.size,
      entries: []
    };

    for (const [domain, data] of this.cache.entries()) {
      stats.entries.push({
        domain,
        rulesCount: data.rules.length,
        age: Date.now() - data.timestamp,
        expired: (Date.now() - data.timestamp) >= this.CACHE_DURATION
      });
    }

    return stats;
  }
}

module.exports = new RobotsService();
