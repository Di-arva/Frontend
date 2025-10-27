import Calendar from './Calendar';
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateMenuItems } from './Config/MenuItems';
import MyApplicationsContent from "./MyApplicationsContent"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  DollarSign, 
  Users, 
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ChevronDown,
  X,
  Loader,
  MapPin,
  Briefcase,
  CheckCircle
} from 'lucide-react';
import Button from '../Button';

const Candidatedashboard = () => {
  const [sideBarCollapsed, setSidebarCollapsed] = useState(false);
  const [availableShifts, setAvailableShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [myApplications, setMyApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('available');
  const [filters, setFilters] = useState({
    certification_level: '',
    specialization: '',
    start_from: '',
    start_to: '',
    sort_by: 'schedule.start_datetime',
    sort_dir: 'asc',
    page: 1,
    limit: 10
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:1080/api/v1/';

  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    if (!token) {
      navigate('/login');
      return;
    }

    if (userRole !== 'assistant' && userRole !== 'candidate') {
      console.log('❌ Invalid role for candidate dashboard:', userRole);
    }
  };

  // Fetch available shifts when component mounts or filters change
  useEffect(() => {
    fetchAvailableShifts();
  }, [filters.page, filters]);

  const fetchAvailableShifts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });

      const url = `${API_BASE_URL}applications/tasks?${queryParams}`;
      console.log('🔄 Fetching shifts from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch available shifts: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setAvailableShifts(result.data || []);
        setPagination({
          page: result.page || 1,
          limit: result.limit || 10,
          total: result.total || 0,
          pages: result.pages || 0
        });
      } else {
        throw new Error(result.message || 'Failed to fetch shifts');
      }
    } catch (err) {
      console.error('❌ Error fetching shifts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  //function to fetch applications
  const fetchMyApplications = async () => {
    try {
      setApplicationsLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
  
      const url = `${API_BASE_URL}applications/my-applications`;
      console.log('🔄 Fetching my applications:', url);
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
        return;
      }
  
      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('✅ Applications loaded:', result);
      
      if (result.success) {
        setMyApplications(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch applications');
      }
    } catch (err) {
      console.error('❌ Error fetching applications:', err);
      // Don't set general error state to avoid breaking the available shifts tab
    } finally {
      setApplicationsLoading(false);
    }
  };
  
  // Add withdraw function
  const handleWithdrawApplication = async (applicationId) => {
    if (!confirm('Are you sure you want to withdraw this application?')) {
      return;
    }
  
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
  
      const url = `${API_BASE_URL}applications/${applicationId}/withdraw`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        const result = await response.json();
        // Remove the application from the list
        setMyApplications(prev => prev.filter(app => app._id !== applicationId));
        alert('Application withdrawn successfully');
        
        // Refresh available shifts count
        fetchAvailableShifts();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to withdraw application');
      }
    } catch (err) {
      console.error('Error withdrawing application:', err);
      alert(`Error: ${err.message}`);
    }
  };
  const fetchShiftDetails = async (shiftId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const url = `${API_BASE_URL}applications/tasks/${shiftId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch shift details');
      }

      const result = await response.json();
      if (result.success) {
        setSelectedShift(result.data);
        setShowShiftModal(true);
      } else {
        throw new Error(result.message || 'Failed to fetch shift details');
      }
    } catch (err) {
      console.error('Error fetching shift details:', err);
      alert(`Error: ${err.message}`);
    }
  };
 
  const handleApplyToShift = async (shiftId) => {
    try {
      setApplyLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
  
      // Get user ID from token
      let userId;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.userId || payload.id || payload.sub;
        console.log('👤 User ID from token:', userId);
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError);
        throw new Error('Unable to verify your user account. Please log in again.');
      }
  
      if (!userId) {
        throw new Error('User ID not found in authentication token.');
      }
  
      const url = `${API_BASE_URL}applications/tasks/${shiftId}/apply`;
      console.log('🔄 Applying to shift:', url);
  
      // ✅ Send minimal data - backend handles the rest
      const requestBody = {}; // No need to send anything, backend handles it
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
  
      console.log('📨 Response status:', response.status);
  
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Success:', result);
        
        if (result.success) {
          // Update the shift to show as applied
          setAvailableShifts(prevShifts => 
            prevShifts.map(shift => 
              shift._id === shiftId 
                ? { 
                    ...shift, 
                    has_applied: true,
                    application_id: result.data?.application_id,
                    applications_count: (shift.applications_count || 0) + 1
                  }
                : shift
            )
          );
          
          // Update selected shift if modal is open
          if (selectedShift && selectedShift._id === shiftId) {
            setSelectedShift(prev => ({
              ...prev,
              has_applied: true,
              application_id: result.data?.application_id,
              applications_count: (prev.applications_count || 0) + 1
            }));
          }
          
          setApplySuccess(true);
          setTimeout(() => setApplySuccess(false), 3000);
          alert(`✅ Successfully applied to shift! Application ID: ${result.data?.application_id}`);
        } else {
          throw new Error(result.message || 'Application failed');
        }
      } else if (response.status === 409) {
        // Handle duplicate application
        const errorData = await response.json();
        console.log('⚠️ User already applied to this shift');
        
        // Update UI to show as applied
        setAvailableShifts(prevShifts => 
          prevShifts.map(shift => 
            shift._id === shiftId 
              ? { ...shift, has_applied: true }
              : shift
          )
        );
        
        if (selectedShift && selectedShift._id === shiftId) {
          setSelectedShift(prev => ({ ...prev, has_applied: true }));
        }
        
        throw new Error('You have already applied to this shift.');
      } else {
        const errorText = await response.text();
        throw new Error(`Application failed: ${response.status} - ${errorText}`);
      }
  
    } catch (err) {
      console.error('❌ Error applying to shift:', err);
      
      if (err.message.includes('already applied')) {
        alert('❌ You have already applied to this shift.');
      } else {
        alert(`❌ Error applying to shift: ${err.message}`);
      }
    } finally {
      setApplyLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const resetFilters = () => {
    setFilters({
      certification_level: '',
      specialization: '',
      start_from: '',
      start_to: '',
      sort_by: 'schedule.start_datetime',
      sort_dir: 'asc',
      page: 1,
      limit: 10
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  //function to check if user has applied to a shift

const checkIfUserApplied = (shiftId) => {
  // First check if the shift itself has has_applied flag
  const shift = availableShifts.find(s => s._id === shiftId);
  if (shift?.has_applied) return true;
  
  // Then check myApplications
  return myApplications.some(app => app.task_id?._id === shiftId);
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

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-green-100 text-green-700 border border-green-200',
      assigned: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      in_progress: 'bg-blue-100 text-blue-700 border border-blue-200',
      completed: 'bg-gray-100 text-gray-700 border border-gray-200',
      cancelled: 'bg-red-100 text-red-700 border border-red-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-700 border border-gray-200';
  };

  // Active filters count for badge
  const activeFiltersCount = [
    filters.certification_level,
    filters.specialization,
    filters.start_from,
    filters.start_to,
  ].filter(Boolean).length;

  // Candidate/Assistant user data
  const candidateUser = {
    name: "Candidate Name",
    role: "assistant",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
  };

  if (loading && availableShifts.length === 0) {
    return (
      <div className="h-screen flex overflow-hidden">
        <Sidebar
          collapsed={sideBarCollapsed}
          onToggle={() => setSidebarCollapsed(!sideBarCollapsed)}
          menuItems={candidateMenuItems}
          user={candidateUser}
          portalName="Candidate Portal"
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            sideBarCollapsed={sideBarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sideBarCollapsed)}
            onLogout={handleLogout}
            user={candidateUser}
            showSearch={true}
            variant="candidate"
          />
          <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
            <Loader className="w-8 h-8 text-darkblue animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={sideBarCollapsed}
        onToggle={() => setSidebarCollapsed(!sideBarCollapsed)}
        menuItems={candidateMenuItems}
        user={candidateUser}
        portalName="Candidate Portal"
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          sideBarCollapsed={sideBarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sideBarCollapsed)}
          onLogout={handleLogout}
          user={candidateUser}
          showSearch={true}
          variant="candidate"
        />

        {/* Scrollable dashboard content */}
        <main className="flex-1 overflow-auto p-6 space-y-6 bg-lightblue font-poppins">
          {/* Success Message */}
          {applySuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-green-800">Application Submitted!</h4>
                <p className="text-green-700 text-sm">Your shift application has been successfully submitted.</p>
              </div>
            </div>
          )}

          {/* Available Shifts Section */}
      {/* Available Shifts & Applications Section */}
<div className="bg-white rounded-3xl shadow-md p-6">
  {/* Tab Navigation */}
  <div className="flex border-b border-gray-200 mb-6">
    <button
      onClick={() => setActiveTab('available')}
      className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
        activeTab === 'available'
          ? 'border-darkblue text-darkblue'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      Available Shifts
      <span className="ml-2 bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-1">
        {pagination.total}
      </span>
    </button>
    <button
      onClick={() => {
        setActiveTab('myApplications');
        fetchMyApplications();
      }}
      className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
        activeTab === 'myApplications'
          ? 'border-darkblue text-darkblue'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      My Applications
      <span className="ml-2 bg-darkblue text-white text-xs rounded-full px-2 py-1">
        {myApplications.length}
      </span>
    </button>
  </div>

  {/* Tab Content */}
  {activeTab === 'available' ? (
    <div>
      {/* Move all your existing Available Shifts content here */}
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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800">Error</h4>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-lightbg rounded-3xl p-6 shadow-sm border border-darkblue/20 mb-6">
          {/* ... your existing filters content ... */}
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-darkblue">Filter Shifts</h4>
            <div className="flex items-center gap-3">
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-darkblue hover:underline font-medium cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-darkblue transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-darkblue hover:text-lightbg" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Certification Level Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-darkblue mb-2">
                Certification Level
              </label>
              <select
                value={filters.certification_level}
                onChange={(e) => handleFilterChange('certification_level', e.target.value)}
                className="appearance-none w-full px-4 py-2 bg-white border border-darkblue/30 rounded-full text-darkblack focus:outline-none focus:ring-2 focus:ring-darkblue focus:border-transparent transition-all"
              >
                <option value="">All Levels</option>
                <option value="Level_I">Level I</option>
                <option value="Level_II">Level II</option>
                <option value="HARP">HARP</option>
              </select>
              <ChevronDown className="absolute right-3 top-10 w-5 h-5 text-darkblue pointer-events-none" />
            </div>

            {/* Start Date From */}
            <div>
              <label className="block text-sm font-medium text-darkblue mb-2">
                Start From
              </label>
              <input
                type="date"
                value={filters.start_from}
                onChange={(e) => handleFilterChange('start_from', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-darkblue/30 rounded-full text-darkblack focus:outline-none focus:ring-2 focus:ring-darkblue focus:border-transparent transition-all"
              />
            </div>

            {/* Start Date To */}
            <div>
              <label className="block text-sm font-medium text-darkblue mb-2">
                Start To
              </label>
              <input
                type="date"
                value={filters.start_to}
                onChange={(e) => handleFilterChange('start_to', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-darkblue/30 rounded-full text-darkblack focus:outline-none focus:ring-2 focus:ring-darkblue focus:border-transparent transition-all"
              />
            </div>

            {/* Sort By */}
            <div className="relative">
              <label className="block text-sm font-medium text-darkblue mb-2">
                Sort By
              </label>
              <select
                value={filters.sort_by}
                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                className="w-full appearance-none px-4 py-2 bg-white border border-darkblue/30 rounded-full text-darkblack focus:outline-none focus:ring-2 focus:ring-darkblue focus:border-transparent transition-all"
              >
                <option value="schedule.start_datetime">Start Date</option>
                <option value="compensation.hourly_rate">Hourly Rate</option>
                <option value="posted_at">Date Posted</option>
              </select>
              <ChevronDown className="absolute right-3 top-10 w-5 h-5 text-darkblue pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-darkblue/20 mt-6">
            <span className="text-sm text-darkblue">
              {activeFiltersCount} Active Filter{activeFiltersCount !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={resetFilters}
                className="px-6 py-2 border border-darkblue text-darkblue rounded-full hover:bg-darkblue hover:text-white transition-all duration-200"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-6 py-2 bg-darkblue text-white rounded-full hover:bg-darkblue/90 transition-all duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <span className="text-sm text-darkblue font-medium">Active filters:</span>
          {filters.certification_level && (
            <span className="px-3 py-1 bg-darkblue text-white rounded-full text-xs font-medium">
              Cert: {filters.certification_level}
              <button
                onClick={() => handleFilterChange('certification_level', '')}
                className="ml-2 hover:text-red-200"
              >
                ×
              </button>
            </span>
          )}
          {filters.start_from && (
            <span className="px-3 py-1 bg-darkblue text-white rounded-full text-xs font-medium">
              From: {filters.start_from}
              <button
                onClick={() => handleFilterChange('start_from', '')}
                className="ml-2 hover:text-red-200"
              >
                ×
              </button>
            </span>
          )}
          {filters.start_to && (
            <span className="px-3 py-1 bg-darkblue text-white rounded-full text-xs font-medium">
              To: {filters.start_to}
              <button
                onClick={() => handleFilterChange('start_to', '')}
                className="ml-2 hover:text-red-200"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Shifts List */}
      <div className="space-y-4">
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
          availableShifts.map((shift) => (
            <div
              key={shift._id}
              className="bg-lightbg rounded-3xl p-6 shadow-sm border border-darkblue/20 hover:shadow-md transition-all duration-300 hover:border-darkblue/40"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-normal text-darkblack mb-2">
                    {shift.title}
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                        shift.status
                      )}`}
                    >
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
                  <span>
                    {shift.applications_count || 0} applicants
                  </span>
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
                    onClick={() => fetchShiftDetails(shift._id)}
                    variant="light"
                    size="sm"
                    className="rounded-full transition-all duration-200 hover:scale-105"
                  >
                    View Details
                  </Button>
{/* In ShiftDetailsModal - Action Buttons section */}
<Button
  variant="dark"
  size="lg"
  onClick={() => onApply(shift._id)}
  disabled={applyLoading || shift.has_applied}
  className="flex-1 flex items-center justify-center gap-2"
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
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-lightblue mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-darkblack">
              Page {pagination.page} of {pagination.pages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 border border-darkblue/30 rounded-full hover:bg-darkblue hover:text-white disabled:opacity-50 transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 border border-darkblue/30 rounded-full hover:bg-darkblue hover:text-white disabled:opacity-50 transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <MyApplicationsContent 
      applications={myApplications}
      loading={applicationsLoading}
      onRefresh={fetchMyApplications}
      onWithdraw={handleWithdrawApplication}
      onViewDetails={fetchShiftDetails}
    />
  )}
