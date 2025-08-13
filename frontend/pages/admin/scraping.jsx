import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Search, Play, Square, Trash2, Eye, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminScraping() {
  const router = useRouter();
  const [platforms, setPlatforms] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enqueueForm, setEnqueueForm] = useState({
    platform: '',
    query: '',
    maxPages: 10
  });

  useEffect(() => {
    fetchPlatforms();
    fetchJobs();
  }, []);

  const fetchPlatforms = async () => {
    try {
      const response = await fetch('/api/admin/scraping/platforms');
      if (response.ok) {
        const data = await response.json();
        setPlatforms(data.platforms);
      }
    } catch (error) {
      console.error('Failed to fetch platforms:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/scraping/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast.error('Failed to fetch scraping jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleEnqueue = async (e) => {
    e.preventDefault();
    
    if (!enqueueForm.platform || !enqueueForm.query) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/admin/scraping/enqueue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enqueueForm),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Job enqueued successfully! Job ID: ${data.jobId}`);
        setEnqueueForm({ platform: '', query: '', maxPages: 10 });
        fetchJobs(); // Refresh job list
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to enqueue job');
      }
    } catch (error) {
      console.error('Failed to enqueue job:', error);
      toast.error('Failed to enqueue job');
    }
  };

  const handleJobAction = async (jobId, action) => {
    try {
      const response = await fetch(`/api/admin/scraping/jobs/${jobId}/${action}`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success(`Job ${action} successful`);
        fetchJobs(); // Refresh job list
      } else {
        const error = await response.json();
        toast.error(error.message || `Failed to ${action} job`);
      }
    } catch (error) {
      console.error(`Failed to ${action} job:`, error);
      toast.error(`Failed to ${action} job`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Scraping Management</h1>
          <p className="mt-2 text-gray-600">Manage web scraping jobs and monitor progress</p>
        </div>

        {/* Enqueue Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Enqueue New Job</h2>
          <form onSubmit={handleEnqueue} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform *
                </label>
                <select
                  value={enqueueForm.platform}
                  onChange={(e) => setEnqueueForm({ ...enqueueForm, platform: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Platform</option>
                  {platforms.map((platform) => (
                    <option key={platform.name} value={platform.name}>
                      {platform.displayName || platform.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Query *
                </label>
                <input
                  type="text"
                  value={enqueueForm.query}
                  onChange={(e) => setEnqueueForm({ ...enqueueForm, query: e.target.value })}
                  placeholder="e.g., iPhone 13, gaming laptop"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Pages
                </label>
                <input
                  type="number"
                  value={enqueueForm.maxPages}
                  onChange={(e) => setEnqueueForm({ ...enqueueForm, maxPages: parseInt(e.target.value) })}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Enqueue Job</span>
              </button>
            </div>
          </form>
        </div>

        {/* Job List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Scraping Jobs</h2>
              <div className="flex space-x-2">
                <button
                  onClick={fetchJobs}
                  disabled={loading}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <a
                  href="/admin/queues"
                  className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Queue Monitor</span>
                </a>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Query
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Started
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Finished
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      Loading jobs...
                    </td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No scraping jobs found
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {job.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.platform}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.query}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(job.startedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(job.finishedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {job.status === 'running' && (
                            <button
                              onClick={() => handleJobAction(job.id, 'stop')}
                              className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                            >
                              <Square className="w-4 h-4" />
                              <span>Stop</span>
                            </button>
                          )}
                          {job.status === 'failed' && (
                            <button
                              onClick={() => handleJobAction(job.id, 'retry')}
                              className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                            >
                              <RefreshCw className="w-4 h-4" />
                              <span>Retry</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleJobAction(job.id, 'delete')}
                            className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
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
