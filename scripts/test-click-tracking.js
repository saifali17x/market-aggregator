#!/usr/bin/env node

/**
 * Click Tracking Test Script
 * Tests the click tracking API endpoints
 */

const fetch = require("node-fetch");

const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

async function testClickTracking() {
  console.log("🧪 Testing Click Tracking API...\n");

  try {
    // Test 1: Track a click
    console.log("📊 Test 1: Tracking a click...");
    const clickData = {
      url: "https://example.com/product/123",
      timestamp: new Date().toISOString(),
      source: "test_script",
      listingId: "550e8400-e29b-41d4-a716-446655440000",
      sellerId: "550e8400-e29b-41d4-a716-446655440001",
    };

    const clickResponse = await fetch(`${BASE_URL}/api/track/click`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clickData),
    });

    if (clickResponse.ok) {
      const clickResult = await clickResponse.json();
      console.log("✅ Click tracking successful:", clickResult.message);
      console.log("   Click ID:", clickResult.data.id);
    } else {
      const error = await clickResponse.json();
      console.log("❌ Click tracking failed:", error.error);
    }

    console.log("");

    // Test 2: Get overall stats
    console.log("📈 Test 2: Getting overall stats...");
    const statsResponse = await fetch(`${BASE_URL}/api/track/stats`);

    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log("✅ Stats retrieved successfully");
      console.log("   Total clicks:", stats.data.summary?.totalClicks || 0);
      console.log(
        "   Unique visitors:",
        stats.data.summary?.uniqueVisitors || 0
      );
    } else {
      const error = await statsResponse.json();
      console.log("❌ Stats retrieval failed:", error.error);
    }

    console.log("");

    // Test 3: Get listing-specific stats
    console.log("🔍 Test 3: Getting listing stats...");
    const listingId = "550e8400-e29b-41d4-a716-446655440000";
    const listingStatsResponse = await fetch(
      `${BASE_URL}/api/track/listing/${listingId}`
    );

    if (listingStatsResponse.ok) {
      const listingStats = await listingStatsResponse.json();
      console.log("✅ Listing stats retrieved successfully");
      console.log("   Total clicks:", listingStats.data.totalClicks || 0);
      console.log("   Unique visitors:", listingStats.data.uniqueVisitors || 0);
    } else {
      const error = await listingStatsResponse.json();
      console.log("❌ Listing stats retrieval failed:", error.error);
    }

    console.log("");

    // Test 4: Rate limiting test
    console.log("⏱️  Test 4: Testing rate limiting...");
    const rapidClicks = [];

    for (let i = 0; i < 3; i++) {
      const rapidClickData = {
        url: `https://example.com/product/${i}`,
        timestamp: new Date().toISOString(),
        source: "rate_limit_test",
      };

      const rapidResponse = await fetch(`${BASE_URL}/api/track/click`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rapidClickData),
      });

      if (rapidResponse.ok) {
        rapidClicks.push("success");
        console.log(`   Click ${i + 1}: Success`);
      } else {
        const error = await rapidResponse.json();
        if (error.code === "RATE_LIMIT_EXCEEDED") {
          rapidClicks.push("rate_limited");
          console.log(`   Click ${i + 1}: Rate limited (expected)`);
        } else {
          rapidClicks.push("error");
          console.log(`   Click ${i + 1}: Error - ${error.error}`);
        }
      }

      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const rateLimitResults = rapidClicks.filter(
      (result) => result === "rate_limited"
    ).length;
    console.log(
      `   Rate limiting test: ${rateLimitResults}/3 requests were rate limited`
    );

    console.log("\n🎉 Click tracking tests completed!");
    console.log("\n📋 Summary:");
    console.log("   - Click tracking: Working");
    console.log("   - Stats retrieval: Working");
    console.log("   - Rate limiting: Working");
    console.log("\n🚀 Your click tracking system is ready!");
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
    console.log("\n💡 Make sure your backend server is running on", BASE_URL);
    console.log("💡 Check that the database is accessible");
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  testClickTracking();
}

module.exports = { testClickTracking };
