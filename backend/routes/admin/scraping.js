const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../middleware/auth");
const { scrapeQueue } = require("../../jobs/queue");
const { ScrapingJob } = require("../../models");

/**
 * GET /api/admin/scraping/platforms
 * Get available scraping platforms
 */
router.get("/platforms", requireAdmin, async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const configsPath = path.join(__dirname, '../../config/sites');
    
    const platforms = [];
    const files = fs.readdirSync(configsPath);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const configPath = path.join(configsPath, file);
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        platforms.push({
          name: config.name,
          displayName: config.displayName || config.name,
          description: config.description || '',
          allow_scrape: config.allow_scrape,
          risk_level: config.risk_level
        });
      }
    }
    
    res.json({ platforms });
  } catch (error) {
    console.error('Error fetching platforms:', error);
    res.status(500).json({ message: 'Failed to fetch platforms' });
  }
});

/**
 * POST /api/admin/scraping/enqueue
 * Enqueue a new scraping job
 */
router.post("/enqueue", requireAdmin, async (req, res) => {
  try {
    const { platform, query, maxPages = 10 } = req.body;
    
    if (!platform || !query) {
      return res.status(400).json({ message: 'Platform and query are required' });
    }
    
    // Create scraping job record
    const job = await ScrapingJob.create({
      name: `${platform} - ${query}`,
      platform,
      status: 'pending',
      config: {
        query,
        maxPages,
        platform
      },
      schedule: null // Manual job
    });
    
    // Add job to queue
    await scrapeQueue.add('scrape', {
      jobId: job.id,
      platform,
      query,
      maxPages
    }, {
      jobId: job.id,
      removeOnComplete: false,
      removeOnFail: false
    });
    
    res.json({ 
      message: 'Job enqueued successfully',
      jobId: job.id 
    });
  } catch (error) {
    console.error('Error enqueueing job:', error);
    res.status(500).json({ message: 'Failed to enqueue job' });
  }
});

/**
 * GET /api/admin/scraping/jobs
 * Get all scraping jobs
 */
router.get("/jobs", requireAdmin, async (req, res) => {
  try {
    const jobs = await ScrapingJob.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

/**
 * POST /api/admin/scraping/jobs/:id/run
 * Run a specific scraping job
 */
router.post("/jobs/:id/run", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const job = await ScrapingJob.findByPk(id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Add job to queue
    await scrapeQueue.add('scrape', {
      jobId: job.id,
      platform: job.platform,
      query: job.config?.query,
      maxPages: job.config?.maxPages
    }, {
      jobId: `retry-${job.id}`,
      removeOnComplete: false,
      removeOnFail: false
    });
    
    await job.update({ status: 'pending' });
    
    res.json({ message: 'Job started successfully' });
  } catch (error) {
    console.error('Error running job:', error);
    res.status(500).json({ message: 'Failed to run job' });
  }
});

/**
 * POST /api/admin/scraping/jobs/:id/stop
 * Stop a running scraping job
 */
router.post("/jobs/:id/stop", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const job = await ScrapingJob.findByPk(id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (job.status !== 'running') {
      return res.status(400).json({ message: 'Job is not running' });
    }
    
    // Remove job from queue if it exists
    try {
      await scrapeQueue.remove(id);
    } catch (e) {
      // Job might not be in queue
    }
    
    await job.update({ 
      status: 'stopped',
      finishedAt: new Date()
    });
    
    res.json({ message: 'Job stopped successfully' });
  } catch (error) {
    console.error('Error stopping job:', error);
    res.status(500).json({ message: 'Failed to stop job' });
  }
});

/**
 * POST /api/admin/scraping/jobs/:id/retry
 * Retry a failed scraping job
 */
router.post("/jobs/:id/retry", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const job = await ScrapingJob.findByPk(id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (job.status !== 'failed') {
      return res.status(400).json({ message: 'Job is not failed' });
    }
    
    // Add job to queue
    await scrapeQueue.add('scrape', {
      jobId: job.id,
      platform: job.platform,
      query: job.config?.query,
      maxPages: job.config?.maxPages
    }, {
      jobId: `retry-${job.id}`,
      removeOnComplete: false,
      removeOnFail: false
    });
    
    await job.update({ 
      status: 'pending',
      errorMessage: null
    });
    
    res.json({ message: 'Job retry started successfully' });
  } catch (error) {
    console.error('Error retrying job:', error);
    res.status(500).json({ message: 'Failed to retry job' });
  }
});

/**
 * DELETE /api/admin/scraping/jobs/:id
 * Delete a scraping job
 */
router.delete("/jobs/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const job = await ScrapingJob.findByPk(id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Remove job from queue if it exists
    try {
      await scrapeQueue.remove(id);
    } catch (e) {
      // Job might not be in queue
    }
    
    await job.destroy();
    
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Failed to delete job' });
  }
});

module.exports = router;
