const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { requireAdmin } = require("../middleware/auth");
const ImportService = require("../services/importService");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "csv-import-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Only allow CSV files
  if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1, // Only allow 1 file
  },
});

// POST /api/import - Import CSV file (admin only)
router.post("/", requireAdmin, upload.single("csv"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No CSV file uploaded" });
    }

    console.log("File uploaded:", req.file.originalname);

    // Initialize import service
    const importService = new ImportService();

    // Process the CSV file
    const result = await importService.importCSV(req.file.path);

    // Clean up the uploaded file
    importService.cleanupFile(req.file.path);

    // Return success response
    res.json({
      message: "CSV imported successfully",
      ...result,
    });
  } catch (error) {
    console.error("Import error:", error);

    // Clean up file if it exists
    if (req.file && req.file.path) {
      const importService = new ImportService();
      importService.cleanupFile(req.file.path);
    }

    // Return error response
    res.status(500).json({
      error: "Import failed",
      message: error.message,
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large",
        message: "File size must be less than 10MB",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        error: "Too many files",
        message: "Only one file can be uploaded at a time",
      });
    }
    return res.status(400).json({
      error: "File upload error",
      message: error.message,
    });
  }

  if (error.message === "Only CSV files are allowed") {
    return res.status(400).json({
      error: "Invalid file type",
      message: "Only CSV files are allowed",
    });
  }

  next(error);
});

module.exports = router;
