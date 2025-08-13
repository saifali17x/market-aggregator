// scripts/validate-site-configs.js
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const REQUIRED_FIELDS = [
  "name",
  "baseUrl",
  "allow_scrape",
  "risk_level",
];
const VALID_RISK_LEVELS = ["low", "medium", "high"];

async function validateSiteConfigs() {
  const configsPath = path.join(__dirname, "../backend/config/sites");
  const errors = [];
  const warnings = [];
  let totalSites = 0;

  console.log("🔍 Validating site configurations...\n");

  try {
    const files = fs.readdirSync(configsPath);

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const siteName = file.replace(".json", "");
      const configPath = path.join(configsPath, file);
      totalSites++;

      console.log(`📋 Validating ${siteName}...`);

      try {
        const configContent = fs.readFileSync(configPath, "utf8");
        const config = JSON.parse(configContent);

        // Check required fields
        for (const field of REQUIRED_FIELDS) {
          if (!(field in config)) {
            errors.push(`${siteName}: Missing required field '${field}'`);
          }
        }

        // Validate risk level
        if (
          config.risk_level &&
          !VALID_RISK_LEVELS.includes(config.risk_level)
        ) {
          errors.push(
            `${siteName}: Invalid risk_level '${
              config.risk_level
            }'. Must be: ${VALID_RISK_LEVELS.join(", ")}`
          );
        }

        // Validate baseUrl
        if (config.baseUrl) {
          try {
            new URL(config.baseUrl);
          } catch {
            errors.push(`${siteName}: Invalid baseUrl '${config.baseUrl}'`);
          }
        }

        // Check for potential issues
        if (config.allow_scrape === true && config.risk_level === "high") {
          warnings.push(
            `${siteName}: High-risk site allows scraping by default. Consider setting allow_scrape: false`
          );
        }

        // Check login requirements (handle both field names)
        const requiresLogin = config.requires_login || config.requiresAuth;
        if (requiresLogin === false && config.risk_level === "high") {
          warnings.push(
            `${siteName}: High-risk site doesn't require login. Verify this is correct`
          );
        }

        // Try to fetch robots.txt
        if (config.baseUrl) {
          try {
            const robotsUrl = new URL("/robots.txt", config.baseUrl).toString();
            const response = await axios.get(robotsUrl, { timeout: 5000 });

            if (
              response.status === 200 &&
              response.data.toLowerCase().includes("disallow: /")
            ) {
              warnings.push(
                `${siteName}: robots.txt contains disallow rules. Scraping may be restricted`
              );
            }
          } catch {
            // Ignore robots.txt fetch errors for validation
          }
        }

        console.log(`  ✅ ${siteName} - Valid`);
      } catch (parseError) {
        errors.push(`${siteName}: Invalid JSON - ${parseError.message}`);
        console.log(`  ❌ ${siteName} - Invalid JSON`);
      }
    }

    // Summary
    console.log(`\n📊 Validation Summary:`);
    console.log(`  Total sites: ${totalSites}`);
    console.log(`  Errors: ${errors.length}`);
    console.log(`  Warnings: ${warnings.length}`);

    if (errors.length > 0) {
      console.log(`\n❌ Errors found:`);
      errors.forEach((error) => console.log(`  • ${error}`));
    }

    if (warnings.length > 0) {
      console.log(`\n⚠️  Warnings:`);
      warnings.forEach((warning) => console.log(`  • ${warning}`));
    }

    if (errors.length === 0 && warnings.length === 0) {
      console.log(`\n✅ All configurations are valid!`);
    }

    return { errors, warnings, totalSites };
  } catch (error) {
    console.error(`Failed to validate configurations: ${error.message}`);
    return { errors: [error.message], warnings: [], totalSites: 0 };
  }
}

