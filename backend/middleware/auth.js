const jwt = require("jsonwebtoken");

// Simple auth middleware that accepts any valid JWT token
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access token required" });
    }

    const token = authHeader.substring(7);

    // Verify token (using a simple secret for now)
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Add user info to request object
    req.user = {
      id: decoded.userId || decoded.id || 1,
      username: decoded.username || "user",
      role: decoded.role || "user",
      isAdmin: decoded.isAdmin || false,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }

    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Admin-only middleware
const requireAdmin = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access token required" });
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Check if user is admin
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.user = {
      username: decoded.username || "admin",
      role: "admin",
      isAdmin: true,
    };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }

    console.error("Admin auth middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Optional auth middleware - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      );

      req.user = {
        id: decoded.userId || decoded.id || 1,
        username: decoded.username || "user",
        role: decoded.role || "user",
        isAdmin: decoded.isAdmin || false,
      };
    } else {
      req.user = null;
    }
    next();
  } catch (error) {
    // If token is invalid, just continue without user
    req.user = null;
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth,
  auth: authenticateToken, // For backward compatibility
};
