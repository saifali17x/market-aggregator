const express = require("express");
const router = express.Router();
const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQ");
const { ExpressAdapter } = require("@bull-board/express");
const { requireAdmin } = require("../../middleware/auth");
const { scrapeQueue } = require("../../jobs/queue");

/**
 * Bull-board setup
 */
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [
    new BullMQAdapter(scrapeQueue),
  ],
  serverAdapter,
});

/**
 * GET /admin/queues
 * Bull-board UI for queue monitoring
 */
router.use("/", requireAdmin, serverAdapter.getRouter());

module.exports = router;
