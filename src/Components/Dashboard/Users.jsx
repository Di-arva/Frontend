import { useState, useEffect } from "react";
import { MoreVertical, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TeamMembersTable = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const BASE_URL=import.meta.env.VITE_SERVER_BASE_URL
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}admin/users`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      setTeamMembers(data.users || data); // Adjust based on your API response structure
      setError(null);
    } catch (err) {
  
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (userId) => {
 navigate(`/admin/users/${userId}`)
  
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
    // Use user's avatar if available, otherwise generate one based on name
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
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
          <span className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
            {teamMembers.length} users
          </span>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Table */}
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
            {teamMembers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              teamMembers.map((member) => (
                <tr key={member.id || member._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={getAvatarUrl(member)}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {member.name || member.fullName || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.username
                            ? `@${member.username}`
                            : member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        member.status
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(
                          member.status
                        )}`}
                      ></span>
                      {member.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.role || member.certification || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.phone || member.phoneNumber || "N/A"}
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