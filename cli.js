#!/usr/bin/env node

const { ScraperWorker } = require('./backend/workers/scraperWorker');
const logger = require('./backend/utils/logger');
const fs = require('fs');

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Usage: node cli.js <url> [options]

Options:
  --session-file <path>    JSON file with session data (cookies, tokens)
  --ignore-robots         Override robots.txt (same as OVERRIDE_ROBOTS=true)
  --enable-high-risk      Enable high-risk scrapers (requires --ack-risks)
  --ack-risks             Acknowledge legal/ToS risks
  --verbose               Enable verbose logging

Examples:
  # Safe scraping (low/medium risk sites)
  node cli.js https://www.reddit.com/r/programming
  
  # High-risk scraping (requires explicit flags)
  node cli.js https://www.facebook.com/marketplace --enable-high-risk --ack-risks --session-file fb-session.json
  
  # Override robots.txt (for development only)
  node cli.js https://example.com/admin --ignore-robots

Environment Variables:
  OVERRIDE_ROBOTS=true              Override robots.txt restrictions
  ENABLE_HIGH_RISK_SCRAPERS=true   Enable high-risk site scraping
  TOS_RISK_ACK=true                 Acknowledge Terms of Service risks
`);
    process.exit(1);
  }

  const url = args[0];
  const options = parseArgs(args.slice(1));
  
  // Set environment variables from CLI flags
  if (options.ignoreRobots) {
    process.env.OVERRIDE_ROBOTS = 'true';
  }
  
  if (options.enableHighRisk && options.ackRisks) {
    process.env.ENABLE_HIGH_RISK_SCRAPERS = 'true';
    process.env.TOS_RISK_ACK = 'true';
  } else if (options.enableHighRisk) {
    console.error('❌ Error: --enable-high-risk requires --ack-risks flag');
    process.exit(1);
  }

  // Load session data if provided
  let sessionData = null;
  if (options.sessionFile) {
    try {
      const sessionContent = fs.readFileSync(options.sessionFile, 'utf8');
      sessionData = JSON.parse(sessionContent);
      console.log(`📁 Loaded session data from ${options.sessionFile}`);
    } catch (error) {
      console.error(`❌ Failed to load session file: ${error.message}`);
      process.exit(1);
    }
  }

  console.log(`🔍 Starting scrape of: ${url}`);
  console.log(`🛡️  Compliance checks enabled`);
  
  const worker = new ScraperWorker();
  
  try {
    const result = await worker.scrape(url, { sessionData });
    
    if (result.success) {
      console.log(`✅ Scraping completed successfully`);
      console.log(`📊 Site: ${result.site}`);
      console.log(`⚠️  Risk Level: ${result.compliance.riskLevel}`);
      console.log(`🔐 Requires Login: ${result.compliance.requiresAuth ? 'Yes' : 'No'}`);
      console.log(`🤖 Robots.txt Checked: ${result.compliance.robotsChecked ? 'Yes' : 'No'}`);
      
      if (options.verbose) {
        console.log(`📄 Scraped Data:`, JSON.stringify(result.data, null, 2));
      } else {
        console.log(`📄 Data Points: ${Object.keys(result.data).length}`);
      }
    } else {
      console.log(`❌ Scraping blocked: ${result.error}`);
      console.log(`🚫 Reason: ${result.reason}`);
      console.log(`🏷️  Site: ${result.site}`);
      
      // Provide helpful suggestions based on the blocking reason
      if (result.reason === 'high_risk_disabled') {
        console.log(`\n💡 To enable high-risk scraping:`);
        console.log(`   node cli.js "${url}" --enable-high-risk --ack-risks`);
        console.log(`   ⚠️  WARNING: This may violate Terms of Service`);
      } else if (result.reason === 'login_required') {
        console.log(`\n💡 This site requires login. Provide session data:`);
        console.log(`   node cli.js "${url}" --session-file session.json`);
      } else if (result.reason === 'robots_disallow') {
        console.log(`\n💡 To override robots.txt (development only):`);
        console.log(`   node cli.js "${url}" --ignore-robots`);
        console.log(`   ⚠️  WARNING: Not recommended for production`);
      }
      
      process.exit(1);
    }
    
  } catch (error) {
    console.error(`💥 Scraping failed: ${error.message}`);
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

function parseArgs(args) {
  const options = {
    sessionFile: null,
    ignoreRobots: false,
    enableHighRisk: false,
    ackRisks: false,
    verbose: false
  };
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--session-file':
        options.sessionFile = args[++i];
        break;
      case '--ignore-robots':
        options.ignoreRobots = true;
        break;
      case '--enable-high-risk':
        options.enableHighRisk = true;
        break;
      case '--ack-risks':
        options.ackRisks = true;
        break;
      case '--verbose':
        options.verbose = true;
        break;
      default:
        console.warn(`Unknown option: ${args[i]}`);
    }
  }
  
  return options;
}

if (require.main === module) {
  main().catch(console.error);
}

// Example session file format (session.json)
const exampleSession = {
  cookies: [
    {
      name: 'sessionid',
      value: 'your-session-id-here',
      domain: '.facebook.com'
    },
    {
      name: 'c_user',
      value: 'your-user-id',
      domain: '.facebook.com'
    }
  ],
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; scraper)',
    'Authorization': 'Bearer your-token-here'
  }
};

// Save example session file
if (process.argv.includes('--create-session-example')) {
  fs.writeFileSync('session-example.json', JSON.stringify(exampleSession, null, 2));
  console.log('Created session-example.json');
}

module.exports = { main, parseArgs };
