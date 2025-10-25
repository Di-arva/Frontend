import { useState } from "react";
import { 
  Calendar, 
  Users, 
  Clock, 
  DollarSign, 
  Plus, 
  Check, 
  X, 
  Search,
  Bell,
  FileText,
  Download,
  ChevronDown,
  AlertCircle,
  Menu
} from "lucide-react";
import ClinicTasksList from "./ClinicTasksList";

const ClinicDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sideBarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  console.log("Current page:", currentPage); // Debug log

  // Sample data
  const stats = [
    { label: "Active Shifts", value: "12", icon: Calendar, color: "bg-blue-100 text-blue-600" },
    { label: "Pending Requests", value: "5", icon: Clock, color: "bg-yellow-100 text-yellow-600" },
    { label: "Staff This Week", value: "8", icon: Users, color: "bg-green-100 text-green-600" },
    { label: "Monthly Cost", value: "$12,450", icon: DollarSign, color: "bg-purple-100 text-purple-600" },
  ];

  const upcomingShifts = [
    { id: 1, role: "Dental Hygienist", date: "Oct 18, 2025", time: "9:00 AM - 5:00 PM", status: "confirmed", staff: "Sarah Johnson" },
    { id: 2, role: "Dental Assistant", date: "Oct 19, 2025", time: "8:00 AM - 4:00 PM", status: "confirmed", staff: "Mike Chen" },
    { id: 3, role: "Dental Hygienist", date: "Oct 20, 2025", time: "10:00 AM - 6:00 PM", status: "pending", staff: "Not assigned" },
  ];

  const pendingRequests = [
    { id: 1, role: "Dental Assistant", date: "Oct 22, 2025", time: "9:00 AM - 5:00 PM", applicants: 3, hourlyRate: "$35" },
    { id: 2, role: "Dental Hygienist", date: "Oct 23, 2025", time: "8:00 AM - 4:00 PM", applicants: 5, hourlyRate: "$45" },
    { id: 3, role: "Receptionist", date: "Oct 24, 2025", time: "9:00 AM - 5:00 PM", applicants: 2, hourlyRate: "$25" },
  ];

  const recentInvoices = [
    { id: "INV-2025-1012", date: "Oct 10, 2025", amount: "$1,280", status: "paid", period: "Week 40" },
    { id: "INV-2025-1005", date: "Oct 3, 2025", amount: "$1,560", status: "paid", period: "Week 39" },
    { id: "INV-2025-0928", date: "Sep 28, 2025", amount: "$980", status: "pending", period: "Week 38" },
  ];

  const [showShiftModal, setShowShiftModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newShift, setNewShift] = useState({
    title: "",
    description: "",
    role: "",
    date: "",
    startTime: "",
    endTime: "",
    breakDuration: 30,
    hourlyRate: "",
    certificationLevel: "",
    minimumExperience: "0",
    requiredSpecializations: [],
    preferredSkills: [],
    priority: "normal",
    paymentMethod: "E-transfer",
    paymentTerms: "Same Day",
    parkingInfo: "",
    specificInstructions: "",
    contactName: "",
    contactPhone: "",
    contactRole: "",
    maxApplications: 10,
    requiresBackgroundCheck: true,
    applicationDeadline: "",
  });

  const handleCreateShift = async () => {
    // Validate required fields
    if (!newShift.title || !newShift.description || !newShift.date || 
        !newShift.startTime || !newShift.endTime || !newShift.hourlyRate ||
        !newShift.certificationLevel) {
      alert("Please fill in all required fields marked with *");
      return;
    }

    setIsSubmitting(true);
    try {
      // Extract clinic_id from JWT token
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert("Authentication token not found. Please log in again.");
        setIsSubmitting(false);
        return;
      }

      // Construct the datetime strings (ISO format)
      const startDateTime = new Date(`${newShift.date}T${newShift.startTime}`).toISOString();
      const endDateTime = new Date(`${newShift.date}T${newShift.endTime}`).toISOString();
      const deadlineDateTime = newShift.applicationDeadline 
        ? new Date(`${newShift.applicationDeadline}T23:59:59`).toISOString()
        : new Date(`${newShift.date}T00:00:00`).toISOString();

      // Calculate duration in hours
      const start = new Date(`${newShift.date}T${newShift.startTime}`);
      const end = new Date(`${newShift.date}T${newShift.endTime}`);
      const durationMs = end - start;
      const durationHours = durationMs / (1000 * 60 * 60);

      if (durationHours <= 0 || durationHours > 12) {
        alert("Duration must be between 0.5 and 12 hours");
        setIsSubmitting(false);
        return;
      }

      // Build the payload according to schema
      const payload = {
        title: newShift.title.trim(),
        description: newShift.description.trim(),
        requirements: {
          certification_level: newShift.certificationLevel,
          minimum_experience: parseInt(newShift.minimumExperience) || 0,
        },
        schedule: {
          start_datetime: startDateTime,
          end_datetime: endDateTime,
          duration_hours: parseFloat(durationHours.toFixed(2)),
          break_duration_minutes: parseInt(newShift.breakDuration) || 30,
        },
        compensation: {
          hourly_rate: parseFloat(newShift.hourlyRate),
          currency: "CAD",
          payment_method: newShift.paymentMethod,
          payment_terms: newShift.paymentTerms,
        },
        priority: newShift.priority,
        max_applications: parseInt(newShift.maxApplications) || 10,
        requires_background_check: newShift.requiresBackgroundCheck,
        application_deadline: deadlineDateTime,
      };

      // Add optional arrays only if they have values
      if (newShift.requiredSpecializations.length > 0) {
        payload.requirements.required_specializations = newShift.requiredSpecializations;
      }
      
      if (newShift.preferredSkills.length > 0) {
        payload.requirements.preferred_skills = newShift.preferredSkills;
      }

      // Add location details only if at least one field is filled
      if (newShift.specificInstructions || newShift.parkingInfo || newShift.contactName) {
        payload.location_details = {};
        
        if (newShift.specificInstructions) {
          payload.location_details.specific_instructions = newShift.specificInstructions;
        }
        
        if (newShift.parkingInfo) {
          payload.location_details.parking_info = newShift.parkingInfo;
        }
        
        if (newShift.contactName) {
          payload.location_details.contact_person = {
            name: newShift.contactName,
          };
          
          if (newShift.contactPhone) {
            payload.location_details.contact_person.phone = newShift.contactPhone;
          }
          
          if (newShift.contactRole) {
            payload.location_details.contact_person.role = newShift.contactRole;
          }
        }
      }

      // Replace with your actual API base URL
      const apiBaseUrl = import.meta?.env?.VITE_SERVER_BASE_URL || 'http://localhost:1080';
      
      console.log("=== SENDING PAYLOAD ===");
      console.log(JSON.stringify(payload, null, 2));
      console.log("======================");
      console.log("Clinic ID extracted:", clinicId);
      console.log("Token:", token);
      
      const response = await fetch(`${apiBaseUrl}/api/v1/clinic/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error("=== API ERROR RESPONSE ===");
        console.error("Status:", response.status);
        console.error("Response:", JSON.stringify(result, null, 2));
        console.error("=========================");
        
        // Handle 401 specifically
        if (response.status === 401) {
          alert('Authentication failed. Please log in again.');
          // Optionally redirect to login
          // window.location.href = '/login';
          setIsSubmitting(false);
          return;
        }
        
        // Show detailed error message
        const errorMessage = result.message || result.error || 'Failed to create shift';
        const errorDetails = result.errors ? '\n\nDetails:\n' + JSON.stringify(result.errors, null, 2) : '';
        throw new Error(errorMessage + errorDetails);
      }

      console.log("=== SUCCESS ===");
      console.log(JSON.stringify(result, null, 2));
      console.log("===============");
      
      setShowShiftModal(false);
      setNewShift({
        title: "",
        description: "",
        role: "",
        date: "",
        startTime: "",
        endTime: "",
        breakDuration: 30,
        hourlyRate: "",
        certificationLevel: "",
        minimumExperience: "0",
        requiredSpecializations: [],
        preferredSkills: [],
        priority: "normal",
        paymentMethod: "E-transfer",
        paymentTerms: "Same Day",
        parkingInfo: "",
        specificInstructions: "",
        contactName: "",
        contactPhone: "",
        contactRole: "",
        maxApplications: 10,
        requiresBackgroundCheck: true,
        applicationDeadline: "",
      });
      
      alert("Shift posted successfully!");
    } catch (error) {
      console.error("=== CATCH ERROR ===");
      console.error(error);
      console.error("===================");
      alert(`Failed to create shift:\n\n${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${sideBarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            {!sideBarCollapsed && <h2 className="text-xl font-bold text-gray-800">Clinic Portal</h2>}
            <button onClick={() => setSidebarCollapsed(!sideBarCollapsed)} className="p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {['Dashboard', 'Shifts', 'Staff', 'Billing', 'Settings'].map((item) => (
                <button
                  key={item}
                  onClick={() => setCurrentPage(item.toLowerCase())}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.toLowerCase()
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {sideBarCollapsed ? item[0] : item}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  DC
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable dashboard content */}
        <main className="flex-1 overflow-auto p-8">
          {currentPage === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowShiftModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Post New Shift
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Users className="w-5 h-5" />
                    View All Staff
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <FileText className="w-5 h-5" />
                    Download Reports
                  </button>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Shifts */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Upcoming Shifts</h3>
                    <button className="text-blue-600 text-sm hover:underline">View All</button>
                  </div>
                  <div className="space-y-3">
                    {upcomingShifts.map((shift) => (
                      <div key={shift.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">{shift.role}</h4>
                            <p className="text-sm text-gray-600">{shift.staff}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            shift.status === "confirmed" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {shift.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {shift.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {shift.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Applications */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Pending Applications</h3>
                    <button className="text-blue-600 text-sm hover:underline">View All</button>
                  </div>
                  <div className="space-y-3">
                    {pendingRequests.map((req) => (
                      <div key={req.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-800">{req.role}</h4>
                            <p className="text-sm text-gray-600">{req.date} • {req.time}</p>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {req.applicants} applicants
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{req.hourlyRate}/hr</span>
                          <div className="flex gap-2">
                            <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                              <Check className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Invoices */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Invoices</h3>
                  <button className="text-blue-600 text-sm hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Invoice ID</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Period</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInvoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm font-medium text-gray-800">{invoice.id}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{invoice.period}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{invoice.date}</td>
                          <td className="py-4 px-4 text-sm font-semibold text-gray-800">{invoice.amount}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              invoice.status === "paid" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentPage === "shifts" && (
            <ClinicTasksList />
          )}

          {currentPage !== "dashboard" && currentPage !== "shifts" && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} Page
              </h3>
              <p className="text-gray-600">Content for {currentPage} will be displayed here</p>
            </div>
          )}

          {/* Create Shift Modal */}
          {showShiftModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-800">Post New Shift</h3>
                  <p className="text-gray-600 text-sm mt-1">Fill in the details to post a new shift opening</p>
                </div>
                
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                      <input
                        type="text"
                        value={newShift.title}
                        onChange={(e) => setNewShift({...newShift, title: e.target.value})}
                        placeholder="e.g., Emergency Dental Assistant Needed"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                      <textarea
                        value={newShift.description}
                        onChange={(e) => setNewShift({...newShift, description: e.target.value})}
                        rows={3}
                        placeholder="Describe the position and responsibilities..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                        <select
                          value={newShift.priority}
                          onChange={(e) => setNewShift({...newShift, priority: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Applications</label>
                        <input
                          type="number"
                          value={newShift.maxApplications}
                          onChange={(e) => setNewShift({...newShift, maxApplications: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Requirements</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Certification Level *</label>
                        <select
                          value={newShift.certificationLevel}
                          onChange={(e) => setNewShift({...newShift, certificationLevel: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select level</option>
                          <option value="Level_I">Level I</option>
                          <option value="Level_II">Level II</option>
                          <option value="RDA">RDA</option>
                          <option value="CDA">CDA</option>
                          <option value="PDA">PDA</option>
                          <option value="Any">Any</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Experience (years) *</label>
                        <input
                          type="number"
                          value={newShift.minimumExperience}
                          onChange={(e) => setNewShift({...newShift, minimumExperience: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Required Specializations (comma separated)</label>
                      <input
                        type="text"
                        value={newShift.requiredSpecializations.join(', ')}
                        onChange={(e) => setNewShift({...newShift, requiredSpecializations: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                        placeholder="e.g., Chairside Assisting, Infection Control"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Skills (comma separated)</label>
                      <input
                        type="text"
                        value={newShift.preferredSkills.join(', ')}
                        onChange={(e) => setNewShift({...newShift, preferredSkills: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                        placeholder="e.g., Patient communication, Digital X-rays"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newShift.requiresBackgroundCheck}
                        onChange={(e) => setNewShift({...newShift, requiresBackgroundCheck: e.target.checked})}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700">Requires Background Check</label>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Schedule</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                        <input
                          type="date"
                          value={newShift.date}
                          onChange={(e) => setNewShift({...newShift, date: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                        <input
                          type="date"
                          value={newShift.applicationDeadline}
                          onChange={(e) => setNewShift({...newShift, applicationDeadline: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                        <input
                          type="time"
                          value={newShift.startTime}
                          onChange={(e) => setNewShift({...newShift, startTime: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                        <input
                          type="time"
                          value={newShift.endTime}
                          onChange={(e) => setNewShift({...newShift, endTime: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Break (minutes)</label>
                        <input
                          type="number"
                          value={newShift.breakDuration}
                          onChange={(e) => setNewShift({...newShift, breakDuration: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Compensation */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Compensation</h4>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (CAD) *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newShift.hourlyRate}
                          onChange={(e) => setNewShift({...newShift, hourlyRate: e.target.value})}
                          placeholder="35.00"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                        <select
                          value={newShift.paymentMethod}
                          onChange={(e) => setNewShift({...newShift, paymentMethod: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="E-transfer">E-transfer</option>
                          <option value="Direct Deposit">Direct Deposit</option>
                          <option value="Cheque">Cheque</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms *</label>
                        <select
                          value={newShift.paymentTerms}
                          onChange={(e) => setNewShift({...newShift, paymentTerms: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Same Day">Same Day</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Bi-weekly">Bi-weekly</option>
                          <option value="Monthly">Monthly</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Location Details */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Location & Contact</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Parking Information</label>
                      <input
                        type="text"
                        value={newShift.parkingInfo}
                        onChange={(e) => setNewShift({...newShift, parkingInfo: e.target.value})}
                        placeholder="e.g., Free parking available"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specific Instructions</label>
                      <textarea
                        value={newShift.specificInstructions}
                        onChange={(e) => setNewShift({...newShift, specificInstructions: e.target.value})}
                        rows={2}
                        placeholder="e.g., Use rear entrance"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                        <input
                          type="text"
                          value={newShift.contactName}
                          onChange={(e) => setNewShift({...newShift, contactName: e.target.value})}
                          placeholder="Dr. Smith"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                        <input
                          type="tel"
                          value={newShift.contactPhone}
                          onChange={(e) => setNewShift({...newShift, contactPhone: e.target.value})}
                          placeholder="+1234567890"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Role</label>
                        <input
                          type="text"
                          value={newShift.contactRole}
                          onChange={(e) => setNewShift({...newShift, contactRole: e.target.value})}
                          placeholder="Clinic Manager"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    onClick={() => setShowShiftModal(false)}
                    disabled={isSubmitting}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateShift}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Posting...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Post Shift
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClinicDashboard;