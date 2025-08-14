/**
 * Click Tracking Service
 * Handles outbound link click tracking for analytics
 */

const TRACKING_ENDPOINT = "/api/track/click";

/**
 * Track a click event
 * @param {Object} options - Tracking options
 * @param {string} options.url - URL being clicked
 * @param {string} [options.listingId] - Associated listing ID
 * @param {string} [options.sellerId] - Associated seller ID
 * @param {string} [options.source] - Source of the click
 * @param {boolean} [options.openInNewTab] - Whether to open in new tab
 */
export const trackClick = async (options) => {
  const {
    url,
    listingId,
    sellerId,
    source = "frontend",
    openInNewTab = false,
  } = options;

  if (!url) {
    console.error("Click tracking: URL is required");
    return false;
  }

  try {
    // Prepare tracking data
    const trackingData = {
      url,
      listingId,
      sellerId,
      source,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      sessionId: getSessionId(),
    };

    // Send tracking request
    const response = await fetch(TRACKING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trackingData),
    });

    if (!response.ok) {
      throw new Error(`Tracking failed: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      console.log("Click tracked successfully:", url);

      // Open URL if requested
      if (openInNewTab) {
        window.open(url, "_blank", "noopener,noreferrer");
      }

      return true;
    } else {
      console.warn("Click tracking response error:", result.error);
      return false;
    }
  } catch (error) {
    console.error("Click tracking error:", error);

    // Fallback: still open the URL even if tracking fails
    if (openInNewTab) {
      window.open(url, "_blank", "noopener,noreferrer");
    }

    return false;
  }
};

/**
 * Track a click with automatic new tab opening
 * @param {Object} options - Tracking options
 */
export const trackClickAndOpen = async (options) => {
  return await trackClick({ ...options, openInNewTab: true });
};

/**
 * Get or create a session ID
 */
function getSessionId() {
  let sessionId = sessionStorage.getItem("click_tracking_session");

  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem("click_tracking_session", sessionId);
  }

  return sessionId;
}

/**
 * Generate a unique session ID
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Track multiple clicks in batch (for performance)
 * @param {Array} clicks - Array of click data
 */
export const trackClicksBatch = async (clicks) => {
  if (!Array.isArray(clicks) || clicks.length === 0) {
    return [];
  }

  const results = [];

  for (const click of clicks) {
    try {
      const result = await trackClick(click);
      results.push({ ...click, tracked: result });
    } catch (error) {
      results.push({ ...click, tracked: false, error: error.message });
    }
  }

  return results;
};

/**
 * Track page view (for analytics)
 * @param {Object} options - Page view options
 */
export const trackPageView = async (options = {}) => {
  const { page, title, referrer = document.referrer } = options;

  try {
    const trackingData = {
      url: window.location.href,
      source: "page_view",
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer,
      sessionId: getSessionId(),
      metadata: {
        page,
        title: title || document.title,
        path: window.location.pathname,
        search: window.location.search,
      },
    };

    const response = await fetch(TRACKING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trackingData),
    });

    if (response.ok) {
      console.log("Page view tracked:", page || window.location.pathname);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Page view tracking error:", error);
    return false;
  }
};

// Click tracking service for analytics
export const getListingClickStats = async (listingId) => {
  try {
    // Mock data for now - replace with actual API call
    return {
      success: true,
      data: {
        listingId,
        clicks: Math.floor(Math.random() * 100) + 10,
        uniqueVisitors: Math.floor(Math.random() * 50) + 5,
        conversionRate: (Math.random() * 0.1 + 0.02).toFixed(3),
        lastClicked: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error fetching listing click stats:', error);
    return {
      success: false,
      error: 'Failed to fetch click statistics'
    };
  }
};

export const getOverallClickStats = async () => {
  try {
    // Mock data for now - replace with actual API call
    return {
      success: true,
      data: {
        totalClicks: Math.floor(Math.random() * 1000) + 100,
        totalUniqueVisitors: Math.floor(Math.random() * 500) + 50,
        averageConversionRate: (Math.random() * 0.15 + 0.05).toFixed(3),
        topPerformingListings: [
          { id: 1, title: "iPhone 15 Pro Max", clicks: 156 },
          { id: 2, title: "MacBook Pro M3", clicks: 142 },
          { id: 3, title: "Samsung Galaxy S24", clicks: 98 }
        ]
      }
    };
  } catch (error) {
    console.error('Error fetching overall click stats:', error);
    return {
      success: false,
      error: 'Failed to fetch overall statistics'
    };
  }
};

export const trackListingClick = async (listingId, userId = null) => {
  try {
    // Mock API call to track click
    console.log(`Tracking click for listing ${listingId} by user ${userId || 'anonymous'}`);
    
    // In production, this would send data to your analytics service
    return {
      success: true,
      message: 'Click tracked successfully'
    };
  } catch (error) {
    console.error('Error tracking click:', error);
    return {
      success: false,
      error: 'Failed to track click'
    };
  }
};

export default {
  trackClick,
  trackClickAndOpen,
  trackClicksBatch,
  trackPageView,
};
