import { FileText, CheckCircle, CalendarIcon } from 'lucide-react';

const DashboardContent = ({ myApplications, navigate, formatDate }) => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <QuickActions navigate={navigate} />

      {/* Recent Activity */}
      <RecentApplications 
        applications={myApplications} 
        formatDate={formatDate} 
      />
    </div>
  );
};

const QuickActions = ({ navigate }) => (
  <div className="bg-white rounded-3xl shadow-md p-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
    <div className="flex gap-4 flex-wrap">
      <QuickActionButton
        icon={FileText}
        label="Browse Available Shifts"
        onClick={() => navigate('/candidate/shifts')}
        primary
      />
      <QuickActionButton
        icon={CheckCircle}
        label="View My Applications"
        onClick={() => navigate('/candidate/my-applications')}
      />
      <QuickActionButton
        icon={CalendarIcon}
        label="View My Schedule"
        onClick={() => navigate('/candidate/schedule')}
      />
    </div>
  </div>
);

const QuickActionButton = ({ icon: Icon, label, onClick, primary = false }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-full hover:scale-105 transition-all duration-200 flex items-center gap-2 ${
      primary 
        ? 'bg-darkblue text-white hover:bg-darkblue/90' 
        : 'border border-darkblue text-darkblue hover:bg-darkblue hover:text-white'
    }`}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

const RecentApplications = ({ applications, formatDate }) => (
  <div className="bg-white rounded-3xl shadow-md p-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Applications</h3>
    <div className="space-y-3">
      {applications.slice(0, 5).map((app, index) => (
        <ApplicationItem 
          key={index} 
          application={app} 
          formatDate={formatDate} 
        />
      ))}
      {applications.length === 0 && (
        <p className="text-gray-500 text-center py-4">No applications yet. Start applying to shifts!</p>
      )}
    </div>
  </div>
);

const ApplicationItem = ({ application, formatDate }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 rounded-lg">
    <div className="flex-1">
      <p className="font-medium text-gray-800">{application.task_id?.title || 'Shift'}</p>
      <p className="text-sm text-gray-600">Applied on {formatDate(application.applied_at)}</p>
    </div>
    <StatusBadge status={application.status} />
  </div>
);

const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-700';
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};

export default DashboardContent;