</div>

          {/* Calendar Section */}
          <div className="bg-white rounded-3xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Schedule Calendar</h2>
            <Calendar />
          </div>
        </main>
      </div>

      {/* Shift Details Modal */}
      {showShiftModal && selectedShift && (
        <ShiftDetailsModal
          shift={selectedShift}
          onClose={() => {
            setShowShiftModal(false);
            setSelectedShift(null);
          }}
          onApply={handleApplyToShift}
          applyLoading={applyLoading}
          formatDate={formatDate}
          formatTime={formatTime}
          getStatusBadge={getStatusBadge}
        />
      )}
    </div>
  );
};

// Shift Details Modal Component
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
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-700 font-medium">
                  <CalendarIcon className="w-5 h-5" />
                  Date
                </div>
                <div className="text-gray-800 font-medium text-lg mt-2">
                  {formatDate(shift.schedule?.start_datetime)}
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-700 font-medium">
                  <Clock className="w-5 h-5" />
                  Duration
                </div>
                <div className="text-gray-800 font-medium text-lg mt-2">
                  {shift.schedule?.duration_hours} hours
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-700 font-medium">
                  <Clock className="w-5 h-5" />
                  Start Time
                </div>
                <div className="text-gray-800 font-medium text-lg mt-2">
                  {formatTime(shift.schedule?.start_datetime)}
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-700 font-medium">
                  <Clock className="w-5 h-5" />
                  End Time
                </div>
                <div className="text-gray-800 font-medium text-lg mt-2">
                  {formatTime(shift.schedule?.end_datetime)}
                </div>
              </div>
            </div>
          </div>

          {/* Compensation */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Compensation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-700 font-medium">
                  <DollarSign className="w-5 h-5" />
                  Hourly Rate
                </div>
                <div className="text-gray-800 font-medium text-2xl mt-2">
                  ${shift.compensation?.hourly_rate} {shift.compensation?.currency}
                </div>
              </div>
              {shift.compensation?.total_amount && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-700 font-medium">
                    <DollarSign className="w-5 h-5" />
                    Total Amount
                  </div>
                  <div className="text-gray-800 font-medium text-2xl mt-2">
                    ${shift.compensation.total_amount} {shift.compensation.currency}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Requirements */}
          {shift.requirements && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">Requirements</h4>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="space-y-3">
                  {shift.requirements.certification_level && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-700" />
                      <span className="text-gray-700">
                        Certification: {shift.requirements.certification_level.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                  {shift.requirements.minimum_experience && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-700" />
                      <span className="text-gray-700">
                        Minimum Experience: {shift.requirements.minimum_experience} years
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Applications */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Applications</h4>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-700 font-medium">
                <Users className="w-5 h-5" />
                Total Applicants
              </div>
              <div className="text-gray-800 font-medium text-2xl mt-2">
                {shift.applications_count || 0}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
              onClick={() => onApply(shift._id)}
              disabled={applyLoading || shift.has_applied}
              className="flex-1 flex items-center justify-center gap-2"
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
    </div>
  );
};

export default Candidatedashboard;