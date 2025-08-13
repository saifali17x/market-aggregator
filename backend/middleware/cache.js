// In-memory cache middleware for API responses
// Note: For production, consider using Redis or similar for distributed caching

const NodeCache = require("node-cache");

// Create cache instance with default TTL and periodic deletion
const cache = new NodeCache({
  stdTTL: 300, // Default 5 minutes
  checkperiod: 60, // Check for expired keys every minute
  useClones: false, // Better performance, but be careful with object mutations
});

// Cache statistics
const cacheStats = {
  hits: 0,
  misses: 0,
  sets: 0,
  deletes: 0,
  errors: 0,
};

// Update stats
cache.on("set", () => cacheStats.sets++);
cache.on("del", () => cacheStats.deletes++);
cache.on("expired", () => cacheStats.deletes++);

/**
 * Cache middleware factory
 * @param {Object} options - Cache configuration
 * @param {number} options.duration - Cache duration in seconds (default: 300)
 * @param {Function} options.keyGenerator - Function to generate cache key from request
 * @param {Function} options.shouldCache - Function to determine if response should be cached
 * @param {Array} options.skipMethods - HTTP methods to skip caching (default: ['POST', 'PUT', 'DELETE'])
 */
const cacheMiddleware = (options = {}) => {
  const {
    duration = 300,
    keyGenerator = defaultKeyGenerator,
    shouldCache = defaultShouldCache,
    skipMethods = ["POST", "PUT", "DELETE", "PATCH"],
  } = options;

  return (req, res, next) => {
    // Skip caching for certain HTTP methods
    if (skipMethods.includes(req.method)) {
      return next();
    }

    try {
      // Generate cache key
      const cacheKey = keyGenerator(req);

      // Try to get from cache
      const cachedResponse = cache.get(cacheKey);

      if (cachedResponse) {
        cacheStats.hits++;

        // Set cache headers
        res.set({
          "X-Cache": "HIT",
          "X-Cache-Key": cacheKey,
          "X-Cache-TTL": cache.getTtl(cacheKey)
            ? Math.floor((cache.getTtl(cacheKey) - Date.now()) / 1000)
            : 0,
        });

        return res.json(cachedResponse);
      }

      cacheStats.misses++;

      // Override res.json to cache the response
      const originalJson = res.json.bind(res);

      res.json = function (data) {
        try {
          // Check if we should cache this response
          if (shouldCache(req, res, data)) {
            cache.set(cacheKey, data, duration);

            // Set cache headers
            res.set({
              "X-Cache": "MISS",
              "X-Cache-Key": cacheKey,
              "X-Cache-TTL": duration,
            });
          } else {
            res.set("X-Cache", "SKIP");
          }
        } catch (error) {
          console.error("Cache set error:", error);
          cacheStats.errors++;
        }

        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error("Cache middleware error:", error);
      cacheStats.errors++;
      next();
    }
  };
};

/**
 * Default cache key generator
 * Creates a cache key based on method, path, and query parameters
 */
function defaultKeyGenerator(req) {
  const { method, path, query, headers } = req;

  // Sort query parameters for consistent keys
  const sortedQuery = Object.keys(query)
    .sort()
    .reduce((result, key) => {
      result[key] = query[key];
      return result;
    }, {});

  // Include relevant headers that might affect the response
  const relevantHeaders = {};
  if (headers["accept-language"]) {
    relevantHeaders["accept-language"] = headers["accept-language"];
  }
  if (headers["authorization"]) {
    // Hash the authorization header for security
    const crypto = require("crypto");
    relevantHeaders["auth-hash"] = crypto
      .createHash("md5")
      .update(headers["authorization"])
      .digest("hex")
      .substring(0, 8);
  }

  return `${method}:${path}:${JSON.stringify(sortedQuery)}:${JSON.stringify(
    relevantHeaders
  )}`;
}

/**
 * Default function to determine if response should be cached
 * Only cache successful responses (2xx status codes)
 */
function defaultShouldCache(req, res, data) {
  const statusCode = res.statusCode;

  // Only cache successful responses
  if (statusCode < 200 || statusCode >= 300) {
    return false;
  }

  // Don't cache error responses
  if (data && data.success === false) {
    return false;
  }

  // Don't cache empty responses
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return false;
  }

  return true;
}