// scripts/check-security.js
function checkSecuritySettings() {
  console.log("🔒 Security Configuration Check\n");

  const checks = [
    {
      name: "Robots.txt Override",
      check: () => process.env.OVERRIDE_ROBOTS !== "true",
      message: "OVERRIDE_ROBOTS should not be enabled in production",
      level: "error",
    },
    {
      name: "High-Risk Scrapers",
      check: () =>
        !(
          process.env.ENABLE_HIGH_RISK_SCRAPERS === "true" &&
          process.env.TOS_RISK_ACK === "true"
        ),
      message:
        "High-risk scrapers should be disabled in production unless legally cleared",
      level: "warn",
    },
    {
      name: "SSL Verification",
      check: () => process.env.IGNORE_SSL !== "true",
      message: "SSL verification should not be disabled",
      level: "error",
    },
    {
      name: "Compliance Bypass",
      check: () => process.env.BYPASS_COMPLIANCE !== "true",
      message: "Compliance bypass should never be enabled",
      level: "error",
    },
    {
      name: "Development Mode",
      check: () => process.env.NODE_ENV !== "development",
      message:
        "NODE_ENV should be set to production in production environments",
      level: "warn",
    },
    {
      name: "Default Credentials",
      check: () =>
        !process.env.DATABASE_URL ||
        !process.env.DATABASE_URL.includes("password"),
      message: "Ensure database credentials are secure and not using defaults",
      level: "info",
    },
    {
      name: "Request Timeout",
      check: () => {
        const timeout = parseInt(process.env.REQUEST_TIMEOUT) || 30000;
        return timeout >= 5000 && timeout <= 60000;
      },
      message: "Request timeout should be between 5-60 seconds",
      level: "info",
    },
    {
      name: "Rate Limiting",
      check: () => {
        const delay = parseInt(process.env.REQUEST_DELAY) || 1000;
        return delay >= 500;
      },
      message:
        "Request delay should be at least 500ms to avoid overwhelming servers",
      level: "warn",
    },
  ];

  let errors = 0;
  let warnings = 0;

  checks.forEach(({ name, check, message, level }) => {
    const passed = check();
    const icon = passed
      ? "✅"
      : level === "error"
      ? "❌"
      : level === "warn"
      ? "⚠️"
      : "ℹ️";

    console.log(`${icon} ${name}: ${passed ? "OK" : message}`);

    if (!passed) {
      if (level === "error") errors++;
      else if (level === "warn") warnings++;
    }
  });

  console.log(`\n📊 Security Check Summary:`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Warnings: ${warnings}`);

  if (errors > 0) {
    console.log(
      `\n❌ Critical security issues found! Review before deploying.`
    );
    process.exit(1);
  } else if (warnings > 0) {
    console.log(
      `\n⚠️  Security warnings found. Consider addressing before production use.`
    );
  } else {
    console.log(`\n✅ Security configuration looks good!`);
  }

  return { errors, warnings };
}

// scripts/generate-compliance-report.js
function generateComplianceReport() {
  const robotsService = require("../backend/services/robotsService");
  const fs = require("fs");
  const path = require("path");

  console.log("📋 Generating Compliance Report\n");

  const report = {
    timestamp: new Date().toISOString(),
    environment: {
      override_robots: process.env.OVERRIDE_ROBOTS === "true",
      high_risk_enabled: process.env.ENABLE_HIGH_RISK_SCRAPERS === "true",
      tos_risk_ack: process.env.TOS_RISK_ACK === "true",
      node_env: process.env.NODE_ENV || "development",
    },
    sites: {},
    robotsCache: robotsService.getCacheStats(),
    recommendations: [],
  };

  // Load site configurations
  const configsPath = path.join(__dirname, "../backend/config/sites");
  const configFiles = fs
    .readdirSync(configsPath)
    .filter((f) => f.endsWith(".json"));

  configFiles.forEach((file) => {
    const siteName = file.replace(".json", "");
    const config = JSON.parse(
      fs.readFileSync(path.join(configsPath, file), "utf8")
    );

    report.sites[siteName] = {
      name: config.name,
      risk_level: config.risk_level,
      allow_scrape: config.allow_scrape,
      requires_login: config.requires_login,
      compliance_status: getComplianceStatus(config),
    };
  });

  // Generate recommendations
  report.recommendations = generateRecommendations(report);

  // Save report
  const reportPath = `compliance-report-${
    new Date().toISOString().split("T")[0]
  }.json`;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`📄 Compliance report saved to: ${reportPath}`);

  // Print summary
  console.log(`\n📊 Summary:`);
  console.log(`  Total sites: ${Object.keys(report.sites).length}`);
  console.log(
    `  High-risk sites: ${
      Object.values(report.sites).filter((s) => s.risk_level === "high").length
    }`
  );
  console.log(
    `  Sites requiring login: ${
      Object.values(report.sites).filter((s) => s.requires_login).length
    }`
  );
  console.log(`  Robots cache entries: ${report.robotsCache.size}`);
  console.log(`  Recommendations: ${report.recommendations.length}`);

  return report;
}

function getComplianceStatus(config) {
  const issues = [];

  if (config.risk_level === "high" && config.allow_scrape === true) {
    issues.push("high_risk_enabled");
  }

  if (config.requires_login && !config.allow_scrape) {
    // This is actually good - requires explicit enabling
  }

  return {
    status: issues.length === 0 ? "compliant" : "needs_review",
    issues,
  };
}

function generateRecommendations(report) {
  const recommendations = [];

  // Environment recommendations
  if (report.environment.override_robots) {
    recommendations.push({
      type: "security",
      severity: "high",
      message: "Disable OVERRIDE_ROBOTS in production environments",
    });
  }

  if (
    report.environment.high_risk_enabled &&
    report.environment.node_env === "production"
  ) {
    recommendations.push({
      type: "legal",
      severity: "high",
      message: "Review legal implications of high-risk scraping in production",
    });
  }

  // Site-specific recommendations
  Object.entries(report.sites).forEach(([siteName, siteData]) => {
    if (siteData.risk_level === "high" && siteData.allow_scrape) {
      recommendations.push({
        type: "compliance",
        severity: "medium",
        message: `Consider disabling scraping for high-risk site: ${siteName}`,
      });
    }
  });

  // Cache recommendations
  if (report.robotsCache.size > 100) {
    recommendations.push({
      type: "performance",
      severity: "low",
      message: "Large robots.txt cache - consider periodic cleanup",
    });
  }

  return recommendations;
}

// Main execution logic
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case "validate":
      validateSiteConfigs().then((result) => {
        process.exit(result.errors.length > 0 ? 1 : 0);
      });
      break;

    case "security":
      checkSecuritySettings();
      break;

    case "report":
      generateComplianceReport();
      break;

    default:
      console.log(`
Usage: node scripts/validate-site-configs.js <command>

Commands:
  validate    Validate all site configuration files
  security    Check security and environment settings  
  report      Generate comprehensive compliance report

Examples:
  npm run sites:validate
  npm run security:check-env
  node scripts/validate-site-configs.js report
`);
  }
}

module.exports = {
  validateSiteConfigs,
  checkSecuritySettings,
  generateComplianceReport,
};
