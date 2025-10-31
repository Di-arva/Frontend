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
import Button from '../Button';

const AvailableShiftsContent = ({ 
  availableShifts, 
  loading, 
  error, 
  pagination,
  filters,
  onFilterChange,
  onPageChange,
  onApplyToShift,
  applyLoading,
  applySuccess,
  onViewDetails,
  formatDate,
  getStatusBadge 
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const activeFiltersCount = [
    filters.certification_level,
    filters.specialization,
    filters.start_from,
    filters.start_to,
  ].filter(Boolean).length;

  const resetFilters = () => {
    onFilterChange('certification_level', '');
    onFilterChange('specialization', '');
    onFilterChange('start_from', '');
    onFilterChange('start_to', '');
    onFilterChange('page', 1);
  };

  if (loading && availableShifts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-darkblue animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-md p-6">
      {/* Success Message */}
      {applySuccess && <SuccessMessage />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-3xl font-normal text-darkblack mb-4">Available Shifts</h3>
          <span className="px-3 py-1 text-lightbg bg-darkblue rounded-full text-sm font-medium">
            {pagination.total} Total Shift{pagination.total !== 1 ? 's' : ''}
          </span>
        </div>
        <Button
          variant="dark"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors relative"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-lightblue text-darkblack border border-darkblue text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {error && <ErrorMessage error={error} />}

      {/* Filters Panel */}
      {showFilters && (
        <FiltersPanel
          filters={filters}
          onFilterChange={onFilterChange}
          onClose={() => setShowFilters(false)}
          onReset={resetFilters}
          activeFiltersCount={activeFiltersCount}
        />
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <ActiveFilters 
          filters={filters}
          onFilterChange={onFilterChange}
        />
      )}

      {/* Shifts List */}
      <ShiftsList
        shifts={availableShifts}
        onApplyToShift={onApplyToShift}
        onViewDetails={onViewDetails}
        applyLoading={applyLoading}
        formatDate={formatDate}
        getStatusBadge={getStatusBadge}
      />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Pagination
          pagination={pagination}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

const SuccessMessage = () => (
  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 mb-6">
    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
    <div>
      <h4 className="font-semibold text-green-800">Application Submitted!</h4>
      <p className="text-green-700 text-sm">Your shift application has been successfully submitted.</p>
    </div>
  </div>
);

const ErrorMessage = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-6">
    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
    <div>
      <h4 className="font-semibold text-red-800">Error</h4>
      <p className="text-red-700 text-sm">{error}</p>
    </div>
  </div>
);

const FiltersPanel = ({ filters, onFilterChange, onClose, onReset, activeFiltersCount }) => (
  <div className="bg-lightbg rounded-3xl p-6 shadow-sm border border-darkblue/20 mb-6">
    <div className="flex items-center justify-between mb-6">
      <h4 className="text-lg font-semibold text-darkblue">Filter Shifts</h4>
      <div className="flex items-center gap-3">
        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="text-sm text-darkblue hover:underline font-medium cursor-pointer"
          >
            Clear All
          </button>
        )}
        <button
          onClick={onClose}
          className="p-1 hover:bg-darkblue transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-darkblue hover:text-lightbg" />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FilterSelect
        label="Certification Level"
        value={filters.certification_level}
        onChange={(value) => onFilterChange('certification_level', value)}
        options={[
          { value: '', label: 'All Levels' },
          { value: 'Level_I', label: 'Level I' },
          { value: 'Level_II', label: 'Level II' },
          { value: 'HARP', label: 'HARP' }
        ]}
      />

      <FilterInput
        label="Start From"
        type="date"
        value={filters.start_from}
        onChange={(value) => onFilterChange('start_from', value)}
      />

      <FilterInput
        label="Start To"
        type="date"
        value={filters.start_to}
        onChange={(value) => onFilterChange('start_to', value)}
      />

      <FilterSelect
        label="Sort By"
        value={filters.sort_by}
        onChange={(value) => onFilterChange('sort_by', value)}
        options={[
          { value: 'schedule.start_datetime', label: 'Start Date' },
          { value: 'compensation.hourly_rate', label: 'Hourly Rate' },
          { value: 'posted_at', label: 'Date Posted' }
        ]}
      />
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-darkblue/20 mt-6">
      <span className="text-sm text-darkblue">
        {activeFiltersCount} Active Filter{activeFiltersCount !== 1 ? 's' : ''}
      </span>
      <div className="flex items-center gap-3">
        <button
          onClick={onReset}
          className="px-6 py-2 border border-darkblue text-darkblue rounded-full hover:bg-darkblue hover:text-white transition-all duration-200"
        >
          Reset
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-darkblue text-white rounded-full hover:bg-darkblue/90 transition-all duration-200"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
);

const FilterSelect = ({ label, value, onChange, options }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-darkblue mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none w-full px-4 py-2 bg-white border border-darkblue/30 rounded-full text-darkblack focus:outline-none focus:ring-2 focus:ring-darkblue focus:border-transparent transition-all"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-10 w-5 h-5 text-darkblue pointer-events-none" />
  </div>
);

const FilterInput = ({ label, type, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-darkblue mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 bg-white border border-darkblue/30 rounded-full text-darkblack focus:outline-none focus:ring-2 focus:ring-darkblue focus:border-transparent transition-all"
    />
  </div>
);

const ActiveFilters = ({ filters, onFilterChange }) => (
  <div className="flex items-center gap-2 flex-wrap mb-6">
    <span className="text-sm text-darkblue font-medium">Active filters:</span>
    {filters.certification_level && (
      <FilterChip
        label={`Cert: ${filters.certification_level}`}
        onRemove={() => onFilterChange('certification_level', '')}
      />
    )}
    {filters.start_from && (
      <FilterChip
        label={`From: ${filters.start_from}`}
        onRemove={() => onFilterChange('start_from', '')}
      />
    )}
    {filters.start_to && (
      <FilterChip
        label={`To: ${filters.start_to}`}
        onRemove={() => onFilterChange('start_to', '')}
      />
    )}
  </div>
);

const FilterChip = ({ label, onRemove }) => (
  <span className="px-3 py-1 bg-darkblue text-white rounded-full text-xs font-medium">
    {label}
    <button
      onClick={onRemove}
      className="ml-2 hover:text-red-200"
    >
      ×
    </button>
  </span>
);

const ShiftsList = ({ shifts, onApplyToShift, onViewDetails, applyLoading, formatDate, getStatusBadge }) => {
  if (shifts.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-darkblue/20">
        <AlertCircle className="w-12 h-12 text-darkblue/50 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-darkblack mb-2">
          No shifts found
        </h3>
        <p className="text-darkblack/70">
          Try adjusting your filters or check back later for new shifts
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shifts.map((shift) => (
        <ShiftCard
          key={shift._id}
          shift={shift}
          onApplyToShift={onApplyToShift}
          onViewDetails={onViewDetails}
          applyLoading={applyLoading}
          formatDate={formatDate}
          getStatusBadge={getStatusBadge}
        />
      ))}
    </div>
  );
};

const ShiftCard = ({ shift, onApplyToShift, onViewDetails, applyLoading, formatDate, getStatusBadge }) => (
  <div className="bg-lightbg rounded-3xl p-6 shadow-sm border border-darkblue/20 hover:shadow-md transition-all duration-300 hover:border-darkblue/40">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-normal text-darkblack mb-2">
          {shift.title}
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(shift.status)}`}>
            {shift.status.replace('_', ' ')}
          </span>
          {shift.requirements?.certification_level && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
              {shift.requirements.certification_level.replace('_', ' ')}
            </span>
          )}
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
          ${shift.compensation?.hourly_rate}
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
        <span>{shift.schedule?.duration_hours} hours</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-darkblack">
        <Users className="w-4 h-4 text-darkblue" />
        <span>{shift.applications_count || 0} applicants</span>
      </div>
    </div>

    {shift.description && (
      <div className="mb-4">
        <p className="text-sm text-darkblack line-clamp-2">
          {shift.description}
        </p>
      </div>
    )}

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
          className="rounded-full transition-all duration-200 hover:scale-105"
        >
          View Details
        </Button>
        <Button
          variant="dark"
          size="sm"
          onClick={() => onApplyToShift(shift._id)}
          disabled={applyLoading || shift.has_applied}
          className="rounded-full transition-all duration-200 hover:scale-105 flex items-center gap-2"
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
);

const Pagination = ({ pagination, onPageChange }) => (
  <div className="bg-white rounded-3xl p-4 shadow-sm border border-lightblue mt-6">
    <div className="flex items-center justify-between">
      <div className="text-sm text-darkblack">
        Page {pagination.page} of {pagination.pages}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="p-2 border border-darkblue/30 rounded-full hover:bg-darkblue hover:text-white disabled:opacity-50 transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.pages}
          className="p-2 border border-darkblue/30 rounded-full hover:bg-darkblue hover:text-white disabled:opacity-50 transition-all duration-200"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

export default AvailableShiftsContent;