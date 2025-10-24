import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader
} from "lucide-react";

const ClinicTasksList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Filters
  const [filters, setFilters] = useState({
    status: [],
    priority: '',
    certification_level: '',
    specialization: '',
    start_from: '',
    start_to: '',
    sort_by: 'schedule.start_datetime',
    sort_dir: 'asc'
  });

  const [showFilters, setShowFilters] = useState(false);

  // Fetch tasks from API
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      // Extract clinic_id from JWT token
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const tokenData = JSON.parse(jsonPayload);
      const clinicId = tokenData.sub;
      
      if (!clinicId) {
        setError('Clinic ID not found in token. Please log in again.');
        setLoading(false);
        return;
      }

      // Build query parameters
      const params = new URLSearchParams();
      params.append('clinic_id', clinicId);
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);
      
      // Handle comma-separated status
      if (filters.status && filters.status.length > 0) {
        params.append('status', filters.status.join(','));
      }
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.certification_level) params.append('certification_level', filters.certification_level);
      if (filters.specialization) params.append('specialization', filters.specialization);
      if (filters.start_from) params.append('start_from', new Date(filters.start_from).toISOString());
      if (filters.start_to) params.append('start_to', new Date(filters.start_to).toISOString());
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.sort_dir) params.append('sort_dir', filters.sort_dir);

      const apiBaseUrl = import.meta?.env?.VITE_SERVER_BASE_URL || 'http://localhost:1080';
      const response = await fetch(`${apiBaseUrl}/api/v1/clinic/tasks?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setError('Session expired. Please log in again.');
        setLoading(false);
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch tasks');
      }

      if (result.success) {
        setTasks(result.data || []);
        setPagination({
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: result.pages
        });
      } else {
        throw new Error('Failed to fetch tasks');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on mount and when filters/pagination change
  useEffect(() => {
    fetchTasks();
  }, [pagination.page, filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Handle multiple status selection
  const handleStatusToggle = (status) => {
    setFilters(prev => {
      const currentStatuses = prev.status || [];
      const newStatuses = currentStatuses.includes(status)
        ? currentStatuses.filter(s => s !== status)
        : [...currentStatuses, status];
      return { ...prev, status: newStatuses };
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: [],
      priority: '',
      certification_level: '',
      specialization: '',
      start_from: '',
      start_to: '',
      sort_by: 'schedule.start_datetime',
      sort_dir: 'asc'
    });
  };

  // Status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-blue-100 text-blue-700',
      assigned: 'bg-yellow-100 text-yellow-700',
      in_progress: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  // Priority badge styling
  const getPriorityBadge = (priority) => {
    const styles = {
      low: 'bg-gray-100 text-gray-700',
      normal: 'bg-blue-100 text-blue-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700'
    };
    return styles[priority] || 'bg-gray-100 text-gray-700';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Posted Shifts</h2>
          <p className="text-gray-600 text-sm mt-1">
            {pagination.total} total shift{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800">Error</h4>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="space-y-4">
            {/* Status - Multiple Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status (Multiple)</label>
              <div className="flex flex-wrap gap-2">
                {['open', 'assigned', 'in_progress', 'completed', 'cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusToggle(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.status.includes(status)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
              {filters.status.length > 0 && (
                <p className="text-xs text-gray-600 mt-2">
                  Selected: {filters.status.join(', ')}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certification Level</label>
                <select
                  value={filters.certification_level}
                  onChange={(e) => handleFilterChange('certification_level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Levels</option>
                  <option value="Level_I">Level I</option>
                  <option value="Level_II">Level II</option>
                  <option value="RDA">RDA</option>
                  <option value="CDA">CDA</option>
                  <option value="PDA">PDA</option>
                  <option value="Any">Any</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <input
                  type="text"
                  value={filters.specialization}
                  onChange={(e) => handleFilterChange('specialization', e.target.value)}
                  placeholder="e.g., Chairside Assisting"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sort_by}
                  onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="schedule.start_datetime">Start Date</option>
                  <option value="posted_at">Posted Date</option>
                  <option value="priority">Priority</option>
                  <option value="compensation.hourly_rate">Hourly Rate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start From</label>
                <input
                  type="date"
                  value={filters.start_from}
                  onChange={(e) => handleFilterChange('start_from', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start To</label>
                <input
                  type="date"
                  value={filters.start_to}
                  onChange={(e) => handleFilterChange('start_to', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Direction</label>
                <select
                  value={filters.sort_dir}
                  onChange={(e) => handleFilterChange('sort_dir', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No shifts found</h3>
            <p className="text-gray-600">Try adjusting your filters or post a new shift</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                    {task.requirements?.certification_level && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {task.requirements.certification_level.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    ${task.compensation?.hourly_rate}
                  </div>
                  <div className="text-sm text-gray-600">per hour</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(task.schedule?.start_datetime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{task.schedule?.duration_hours} hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{task.applications_count || 0} / {task.max_applications} applicants</span>
                </div>
              </div>

              {task.requirements?.required_specializations && task.requirements.required_specializations.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <span className="text-sm font-medium text-gray-700">Required:</span>
                  {task.requirements.required_specializations.map((spec, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {spec}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  Posted {formatDate(task.posted_at)}
                </span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicTasksList;