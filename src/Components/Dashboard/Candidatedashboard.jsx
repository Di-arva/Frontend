import Calendar from './Calendar';
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState, useEffect } from 'react';
import AvailableShifts from '../AvailableShifts';
import { useNavigate } from 'react-router-dom';

const Candidatedashboard = () => {
  const [sideBarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [availableShifts, setAvailableShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    certification_level: '',
    specialization: '',
    start_from: '',
    start_to: '',
    page: 1,
    limit: 20
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
    
    console.log('🔐 Dashboard - Token exists:', !!token);
    console.log('🔐 Dashboard - User role:', userRole);
    
    if (!token) {
      console.log('❌ No token, redirecting to login');
      navigate('/login');
      return;
    }

    // Check if user has appropriate role
    if (userRole !== 'assistant' && userRole !== 'candidate') {
      console.log('❌ Invalid role for candidate dashboard:', userRole);
      // You might want to redirect to a different dashboard or show error
    }
  };

  // Fetch available shifts when component mounts or filters change
  useEffect(() => {
    if (filters) {
      fetchAvailableShifts();
    }
  }, [filters]);

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

      console.log('📥 Shifts response status:', response.status);

      if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch available shifts: ${response.status}`);
      }

      const result = await response.json();
      console.log('📥 Shifts response data:', result);
      
      if (result.success) {
        setAvailableShifts(result.data || []);
        console.log('✅ Shifts loaded:', result.data?.length || 0);
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

  const handleApplyToShift = async (shiftId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const url = `${API_BASE_URL}applications/tasks/${shiftId}/apply`;
      console.log('🔄 Applying to shift:', url);

      const response = await fetch(url, {
        method: 'POST',
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
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to apply to shift: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Refresh the shifts list to update application status
        fetchAvailableShifts();
        alert('Successfully applied to shift!');
      } else {
        throw new Error(result.message || 'Failed to apply to shift');
      }
    } catch (err) {
      alert(`Error applying to shift: ${err.message}`);
      console.error('Error applying to shift:', err);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };


  // Candidate/Assistant user data
  const candidateUser = {
    name: "Candidate Name", // You can get this from your user data
    role: "assistant", // or "candidate"
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
  };
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={sideBarCollapsed}
        onToggle={() => setSidebarCollapsed(!sideBarCollapsed)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
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
        <main className="flex-1 overflow-auto p-6 space-y-6">
          {/* Available Shifts Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Shifts</h2>
            
            {/* Available Shifts Component */}
            <AvailableShifts
              shifts={availableShifts}
              loading={loading}
              error={error}
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={handleApplyToShift}
              onPageChange={handlePageChange}
              onRefresh={fetchAvailableShifts}
            />
          </div>

          {/* Calendar Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Schedule Calendar</h2>
            <Calendar />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Candidatedashboard;