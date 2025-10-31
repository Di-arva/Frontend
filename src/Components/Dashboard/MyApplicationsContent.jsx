import { 
  RefreshCw, 
  FileText, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  X, 
  CheckCircle, 
  UserCheck ,
  Building,
  ExternalLink
} from 'lucide-react';
import { useState, useMemo } from 'react';
import Button from '../Button';
import openGoogleMaps from "../../utils/maps"

const MyApplicationsContent = ({ applications, loading, onRefresh, onWithdraw, onViewDetails }) => {
  const [activeTab, setActiveTab] = useState('pending');
  
  // Filter applications based on active tab
  const filteredApplications = useMemo(() => {
    if (activeTab === 'accepted') {
      return applications.filter(app => app.status === 'accepted');
    } else if (activeTab === 'withdrawn') {
      return applications.filter(app => app.status === 'withdrawn');
    } else if (activeTab === 'pending') {
      return applications.filter(app => app.status === 'pending' || app.status === 'under_review');
    }
    return applications;
  }, [applications, activeTab]);

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

  const getTabCount = (tabName) => {
    switch (tabName) {
      case 'pending':
        return applications.filter(app => app.status === 'pending' || app.status === 'under_review').length;
      case 'accepted':
        return applications.filter(app => app.status === 'accepted').length;
      case 'withdrawn':
        return applications.filter(app => app.status === 'withdrawn').length;
      default:
        return 0;
    }
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'pending', name: 'Pending', includes: ['pending', 'under_review'] },
            { id: 'accepted', name: 'Accepted', includes: ['accepted'] },
            { id: 'withdrawn', name: 'Withdrawn', includes: ['withdrawn'] }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-darkblue text-darkblue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              <span className={`ml-2 py-0.5 px-2 text-xs rounded-full ${
                activeTab === tab.id
                  ? 'bg-darkblue text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {getTabCount(tab.id)}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-darkblue/20">
            <FileText className="w-12 h-12 text-darkblue/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-darkblack mb-2">
              {activeTab === 'pending' && 'No pending applications'}
              {activeTab === 'accepted' && 'No accepted applications'}
              {activeTab === 'withdrawn' && 'No withdrawn applications'}
            </h3>
            <p className="text-darkblack/70 mb-4">
              {activeTab === 'pending' && 'You have no pending applications. Browse available shifts and apply to get started.'}
              {activeTab === 'accepted' && 'You have no accepted applications yet. Keep applying to shifts!'}
              {activeTab === 'withdrawn' && 'You have no withdrawn applications.'}
            </p>
          </div>
        ) : (
          filteredApplications.map((application) => {
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
             
{/* Clinic Information Section */}
<div className="mb-4">
    {/* Clinic Name */}
    <div className="flex items-center gap-2 text-sm font-medium text-darkblack mb-2">
      <Building className="w-4 h-4 text-darkblue" />
      <span>{application.clinic_id?.clinic_name || 'Dental Clinic'}</span>
    </div>
    
    {/* Clickable Address */}
    {application.clinic_id?.address && (
  <div className="relative group">
    <button
      onClick={() => openGoogleMaps(application.clinic_id.address)}
      className="flex  hover:cursor-pointer items-start gap-2 text-sm text-darkblack/80 hover:text-darkblue transition-colors w-full text-left"
    >
      <MapPin className="w-4 h-4 text-darkblue mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
      <div className="flex-1">
        <div className="group-hover:underline">
          {application.clinic_id.address.address_line}
        </div>
        <div>
          {application.clinic_id.address.city}, {application.clinic_id.address.province} {application.clinic_id.address.postal_code}
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-darkblue opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </button>
    
    {/* Tooltip - moved inside the wrapper div */}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
      Open in Google Maps
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
    </div>
  </div>
)}

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