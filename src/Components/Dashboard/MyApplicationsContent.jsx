import { 
  RefreshCw, 
  FileText, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  X, 
  CheckCircle, 
  UserCheck 
} from 'lucide-react';
import Button from '../Button';

const MyApplicationsContent = ({ applications, loading, onRefresh, onWithdraw, onViewDetails }) => {
  
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      under_review: 'bg-blue-100 text-blue-700 border border-blue-200',
      accepted: 'bg-green-100 text-green-700 border border-green-200',
      rejected: 'bg-red-100 text-red-700 border border-red-200',
      withdrawn: 'bg-gray-100 text-gray-700 border border-gray-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-700 border border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      under_review: UserCheck,
      accepted: CheckCircle,
      rejected: X,
      withdrawn: X
    };
    return icons[status] || AlertCircle;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-darkblue animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-normal text-darkblack mb-2">My Applications</h3>
          <p className="text-darkblack/70">
            Track the status of your shift applications
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-darkblue text-white rounded-full hover:bg-darkblue/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-darkblue/20">
            <FileText className="w-12 h-12 text-darkblue/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-darkblack mb-2">
              No applications yet
            </h3>
            <p className="text-darkblack/70 mb-4">
              You haven't applied to any shifts yet. Browse available shifts and apply to get started.
            </p>
          </div>
        ) : (
          applications.map((application) => {
            const StatusIcon = getStatusIcon(application.status);
            return (
              <div
                key={application._id}
                className="bg-lightbg rounded-3xl p-6 shadow-sm border border-darkblue/20 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-normal text-darkblack mb-2">
                      {application.task_id?.title || 'Shift'}
                    </h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${getStatusBadge(
                          application.status
                        )}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {application.status.replace('_', ' ')}
                      </span>
                      {application.task_id?.requirements?.certification_level && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                          {application.task_id.requirements.certification_level.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold text-darkblue">
                      ${application.task_id?.compensation?.hourly_rate || 'N/A'}
                    </div>
                    <div className="text-sm text-darkblack capitalize">
                      per hour
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-darkblack">
                    <Calendar className="w-4 h-4 text-darkblue" />
                    <span>
                      {application.task_id?.schedule?.start_datetime 
                        ? formatDate(application.task_id.schedule.start_datetime)
                        : 'Date not set'
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-darkblack">
                    <Clock className="w-4 h-4 text-darkblue" />
                    <span>{application.task_id?.schedule?.duration_hours || 0} hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-darkblack">
                    <MapPin className="w-4 h-4 text-darkblue" />
                    <span>{application.clinic_id?.name || 'Clinic'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-lightblue">
                  <div className="text-sm text-darkblack">
                    Applied: {' '}
                    <span className="text-darkblue font-medium">
                      {formatDate(application.applied_at)}
                    </span>
                    {application.reviewed_at && (
                      <>
                        {' • '}Reviewed: {' '}
                        <span className="text-darkblue font-medium">
                          {formatDate(application.reviewed_at)}
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Application-specific actions */}
                  <div className="flex items-center gap-3">
                    {application.status === 'pending' && (
                      <button
                        onClick={() => onWithdraw(application._id)}
                        className="px-4 py-2 text-red-600 border border-red-300 rounded-full hover:bg-red-50 transition-colors text-sm"
                      >
                        Withdraw
                      </button>
                    )}
                    <Button
                      onClick={() => onViewDetails(application.task_id?._id)}
                      variant="light"
                      size="sm"
                      className="rounded-full"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyApplicationsContent;