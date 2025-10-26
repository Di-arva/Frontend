import { useState } from 'react';

const AvailableShifts = ({ 
  shifts, 
  loading, 
  error, 
  filters, 
  onFilterChange, 
  onApply, 
  onPageChange,
  onRefresh 
}) => {
  const [localFilters, setLocalFilters] = useState({
    certification_level: filters.certification_level || '',
    specialization: filters.specialization || '',
    start_from: filters.start_from || '',
    start_to: filters.start_to || ''
  });

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleFilterReset = () => {
    const resetFilters = {
      certification_level: '',
      specialization: '',
      start_from: '',
      start_to: ''
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'CAD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button
          onClick={onRefresh}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Filter Shifts</h3>
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certification Level
            </label>
            <select
              value={localFilters.certification_level}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, certification_level: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              <option value="Level_I">Level I</option>
              <option value="Level_II">Level II</option>
              <option value="RDA">RDA</option>
              <option value="CDA">CDA</option>
              <option value="PDA">PDA</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization
            </label>
            <input
              type="text"
              value={localFilters.specialization}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, specialization: e.target.value }))}
              placeholder="e.g., Chairside Assisting"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start From
            </label>
            <input
              type="date"
              value={localFilters.start_from}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, start_from: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start To
            </label>
            <input
              type="date"
              value={localFilters.start_to}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, start_to: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-4 flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleFilterReset}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Shifts List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Available Shifts ({shifts.length})
          </h3>
          <button
            onClick={onRefresh}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Refresh
          </button>
        </div>

        {shifts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No available shifts found matching your criteria.
          </div>
        ) : (
          <div className="grid gap-4">
            {shifts.map((shift) => (
              <div key={shift._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xl font-semibold text-gray-800">{shift.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    shift.priority === 'high' ? 'bg-red-100 text-red-800' :
                    shift.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {shift.priority} priority
                  </span>
                </div>

                <p className="text-gray-600 mb-3">{shift.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <strong>Schedule:</strong>{' '}
                    {formatDate(shift.schedule.start_datetime)} - {formatDate(shift.schedule.end_datetime)}
                  </div>
                  <div>
                    <strong>Duration:</strong> {shift.schedule.duration_hours} hours
                  </div>
                  <div>
                    <strong>Certification:</strong> {shift.requirements.certification_level}
                  </div>
                  <div>
                    <strong>Specializations:</strong>{' '}
                    {shift.requirements.required_specializations?.join(', ') || 'None specified'}
                  </div>
                  <div>
                    <strong>Compensation:</strong>{' '}
                    {formatCurrency(shift.compensation.hourly_rate, shift.compensation.currency)}/hour
                  </div>
                  <div>
                    <strong>Applications:</strong> {shift.applications_count} / {shift.max_applications}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Posted: {formatDate(shift.posted_at)}
                  </span>
                  <button
                    onClick={() => onApply(shift._id)}
                    disabled={shift.applications_count >= shift.max_applications}
                    className={`px-4 py-2 rounded-md font-medium ${
                      shift.applications_count >= shift.max_applications
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {shift.applications_count >= shift.max_applications ? 'Full' : 'Apply Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filters.pages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => onPageChange(filters.page - 1)}
            disabled={filters.page <= 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {filters.page} of {filters.pages}
          </span>
          <button
            onClick={() => onPageChange(filters.page + 1)}
            disabled={filters.page >= filters.pages}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AvailableShifts;