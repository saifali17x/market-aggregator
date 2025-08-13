import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Link, Eye } from "lucide-react";
import {
  getOverallClickStats,
  getListingClickStats,
} from "../services/clickTracking";

export default function ClickStats({ listingId = null }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [listingId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      let data;

      if (listingId) {
        data = await getListingClickStats(listingId);
      } else {
        data = await getOverallClickStats();
      }

      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading stats...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading stats: {error}</p>
        <button
          onClick={fetchStats}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">No statistics available</p>
      </div>
    );
  }

  const renderOverallStats = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.summary?.totalClicks || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.summary?.uniqueVisitors || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Link className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Unique Listings</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.summary?.uniqueListings || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Unique Sellers</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.summary?.uniqueSellers || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Clicks */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Clicks</h3>
        </div>
        <div className="p-6">
          {stats.recentClicks && stats.recentClicks.length > 0 ? (
            <div className="space-y-3">
              {stats.recentClicks.map((click, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {click.url}
                    </p>
                    <p className="text-xs text-gray-500">
                      {click.referrerIp} • {click.source} •{" "}
                      {new Date(click.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent clicks</p>
          )}
        </div>
      </div>

      {/* Top URLs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Top Clicked URLs
          </h3>
        </div>
        <div className="p-6">
          {stats.topUrls && stats.topUrls.length > 0 ? (
            <div className="space-y-3">
              {stats.topUrls.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {url.url}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">
                      {url.clickCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No URL data available
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderListingStats = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalClicks || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.uniqueVisitors || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Click History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Click History</h3>
        </div>
        <div className="p-6">
          {stats.clicks && stats.clicks.length > 0 ? (
            <div className="space-y-3">
              {stats.clicks.map((click) => (
                <div
                  key={click.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {click.url}
                    </p>
                    <p className="text-xs text-gray-500">
                      {click.referrerIp} • {click.source} •{" "}
                      {new Date(click.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No click history available
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {listingId ? "Listing Click Statistics" : "Overall Click Statistics"}
        </h2>
        <button
          onClick={fetchStats}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {listingId ? renderListingStats() : renderOverallStats()}
    </div>
  );
}
