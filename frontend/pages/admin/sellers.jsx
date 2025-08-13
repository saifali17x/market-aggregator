import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Eye, RefreshCw, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    verified: 'all',
    search: ''
  });

  useEffect(() => {
    fetchSellers();
  }, [filters]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.verified !== 'all') {
        queryParams.append('verified', filters.verified);
      }
      if (filters.search) {
        queryParams.append('search', filters.search);
      }

      const response = await fetch(`/api/admin/sellers?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setSellers(data.sellers);
      } else {
        toast.error('Failed to fetch sellers');
      }
    } catch (error) {
      console.error('Failed to fetch sellers:', error);
      toast.error('Failed to fetch sellers');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationToggle = async (sellerId, verified) => {
    try {
      const response = await fetch(`/api/admin/sellers/${sellerId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verified }),
      });

      if (response.ok) {
        toast.success(`Seller ${verified ? 'verified' : 'unverified'} successfully`);
        fetchSellers(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update verification status');
      }
    } catch (error) {
      console.error('Failed to update verification status:', error);
      toast.error('Failed to update verification status');
    }
  };

  const handleStatusUpdate = async (sellerId, status) => {
    try {
      const response = await fetch(`/api/admin/sellers/${sellerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success(`Seller status updated to ${status}`);
        fetchSellers(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update seller status');
      }
    } catch (error) {
      console.error('Failed to update seller status:', error);
      toast.error('Failed to update seller status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const filteredSellers = sellers.filter(seller => {
    if (filters.verified !== 'all' && seller.is_verified !== (filters.verified === 'true')) {
      return false;
    }
    if (filters.search && !seller.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Management</h1>
          <p className="mt-2 text-gray-600">Manage seller accounts and verification status</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Status
              </label>
              <select
                value={filters.verified}
                onChange={(e) => setFilters({ ...filters, verified: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sellers</option>
                <option value="true">Verified Only</option>
                <option value="false">Unverified Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Sellers
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search by name, email, or platform..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchSellers}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sellers List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Sellers ({filteredSellers.length})
              </h2>
              <div className="text-sm text-gray-500">
                {sellers.filter(s => s.is_verified).length} verified, {sellers.filter(s => !s.is_verified).length} unverified
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Loading sellers...
                    </td>
                  </tr>
                ) : filteredSellers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No sellers found matching the current filters
                    </td>
                  </tr>
                ) : (
                  filteredSellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {seller.name?.charAt(0)?.toUpperCase() || 'S'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {seller.name || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {seller.email || seller.contact_info || 'No contact info'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {seller.platform || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(seller.status)}`}>
                          {seller.status || 'unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {seller.is_verified ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span className={`text-sm ${seller.is_verified ? 'text-green-600' : 'text-red-600'}`}>
                            {seller.is_verified ? 'Verified' : 'Unverified'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(seller.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {/* Verification Toggle */}
                          <button
                            onClick={() => handleVerificationToggle(seller.id, !seller.is_verified)}
                            className={`px-3 py-1 text-xs rounded-md ${
                              seller.is_verified
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {seller.is_verified ? 'Unverify' : 'Verify'}
                          </button>

                          {/* Status Update */}
                          <select
                            value={seller.status || 'unknown'}
                            onChange={(e) => handleStatusUpdate(seller.id, e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                            <option value="pending">Pending</option>
                          </select>

                          {/* View Details */}
                          <button
                            onClick={() => window.open(seller.platform_url || '#', '_blank')}
                            className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                            title="View on platform"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
