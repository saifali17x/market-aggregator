const { Queue, Worker, QueueEvents } = require("bullmq");
const Redis = require("ioredis");
const logger = require("../utils/logger");

/**
 * Redis connection configuration
 */
const redisConfig = {
  url: process.env.REDIS_URL || "redis://localhost:6379",
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: null,
  lazyConnect: true,
};

/**
 * Create Redis connection
 */
const createRedisConnection = () => {
  try {
    const redis = new Redis(redisConfig);

    redis.on("connect", () => {
      logger.info("Redis connected successfully");
    });

    redis.on("error", (error) => {
      logger.error("Redis connection error:", error);
    });

    redis.on("close", () => {
      logger.warn("Redis connection closed");
    });

    return redis;
  } catch (error) {
    logger.error("Failed to create Redis connection:", error);
    throw error;
  }
};

/**
 * Queue configuration
 */
const queueConfig = {
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: parseInt(process.env.BULLMQ_MAX_ATTEMPTS) || 3,
    backoff: {
      type: "exponential",
      delay: parseInt(process.env.BULLMQ_BACKOFF_DELAY) || 5000,
    },
  },
};

/**
 * Create queues
 */
const createQueues = (redis) => {
  const queues = {
    scraping: new Queue("scraping", {
      connection: redis,
      ...queueConfig,
    }),
    productMatching: new Queue("product-matching", {
      connection: redis,
      ...queueConfig,
    }),
    priceNormalization: new Queue("price-normalization", {
      connection: redis,
      ...queueConfig,
    }),
    dataCleanup: new Queue("data-cleanup", {
      connection: redis,
      ...queueConfig,
    }),
  };

  // Set up queue event handlers
  Object.entries(queues).forEach(([name, queue]) => {
    queue.on("completed", (job) => {
      logger.info(`Job ${job.id} completed in queue ${name}`);
    });

    queue.on("failed", (job, err) => {
      logger.error(`Job ${job.id} failed in queue ${name}:`, err.message);
    });

    queue.on("stalled", (job) => {
      logger.warn(`Job ${job.id} stalled in queue ${name}`);
    });
  });

  return queues;
};

/**
 * Create queue scheduler (removed in BullMQ v5)
 */
const createScheduler = (redis) => {
  // QueueScheduler was removed in BullMQ v5
  return null;
};

/**
 * Queue manager class
 */
class QueueManager {
  constructor() {
    this.redis = null;
    this.queues = null;
    this.scheduler = null;
    this.workers = [];
  }

  /**
   * Initialize queue manager
   */
  async initialize() {
    try {
      this.redis = createRedisConnection();
      this.queues = createQueues(this.redis);
      // this.scheduler = createScheduler(this.redis); // Removed in BullMQ v5

      logger.info("Queue manager initialized successfully");
      return true;
    } catch (error) {
      logger.error("Failed to initialize queue manager:", error);
      throw error;
    }
  }

  /**
   * Add scraping job to queue
   */
  async addScrapingJob(jobData) {
    try {
      const job = await this.queues.scraping.add("scrape-platform", jobData, {
        priority: jobData.priority || 0,
        delay: jobData.delay || 0,
        jobId: `scrape_${jobData.platform}_${Date.now()}`,
      });

      logger.info(`Scraping job added to queue: ${job.id}`);
      return job;
    } catch (error) {
      logger.error("Failed to add scraping job:", error);
      throw error;
    }
  }

  /**
   * Add product matching job to queue
   */
  async addProductMatchingJob(jobData) {
    try {
      const job = await this.queues.productMatching.add(
        "match-products",
        jobData,
        {
          priority: 1, // High priority for product matching
          jobId: `match_${Date.now()}`,
        }
      );

      logger.info(`Product matching job added to queue: ${job.id}`);
      return job;
    } catch (error) {
      logger.error("Failed to add product matching job:", error);
      throw error;
    }
  }

  /**
   * Add price normalization job to queue
   */
  async addPriceNormalizationJob(jobData) {
    try {
      const job = await this.queues.priceNormalization.add(
        "normalize-prices",
        jobData,
        {
          priority: 2, // Medium priority
          jobId: `normalize_${Date.now()}`,
        }
      );

      logger.info(`Price normalization job added to queue: ${job.id}`);
      return job;
    } catch (error) {
      logger.error("Failed to add price normalization job:", error);
      throw error;
    }
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    try {
      const stats = {};

      for (const [name, queue] of Object.entries(this.queues)) {
        const waiting = await queue.getWaiting();
        const active = await queue.getActive();
        const completed = await queue.getCompleted();
        const failed = await queue.getFailed();

        stats[name] = {
          waiting: waiting.length,
          active: active.length,
          completed: completed.length,
          failed: failed.length,
        };
      }

      return stats;
    } catch (error) {
      logger.error("Failed to get queue stats:", error);
      return {};
    }
  }

  /**
   * Clean up completed jobs
   */
  async cleanupCompletedJobs() {
    try {
      for (const [name, queue] of Object.entries(this.queues)) {
        await queue.clean(1000 * 60 * 60 * 24, "completed"); // 24 hours
        await queue.clean(1000 * 60 * 60 * 24, "failed"); // 24 hours
      }

      logger.info("Completed jobs cleaned up");
    } catch (error) {
      logger.error("Failed to cleanup completed jobs:", error);
    }
  }

  /**
   * Pause all queues
   */
  async pauseAllQueues() {
    try {
      for (const [name, queue] of Object.entries(this.queues)) {
        await queue.pause();
      }

      logger.info("All queues paused");
    } catch (error) {
      logger.error("Failed to pause queues:", error);
    }
  }

  /**
   * Resume all queues
   */
  async resumeAllQueues() {
    try {
      for (const [name, queue] of Object.entries(this.queues)) {
        await queue.resume();
      }

      logger.info("All queues resumed");
    } catch (error) {
      logger.error("Failed to resume queues:", error);
    }
  }

  /**
   * Gracefully shutdown
   */
  async shutdown() {
    try {
      // Pause all queues
      await this.pauseAllQueues();

      // Close all workers
      for (const worker of this.workers) {
        await worker.close();
      }

      // Close queues
      for (const [name, queue] of Object.entries(this.queues)) {
        await queue.close();
      }

      // Close scheduler (removed in BullMQ v5)
      // if (this.scheduler) {
      //   await this.scheduler.close();
      // }

      // Close Redis connection
      if (this.redis) {
        await this.redis.quit();
      }

      logger.info("Queue manager shutdown completed");
    } catch (error) {
      logger.error("Error during queue manager shutdown:", error);
    }
  }
}

// Create singleton instance
const queueManager = new QueueManager();

// Export specific BullMQ components
const scrapeQueue = new Queue("scraping", {
  connection: createRedisConnection(),
  ...queueConfig,
});

const scrapeQueueEvents = new QueueEvents("scraping", {
  connection: createRedisConnection(),
});

module.exports = {
  queueManager,
  scrapeQueue,
  scrapeQueueEvents,
  createRedisConnection,
  createQueues,
  createScheduler,
};
