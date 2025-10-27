import { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  XCircle,
  Loader,
  AlertCircle
} from 'lucide-react';
import Button from '../../Button';

const AppliedCandidatesModal = ({ taskId, onClose }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:1080/api/v1/';

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      const url = `${API_BASE_URL}clinic/tasks/${taskId}/applications`;
      console.log('🔄 Fetching applications:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        setError('Authentication failed. Please log in again.');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setApplications(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch applications');
      }
    } catch (err) {
      console.error('❌ Error fetching applications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptApplication = async (applicationId) => {
    if (!confirm('Are you sure you want to accept this candidate?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Authentication token not found');
        return;
      }

      const url = `${API_BASE_URL}applications/${applicationId}/accept`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        alert('Candidate accepted successfully!');
        // Refresh the applications list
        fetchApplications();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to accept application');
      }
    } catch (err) {
      console.error('Error accepting application:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleRejectApplication = async (applicationId) => {
    if (!confirm('Are you sure you want to reject this candidate?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Authentication token not found');
        return;
      }

      const url = `${API_BASE_URL}applications/${applicationId}/reject`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        alert('Candidate rejected successfully!');
        // Refresh the applications list
        fetchApplications();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject application');
      }
    } catch (err) {
      console.error('Error rejecting application:', err);
      alert(`Error: ${err.message}`);
    }
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  useEffect(() => {
    if (taskId) {
      fetchApplications();
    }
  }, [taskId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Applied Candidates</h3>
            <p className="text-gray-600 mt-1">
              View and manage applications for this shift
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="w-8 h-8 text-darkblue animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800">Error</h4>
                <p className="text-red-700 text-sm">{error}</p>
                <button
                  onClick={fetchApplications}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-600">
                No candidates have applied to this shift yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application._id}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {application.applicant_id?.first_name} {application.applicant_id?.last_name}
                      </h4>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                            application.status
                          )}`}
                        >
                          {application.status.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-gray-600">
                          Applied: {formatDate(application.applied_at)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {application.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleAcceptApplication(application._id)}
                            variant="dark"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleRejectApplication(application._id)}
                            variant="light"
                            size="sm"
                            className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </Button>
                        </>
                      )}
                      {application.status === 'accepted' && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Accepted
                        </span>
                      )}
                      {application.status === 'rejected' && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Candidate Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{application.applicant_id?.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{application.applicant_id?.mobile || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {application.application_message && (
                        <div>
                          <p className="font-medium text-gray-700 mb-1">Application Message:</p>
                          <p className="text-gray-600 bg-white p-3 rounded-lg border">
                            {application.application_message}
                          </p>
                        </div>
                      )}
                      {application.proposed_rate && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="font-medium">Proposed Rate:</span>
                          <span>${application.proposed_rate}/hr</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Match Criteria (if available) */}
                  {application.match_criteria && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="font-medium text-gray-700 mb-2">Match Score</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {application.match_criteria.location_score && (
                          <div className="text-center">
                            <p className="text-gray-600">Location</p>
                            <p className="font-semibold text-darkblue">
                              {application.match_criteria.location_score}%
                            </p>
                          </div>
                        )}
                        {application.match_criteria.experience_score && (
                          <div className="text-center">
                            <p className="text-gray-600">Experience</p>
                            <p className="font-semibold text-darkblue">
                              {application.match_criteria.experience_score}%
                            </p>
                          </div>
                        )}
                        {application.match_criteria.certification_score && (
                          <div className="text-center">
                            <p className="text-gray-600">Certification</p>
                            <p className="font-semibold text-darkblue">
                              {application.match_criteria.certification_score}%
                            </p>
                          </div>
                        )}
                        {application.auto_match_score && (
                          <div className="text-center">
                            <p className="text-gray-600">Overall</p>
                            <p className="font-semibold text-darkblue">
                              {application.auto_match_score}%
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <Button
            variant="light"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppliedCandidatesModal;