import { useState, useEffect } from "react";
import { MoreVertical, Loader2, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TeamMembersTable = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get token from localStorage - check all possible keys
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
      setTeamMembers(users);
      setFilteredMembers(users);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users when filters change
  useEffect(() => {
    let filtered = [...teamMembers];

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (member) => member.approval_status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(
        (member) => member.role?.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    setFilteredMembers(filtered);
  }, [statusFilter, roleFilter, teamMembers]);

  // Get unique statuses and roles from data
  const getUniqueStatuses = () => {
    const statuses = teamMembers.map((m) => m.approval_status).filter(Boolean);
    return [...new Set(statuses)];
  };

  const getUniqueRoles = () => {
    const roles = teamMembers.map((m) => m.role).filter(Boolean);
    return [...new Set(roles)];
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setRoleFilter("all");
  };

  const hasActiveFilters = statusFilter !== "all" || roleFilter !== "all";

  const handleViewUser = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "approved" || statusLower === "active") {
      return "bg-emerald-50 text-emerald-700";
    } else if (statusLower === "pending") {
      return "bg-amber-50 text-amber-700";
    } else if (statusLower === "rejected" || statusLower === "inactive") {
      return "bg-red-50 text-red-700";
    }
    return "bg-gray-50 text-gray-700";
  };

  const getStatusDotColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "approved" || statusLower === "active") {
      return "bg-emerald-700";
    } else if (statusLower === "pending") {
      return "bg-amber-400";
    } else if (statusLower === "rejected" || statusLower === "inactive") {
      return "bg-red-700";
    }
    return "bg-gray-400";
  };

  const getAvatarUrl = (user) => {
    if (user.avatar || user.profileImage) {
      return user.avatar || user.profileImage;
    }
    const seed = user.name || user.username || user.email || user.id;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="text-red-600 text-center">
            <p className="font-semibold">Error loading users</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
          <span className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
            {filteredMembers.length} {filteredMembers.length === 1 ? 'user' : 'users'}
          </span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 text-xs font-medium text-orange-700 bg-orange-50 rounded-full">
              Filtered
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                {getUniqueStatuses().map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Role:</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                {getUniqueRoles().map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  Role
                  <span className="text-gray-400">ⓘ</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  {hasActiveFilters ? "No users match the selected filters" : "No users found"}
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => (
                <tr key={member.id || member._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={getAvatarUrl(member)}
                        alt={member.first_name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {member.first_name + " " + member.last_name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                       
                             {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        member.approval_status
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(
                          member.approval_status
                        )}`}
                      ></span>
                      {member.approval_status || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {member.role || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.mobile || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewUser(member.id || member._id)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamMembersTable;