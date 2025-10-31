import { X, CalendarIcon, Clock, Users, DollarSign, Briefcase, Loader, CheckCircle } from 'lucide-react';
import Button from '../../Button';

const ShiftDetailsModal = ({ 
  shift, 
  onClose, 
  onApply, 
  applyLoading, 
  formatDate, 
  formatTime,
  getStatusBadge 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Shift Details</h3>
            <p className="text-gray-600 mt-1">View shift information and apply</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Basic Information</h4>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-normal text-gray-800 mb-3">
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
                <div className="text-3xl font-bold text-blue-600">
                  ${shift.compensation?.hourly_rate}
                </div>
                <div className="text-sm text-gray-600">per hour</div>
              </div>
            </div>

            {shift.description && (
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-gray-700">{shift.description}</p>
              </div>
            )}
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Schedule</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ScheduleItem
                icon={CalendarIcon}
                label="Date"
                value={formatDate(shift.schedule?.start_datetime)}
              />
              <ScheduleItem
                icon={Clock}
                label="Duration"
                value={`${shift.schedule?.duration_hours} hours`}
              />
              <ScheduleItem
                icon={Clock}
                label="Start Time"
                value={formatTime(shift.schedule?.start_datetime)}
              />
              <ScheduleItem
                icon={Clock}
                label="End Time"
                value={formatTime(shift.schedule?.end_datetime)}
              />
            </div>
          </div>

          {/* Compensation */}
          <CompensationSection shift={shift} />

          {/* Requirements */}
          {shift.requirements && <RequirementsSection requirements={shift.requirements} />}

          {/* Applications */}
          <ApplicationsSection applicationsCount={shift.applications_count || 0} />

          {/* Action Buttons */}
          <ActionButtons
            onClose={onClose}
            onApply={() => onApply(shift._id)}
            applyLoading={applyLoading}
            hasApplied={shift.has_applied}
          />
        </div>
      </div>
    </div>
  );
};

const ScheduleItem = ({ icon: Icon, label, value }) => (
  <div className="bg-blue-50 rounded-xl p-4">
    <div className="flex items-center gap-2 text-blue-700 font-medium">
      <Icon className="w-5 h-5" />
      {label}
    </div>
    <div className="text-gray-800 font-medium text-lg mt-2">
      {value}
    </div>
  </div>
);

const CompensationSection = ({ shift }) => (
  <div className="space-y-4">
    <h4 className="text-lg font-semibold text-gray-800">Compensation</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CompensationItem
        icon={DollarSign}
        label="Hourly Rate"
        value={`$${shift.compensation?.hourly_rate} ${shift.compensation?.currency}`}
      />
      {shift.compensation?.total_amount && (
        <CompensationItem
          icon={DollarSign}
          label="Total Amount"
          value={`$${shift.compensation.total_amount} ${shift.compensation.currency}`}
        />
      )}
    </div>
  </div>
);

const CompensationItem = ({ icon: Icon, label, value }) => (
  <div className="bg-blue-50 rounded-xl p-4">
    <div className="flex items-center gap-2 text-blue-700 font-medium">
      <Icon className="w-5 h-5" />
      {label}
    </div>
    <div className="text-gray-800 font-medium text-2xl mt-2">
      {value}
    </div>
  </div>
);

const RequirementsSection = ({ requirements }) => (
  <div className="space-y-4">
    <h4 className="text-lg font-semibold text-gray-800">Requirements</h4>
    <div className="bg-blue-50 rounded-xl p-4">
      <div className="space-y-3">
        {requirements.certification_level && (
          <RequirementItem
            icon={Briefcase}
            text={`Certification: ${requirements.certification_level.replace('_', ' ')}`}
          />
        )}
        {requirements.minimum_experience && (
          <RequirementItem
            icon={Users}
            text={`Minimum Experience: ${requirements.minimum_experience} years`}
          />
        )}
      </div>
    </div>
  </div>
);

const RequirementItem = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2">
    <Icon className="w-4 h-4 text-blue-700" />
    <span className="text-gray-700">{text}</span>
  </div>
);

const ApplicationsSection = ({ applicationsCount }) => (
  <div className="space-y-4">
    <h4 className="text-lg font-semibold text-gray-800">Applications</h4>
    <div className="bg-blue-50 rounded-xl p-4">
      <div className="flex items-center gap-2 text-blue-700 font-medium">
        <Users className="w-5 h-5" />
        Total Applicants
      </div>
      <div className="text-gray-800 font-medium text-2xl mt-2">
        {applicationsCount}
      </div>
    </div>
  </div>
);

const ActionButtons = ({ onClose, onApply, applyLoading, hasApplied }) => (
  <div className="flex gap-3 pt-6 border-t border-gray-200">
    <Button
      variant="light"
      size="lg"
      onClick={onClose}
      className="flex-1"
    >
      Close
    </Button>
    <Button
      variant="dark"
      size="lg"
      onClick={onApply}
      disabled={applyLoading || hasApplied}
      className="flex-1 flex items-center justify-center gap-2"
    >
      {applyLoading ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          Applying...
        </>
      ) : hasApplied ? (
        <>
          <CheckCircle className="w-4 h-4" />
          Applied
        </>
      ) : (
        'Apply Now'
      )}
    </Button>
  </div>
);

export default ShiftDetailsModal;