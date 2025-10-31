import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit3,
  Loader2,
  X,
} from "lucide-react";
import Button from "../../Button";
import { useNavigate } from "react-router-dom";

const Clinics = () => {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get token from localStorage
      const token = localStorage.getItem("accessToken") || 
                    localStorage.getItem("token") ||
                    localStorage.getItem("authToken");
      
      if (!token) {
        console.error("No authentication token found");
        navigate("/login");
        return;
      }
      
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };
      
      const response = await fetch(`${BASE_URL}admin/users`, {
        method: "GET",
        credentials: "include",
        headers: headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned HTML instead of JSON. Check your API endpoint.");
      }

      const data = await response.json();
      
      // Backend returns { success: true, data: [...users] }
      const users = data.data || data.users || data;
      
      // Filter only clinic role users
      const clinicUsers = users.filter(user => 
        user.role?.toLowerCase() === "clinic" || 
        user.role?.toLowerCase() === "clinic_admin"
      );
      
      setClinics(clinicUsers);
      setFilteredClinics(clinicUsers);
      setError(null);
    } catch (err) {
      console.error("Error fetching clinics:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter clinics based on search and status
  useEffect(() => {
    let filtered = [...clinics];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(clinic => 
        clinic.clinic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.address?.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        clinic => clinic.approval_status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredClinics(filtered);
  }, [searchTerm, statusFilter, clinics]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const hasActiveFilters = searchTerm || statusFilter !== "all";

  const handleViewClinic = (clinicId) => {
    navigate(`/admin/clinics/${clinicId}`);
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-green-100 text-green-700",
      active: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      rejected: "bg-red-100 text-red-700",
      inactive: "bg-red-100 text-red-700",
    };
    return styles[status?.toLowerCase()] || "bg-gray-100 text-gray-700";
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "approved" || statusLower === "active") {
      return CheckCircle;
    } else if (statusLower === "pending") {
      return Clock;
    } else if (statusLower === "rejected" || statusLower === "inactive") {
      return XCircle;
    }
    return Clock;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get unique statuses from data
  const getUniqueStatuses = () => {
    const statuses = clinics.map((c) => c.approval_status).filter(Boolean);
    return [...new Set(statuses)];
  };

  const getAvatarUrl = (clinic) => {
    if (clinic.avatar || clinic.profileImage) {
      return clinic.avatar || clinic.profileImage;
    }
    const seed = clinic.clinic_name || clinic.first_name || clinic.email || clinic.id;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-darkblue animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-600 mb-4">Error loading clinics</div>
        <p className="text-red-700 mb-4">{error}</p>
        <Button onClick={fetchUsers} variant="dark">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-lightblue rounded-3xl min-h-screen font-poppins">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-normal text-darkblack mb-2">
            Clinics Management
          </h3>
          <p className="text-darkblack/70">
            Manage all registered dental clinics ({clinics.length} total)
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="dark"
            onClick={fetchUsers}
            className="flex items-center gap-2"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-lightbg rounded-2xl p-6 border border-darkblue/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-darkblue" />
              <input
                type="text"
                placeholder="Search clinics by name, email, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-darkblue/30 rounded-xl text-darkblack focus:outline-none focus:ring-2 focus:ring-darkblue focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-darkblue/30 rounded-xl text-darkblack focus:outline-none focus:ring-2 focus:ring-darkblue focus:border-transparent transition-all"
            >
              <option value="all">All Status</option>
              {getUniqueStatuses().map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Clinics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClinics.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-darkblue/20">
            <Building2 className="w-12 h-12 text-darkblue/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-darkblack mb-2">
              {clinics.length === 0 ? "No clinics found" : "No matching clinics"}
            </h3>
            <p className="text-darkblack/70">
              {clinics.length === 0 
                ? "No clinics have registered yet." 
                : "Try adjusting your search or filters."
              }
            </p>
          </div>
        ) : (
          filteredClinics.map((clinic) => {
            const StatusIcon = getStatusIcon(clinic.approval_status);
            
            return (
              <div
                key={clinic._id}
                className="bg-lightbg rounded-2xl p-6 border border-darkblue/20 hover:shadow-md transition-all duration-300"
              >
                {/* Clinic Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-darkblue rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-darkblack text-lg">
                        {clinic.clinic_name || `${clinic.first_name} ${clinic.last_name}`}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusIcon className={`w-4 h-4 ${
                          clinic.approval_status?.toLowerCase() === 'approved' ? 'text-green-600' :
                          clinic.approval_status?.toLowerCase() === 'pending' ? 'text-yellow-600' : 'text-red-600'
                        }`} />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(clinic.approval_status)}`}>
                          {clinic.approval_status || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions Menu */}
                  <div className="relative">
                    <button className="p-1 hover:bg-white/50 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-darkblue" />
                    </button>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-darkblack">
                    <Mail className="w-4 h-4 text-darkblue" />
                    <span>{clinic.email}</span>
                  </div>
                  
                  {clinic.mobile && (
                    <div className="flex items-center gap-2 text-sm text-darkblack">
                      <Phone className="w-4 h-4 text-darkblue" />
                      <span>{clinic.mobile}</span>
                    </div>
                  )}
                  
                  {clinic.address?.city && (
                    <div className="flex items-center gap-2 text-sm text-darkblack">
                      <MapPin className="w-4 h-4 text-darkblue" />
                      <span>
                        {clinic.address.city}, {clinic.address.province}
                      </span>
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-darkblue font-medium">Role:</span>
                    <span className="text-darkblack ml-2 capitalize">{clinic.role}</span>
                  </div>
                  <div>
                    <span className="text-darkblue font-medium">Joined:</span>
                    <span className="text-darkblack ml-2">{formatDate(clinic.createdAt)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-darkblue/20">
                  <div className="text-xs text-darkblack/70">
                    Clinic ID: {clinic._id?.slice(-8)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleViewClinic(clinic._id)}
                      className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-darkblue" />
                    </button>
                    <button className="p-1 hover:bg-white/50 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4 text-darkblue" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Stats Summary */}
      {clinics.length > 0 && (
        <div className="bg-lightbg rounded-2xl p-6 border border-darkblue/20">
          <h4 className="text-lg font-semibold text-darkblue mb-4">Clinics Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-darkblue">{clinics.length}</div>
              <div className="text-sm text-darkblack/70">Total Clinics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {clinics.filter(c => c.approval_status?.toLowerCase() === 'approved').length}
              </div>
              <div className="text-sm text-darkblack/70">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {clinics.filter(c => c.approval_status?.toLowerCase() === 'pending').length}
              </div>
              <div className="text-sm text-darkblack/70">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {clinics.filter(c => c.approval_status?.toLowerCase() === 'rejected').length}
              </div>
              <div className="text-sm text-darkblack/70">Rejected</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clinics;