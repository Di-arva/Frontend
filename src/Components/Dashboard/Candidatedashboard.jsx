import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { candidateMenuItems } from './Config/MenuItems';
import Sidebar from "./Sidebar";
import Header from "./Header";
import Calendar from './Calendar';
import MyApplicationsContent from "../Dashboard/MyApplicationsContent"
import AvailableShiftsContent from '../Dashboard/CandidateDashboard/AvailableShiftsContent';
import DashboardContent from '../Dashboard/CandidateDashboard/DashboardContent';
import ShiftDetailsModal from '../Dashboard/CandidateDashboard/ShiftDetailsModal';
import { Loader} from 'lucide-react';
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
  const [myApplications, setMyApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
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
  const location = useLocation();
  const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

  // Add this missing variable
  const candidateMenuItemsWithRouting = candidateMenuItems.map(item => ({
    ...item,
    onClick: () => navigate(item.path)
  }));

  // Candidate user data
  const candidateUser = {
    name: "Candidate Name",
    role: "assistant",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
  };

  const currentPage = getCurrentPage(location.pathname);

  // Effects
  useEffect(() => {
    checkAuthentication();
    
    if (currentPage === 'dashboard' || currentPage === 'available-shifts') {
      fetchAvailableShifts();
    }
    fetchMyApplications();
  }, [currentPage]);



  const checkAuthentication = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
  };
  const fetchAvailableShifts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
  
      const url = `${API_BASE_URL}applications/tasks?${queryParams}`;
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
      console.log('API Response:', result); // Debug log
      
      if (result.success) {
        // FIX: Set the data array directly to availableShifts
        setAvailableShifts(result.data || []);
        setPagination({
          page: result.page || 1,
          limit: result.limit || 10,
          total: result.total || 0,
          pages: result.pages || 0
        });
      } else {
        setAvailableShifts([]);
        throw new Error(result.message || 'Failed to fetch shifts');
      }
    } catch (err) {
      console.error('Error fetching shifts:', err);
      setError(err.message);
      setAvailableShifts([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      setApplicationsLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
  
      const url = `${API_BASE_URL}applications/my-applications`;
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
      
      if (result.success) {
        setMyApplications(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch applications');
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setApplicationsLoading(false);
    }
  };
  
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
        setMyApplications(prev => prev.filter(app => app._id !== applicationId));
        alert('Application withdrawn successfully');
        fetchAvailableShifts();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to withdraw application');
      }
    } catch (err) {
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

    // FIX: Correct API endpoint - should include shiftId in the URL
    const url = `${API_BASE_URL}applications/tasks/${shiftId}/apply`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
      // Remove the empty body since it's causing issues
    });

    if (response.ok) {
      const result = await response.json();
      
      if (result.success) {
        // Update the shifts to mark as applied
        setAvailableShifts(prevShifts => 
          prevShifts.map(shift => 
            shift._id === shiftId 
              ? { 
                  ...shift, 
                  has_applied: true,
                  applications_count: (shift.applications_count || 0) + 1
                }
              : shift
          )
        );
        
        if (selectedShift && selectedShift._id === shiftId) {
          setSelectedShift(prev => ({
            ...prev,
            has_applied: true,
            applications_count: (prev.applications_count || 0) + 1
          }));
        }
        
        setApplySuccess(true);
        setTimeout(() => setApplySuccess(false), 3000);
        fetchMyApplications(); // Refresh applications list
        alert(`✅ Successfully applied to shift!`);
      } else {
        throw new Error(result.message || 'Application failed');
      }
    } else if (response.status === 409) {
      // Already applied
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
      
      alert('❌ You have already applied to this shift.');
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || `Application failed: ${response.status}`);
    }

  } catch (err) {
    console.error('Error applying to shift:', err);
    alert(`❌ Error applying to shift: ${err.message}`);
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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
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

  const renderDashboardContent = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <DashboardContent
            myApplications={myApplications}
            navigate={navigate}
            formatDate={formatDate}
          />
        );

        case "available-shifts":
          return (   <AvailableShiftsContent
          availableShifts={availableShifts}
          loading={loading}
          error={error}
          pagination={pagination}
          filters={filters}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
          onApplyToShift={handleApplyToShift}
          applyLoading={applyLoading}
          applySuccess={applySuccess}
          onViewDetails={fetchShiftDetails}
          formatDate={formatDate}
          getStatusBadge={getStatusBadge}
        />
        )


      case "my-applications":
        return (
          <MyApplicationsContent 
            applications={myApplications}
            loading={applicationsLoading}
            onRefresh={fetchMyApplications}
            onWithdraw={handleWithdrawApplication}
            onViewDetails={fetchShiftDetails}
          />
        );

      case "calendar":
      case "schedule":
        return <ScheduleContent currentPage={currentPage} />;

      case "profile":
        return <ProfileContent candidateUser={candidateUser} />;

      default:
        return <DefaultContent currentPage={currentPage} />;
    }
  };

  if (loading && currentPage === 'available-shifts' && availableShifts.length === 0) {
    return (
      <div className="h-screen flex overflow-hidden">
        <Sidebar
          collapsed={sideBarCollapsed}
          onToggle={() => setSidebarCollapsed(!sideBarCollapsed)}
          menuItems={candidateMenuItemsWithRouting}
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
      <Sidebar
        collapsed={sideBarCollapsed}
        onToggle={() => setSidebarCollapsed(!sideBarCollapsed)}
        menuItems={candidateMenuItemsWithRouting}
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

        <main className="flex-1 overflow-auto p-6 bg-lightblue font-poppins">
          {renderDashboardContent()}
        </main>
      </div>

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

// Create the missing components
const ScheduleContent = ({ currentPage }) => (
  <div className="bg-white rounded-3xl shadow-md p-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">
      {currentPage === 'schedule' ? 'My Schedule' : 'Schedule Calendar'}
    </h2>
    <Calendar />
  </div>
);

const ProfileContent = ({ candidateUser }) => (
  <div className="bg-white rounded-3xl shadow-md p-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">My Profile</h2>
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <img 
          src={candidateUser.avatar} 
          alt="Profile" 
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{candidateUser.name}</h3>
          <p className="text-gray-600">Dental Assistant</p>
          <p className="text-sm text-gray-500">Level II Certified</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Personal Information</h4>
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-800">candidate@example.com</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-gray-800">+1 (555) 123-4567</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Location</label>
              <p className="text-gray-800">Toronto, ON</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Professional Details</h4>
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium text-gray-600">Certification Level</label>
              <p className="text-gray-800">Level II</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Experience</label>
              <p className="text-gray-800">3 years</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Specializations</label>
              <p className="text-gray-800">Pediatric Dentistry, Orthodontics</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button variant="dark" size="sm">
          Edit Profile
        </Button>
        <Button variant="light" size="sm">
          Change Password
        </Button>
      </div>
    </div>
  </div>
);

const DefaultContent = ({ currentPage }) => (
  <div className="bg-white rounded-3xl shadow-md p-8 text-center">
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} Page
    </h3>
    <p className="text-gray-600">
      Content for {currentPage} will be displayed here
    </p>
  </div>
);

// Helper function
const getCurrentPage = (pathname) => {
  const path = pathname;
  if (path === "/candidate" || path === "/candidate/dashboard") return "dashboard";
  if (path === "/candidate/shifts") return "available-shifts";
  if (path === "/candidate/my-applications") return "my-applications";
  if (path === "/candidate/calendar") return "calendar";
  if (path === "/candidate/schedule") return "schedule";
  if (path === "/candidate/profile") return "profile";
  return "dashboard";
};

export default Candidatedashboard;