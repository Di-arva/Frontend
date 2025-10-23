import { useState } from "react";
import Tasks from './Tasks';
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

const ClinicDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
  const [newShift, setNewShift] = useState({
    role: "",
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
  });

  const handleCreateShift = () => {
    console.log("Creating shift:", newShift);
    setShowShiftModal(false);
    setNewShift({ role: "", date: "", startTime: "", endTime: "", notes: "" });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-2xl font-bold">Di'arva</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4">
          {[
            { id: "dashboard", label: "Dashboard", icon: Calendar },
            { id: "shifts", label: "My Shifts", icon: Clock },
            { id: "requests", label: "Requests", icon: AlertCircle },
            { id: "invoices", label: "Invoices", icon: FileText },
            { id: "staff", label: "Staff", icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeTab === item.id ? "bg-blue-800" : "hover:bg-blue-800"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back, Highland Dental</h2>
            <p className="text-gray-600 text-sm">Manage your staff and shifts efficiently</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                HD
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === "dashboard" && (
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

{activeTab === "shifts" && (
  <Tasks apiBaseUrl={import.meta.env.VITE_SERVER_BASE_URL} />
)}

{activeTab !== "dashboard" && activeTab !== "shifts" && (
  <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Page
    </h3>
    <p className="text-gray-600">Content for {activeTab} will be displayed here</p>
  </div>
)}
        </main>
      </div>

      {/* Create Shift Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">Post New Shift</h3>
              <p className="text-gray-600 text-sm mt-1">Fill in the details to post a new shift opening</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={newShift.role}
                  onChange={(e) => setNewShift({...newShift, role: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a role</option>
                  <option value="Dental Hygienist">Dental Hygienist</option>
                  <option value="Dental Assistant">Dental Assistant</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Dental Therapist">Dental Therapist</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newShift.date}
                  onChange={(e) => setNewShift({...newShift, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={newShift.startTime}
                    onChange={(e) => setNewShift({...newShift, startTime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={newShift.endTime}
                    onChange={(e) => setNewShift({...newShift, endTime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  value={newShift.notes}
                  onChange={(e) => setNewShift({...newShift, notes: e.target.value})}
                  rows={3}
                  placeholder="Any special requirements or notes..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowShiftModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateShift}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Post Shift
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicDashboard;