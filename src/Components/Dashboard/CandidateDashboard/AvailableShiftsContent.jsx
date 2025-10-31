import { useState } from 'react';
import { 
  CalendarIcon, 
  Clock, 
  Users, 
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ChevronDown,
  X,
  Loader,
  CheckCircle
} from 'lucide-react';
import Button from '../../Button';

const AvailableShiftsContent = ({ 
  availableShifts = [], 
  loading = false, 
  error = null, 
  pagination = { page: 1, pages: 1, total: 0 },
  filters = {},
  onFilterChange = () => {},
  onPageChange = () => {},
  onApplyToShift = () => {},
  applyLoading = false,
  applySuccess = false,
  onViewDetails = () => {},
  formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
  getStatusBadge = () => 'bg-gray-100 text-gray-800'
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // SIMPLIFIED: Remove complex filter counting
  const activeFiltersCount = 0;

  const resetFilters = () => {
    onFilterChange('certification_level', '');
    onFilterChange('start_from', '');
    onFilterChange('start_to', '');
    onFilterChange('page', 1);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-darkblue animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-md p-6">
      {/* Success Message */}
      {applySuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 mb-6">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-green-800">Application Submitted!</h4>
            <p className="text-green-700 text-sm">Your shift application has been successfully submitted.</p>
          </div>
        </div>
      )}

      {/* Header - SIMPLIFIED */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-3xl font-normal text-darkblack mb-4">Available Shifts</h3>
          <span className="px-3 py-1 text-lightbg bg-darkblue rounded-full text-sm font-medium">
            {pagination.total || 0} Total Shift{(pagination.total || 0) !== 1 ? 's' : ''}
          </span>
        </div>
        <Button
          variant="dark"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800">Error</h4>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* SIMPLIFIED: Remove filters panel for now */}
      {showFilters && (
        <div className="bg-lightbg rounded-3xl p-6 shadow-sm border border-darkblue/20 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-darkblue">Filter Shifts</h4>
            <button onClick={() => setShowFilters(false)}>
              <X className="w-5 h-5 text-darkblue" />
            </button>
          </div>
          <p className="text-darkblue">Filters coming soon...</p>
        </div>
      )}

      {/* SIMPLIFIED: Remove active filters display */}

      {/* SIMPLIFIED Shifts List - Direct array access */}
      {availableShifts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-darkblue/20">
          <AlertCircle className="w-12 h-12 text-darkblue/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-darkblack mb-2">
            No shifts found
          </h3>
          <p className="text-darkblack/70">
            Try adjusting your filters or check back later for new shifts
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {availableShifts.map((shift) => (
            <div key={shift._id} className="bg-lightbg rounded-3xl p-6 shadow-sm border border-darkblue/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-normal text-darkblack mb-2">
                    {shift.title || 'Untitled Shift'}
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(shift.status)}`}>
                      {shift.status ? shift.status.replace('_', ' ') : 'N/A'}
                    </span>
                    {shift.has_applied && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Applied
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-darkblue">
                    ${shift.compensation?.hourly_rate || 0}
                  </div>
                  <div className="text-sm text-darkblack capitalize">
                    per hour
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-darkblack">
                  <CalendarIcon className="w-4 h-4 text-darkblue" />
                  <span>{formatDate(shift.schedule?.start_datetime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-darkblack">
                  <Clock className="w-4 h-4 text-darkblue" />
                  <span>{shift.schedule?.duration_hours || 0} hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-darkblack">
                  <Users className="w-4 h-4 text-darkblue" />
                  <span>{shift.applications_count || 0} applicants</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-lightblue">
                <span className="text-sm text-darkblack">
                  Posted: {' '}
                  <span className="text-darkblue">
                    {formatDate(shift.posted_at)}
                  </span>
                </span>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => onViewDetails(shift._id)}
                    variant="light"
                    size="sm"
                    className="rounded-full"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="dark"
                    size="sm"
                    onClick={() => onApplyToShift(shift._id)}
                    disabled={applyLoading || shift.has_applied}
                    className="rounded-full flex items-center gap-2"
                  >
                    {applyLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Applying...
                      </>
                    ) : shift.has_applied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Applied
                      </>
                    ) : (
                      'Apply Now'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SIMPLIFIED Pagination */}
      {(pagination.pages > 1) && (
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-lightblue mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-darkblack">
              Page {pagination.page} of {pagination.pages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 border border-darkblue/30 rounded-full hover:bg-darkblue hover:text-white disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 border border-darkblue/30 rounded-full hover:bg-darkblue hover:text-white disabled:opacity-50"
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

export default AvailableShiftsContent;