/**
 * Clear cache by pattern
 * @param {string} pattern - Pattern to match cache keys (supports wildcards with *)
 */
const clearCacheByPattern = (pattern) => {
  try {
    const keys = cache.keys();
    const regex = new RegExp(pattern.replace(/\*/g, ".*"));

    const keysToDelete = keys.filter((key) => regex.test(key));

    keysToDelete.forEach((key) => {
      cache.del(key);
    });

    return keysToDelete.length;
  } catch (error) {
    console.error("Clear cache by pattern error:", error);
    return 0;
  }
};

/**
 * Clear specific cache key
 * @param {string} key - Cache key to clear
 */
const clearCache = (key) => {
  try {
    return cache.del(key);
  } catch (error) {
    console.error("Clear cache error:", error);
    return false;
  }
};

/**
 * Clear all cache
 */
const clearAllCache = () => {
  try {
    cache.flushAll();
    return true;
  } catch (error) {
    console.error("Clear all cache error:", error);
    return false;
  }
};

/**
 * Get cache statistics
 */
const getCacheStats = () => {
  const keys = cache.keys();
  const memoryUsage = process.memoryUsage();

  return {
    ...cacheStats,
    hitRate: cacheStats.hits / (cacheStats.hits + cacheStats.misses) || 0,
    totalKeys: keys.length,
    memoryUsage: {
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      external: Math.round(memoryUsage.external / 1024 / 1024), // MB
    },
  };
};

/**
 * Get cache key information
 */
const getCacheInfo = (key) => {
  try {
    const value = cache.get(key);
    const ttl = cache.getTtl(key);

    return {
      exists: !!value,
      ttl: ttl ? Math.floor((ttl - Date.now()) / 1000) : null,
      size: value ? JSON.stringify(value).length : 0,
    };
  } catch (error) {
    console.error("Get cache info error:", error);
    return null;
  }
};

/**
 * Middleware to expose cache management endpoints
 */
const cacheAdminMiddleware = (req, res, next) => {
  // Only allow cache operations in development or with proper authentication
  if (process.env.NODE_ENV === "production" && !req.headers["x-admin-key"]) {
    return res.status(403).json({
      success: false,
      error: "Unauthorized access to cache admin",
      code: "UNAUTHORIZED",
    });
  }

  const { action, pattern, key } = req.query;

  switch (action) {
    case "stats":
      return res.json({
        success: true,
        data: getCacheStats(),
      });

    case "clear":
      if (pattern) {
        const deletedCount = clearCacheByPattern(pattern);
        return res.json({
          success: true,
          message: `Cleared ${deletedCount} cache entries matching pattern: ${pattern}`,
        });
      } else if (key) {
        const deleted = clearCache(key);
        return res.json({
          success: true,
          message: deleted
            ? `Cache key '${key}' cleared`
            : `Cache key '${key}' not found`,
        });
      } else {
        clearAllCache();
        return res.json({
          success: true,
          message: "All cache cleared",
        });
      }

    case "info":
      if (!key) {
        return res.status(400).json({
          success: false,
          error: "Cache key required for info action",
        });
      }

      const info = getCacheInfo(key);
      return res.json({
        success: true,
        data: info,
      });

    default:
      return res.status(400).json({
        success: false,
        error: "Invalid cache action. Use: stats, clear, or info",
      });
  }
};

module.exports = {
  cacheMiddleware,
  clearCache,
  clearCacheByPattern,
  clearAllCache,
  getCacheStats,
  getCacheInfo,
  cacheAdminMiddleware,
};
