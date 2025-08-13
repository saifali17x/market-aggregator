const jwt = require("jsonwebtoken");
const { User } = require("../models");

const auth = async (req, res, next) => {
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

    // Check if it's an admin token
    if (decoded.isAdmin) {
      req.user = { username: decoded.username, role: "admin", isAdmin: true };
      return next();
    }

    // Get user data for regular users
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Add user to request object
    req.user = user;
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

    req.user = { username: decoded.username, role: "admin", isAdmin: true };
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

      if (decoded.isAdmin) {
        req.user = { username: decoded.username, role: "admin", isAdmin: true };
      } else {
        const user = await User.findByPk(decoded.userId);
        if (user && user.isActive) {
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};

// Role-based authorization middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
};

module.exports = {
  auth,
  requireAdmin,
  optionalAuth,
  requireRole,
};
