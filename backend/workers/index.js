#!/usr/bin/env node

/**
 * Market Aggregator Worker
 * Main entry point for the scraping worker process
 */

const ScrapeWorker = require("./scrapeWorker");
const { logger } = require("../utils/logger");

// Graceful shutdown handling
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
process.on("uncaughtException", handleUncaughtException);
process.on("unhandledRejection", handleUnhandledRejection);

let worker = null;

/**
 * Main worker function
 */
async function main() {
  try {
    logger.info("Starting Market Aggregator Worker...");
    
    // Initialize worker
    worker = new ScrapeWorker();
    await worker.initialize();
    
    logger.info("Worker initialized successfully");
    logger.info("Listening for scraping jobs...");
    
    // Keep the process alive
    process.stdin.resume();
    
  } catch (error) {
    logger.error("Failed to start worker:", error);
    process.exit(1);
  }
}

/**
 * Handle graceful shutdown
 */
async function gracefulShutdown(signal) {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  
  try {
    if (worker) {
      await worker.shutdown();
    }
    
    logger.info("Worker shutdown completed");
    process.exit(0);
  } catch (error) {
    logger.error("Error during shutdown:", error);
    process.exit(1);
  }
}

/**
 * Handle uncaught exceptions
 */
function handleUncaughtException(error) {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
}

/**
 * Handle unhandled promise rejections
 */
function handleUnhandledRejection(reason, promise) {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
}

// Start the worker
main().catch((error) => {
  logger.error("Fatal error in main:", error);
  process.exit(1);
});
