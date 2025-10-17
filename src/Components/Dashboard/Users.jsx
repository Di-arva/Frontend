import React, { useState } from "react";
import { MoreVertical } from "lucide-react";

const TeamMembersTable = () => {
  const [selectedMembers, setSelectedMembers] = useState([]);

  const teamMembers = [
    {
      id: 1,
      name: "Phoenix Baker",
      username: "@phoenix",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Phoenix",
      status: "Pending",
      role: "Dental Assistant",
      certification: "HARP Certified",
      email: "phoenix@untitledui.com",
      phone: "+1 (555) 123-4567",
      teams: ["Design", "Product", "Marketing"],
      additionalTeams: 4,
    },
    {
      id: 2,
      name: "Orlando Diggs",
      username: "@orlando",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Orlando",
      status: "Approved",
      role: "Dental Assistant",
      certification: "Level 1",
      email: "orlando@untitledui.com",
      phone: "+1 (555) 234-5678",
      teams: ["Design", "Product", "Marketing"],
      additionalTeams: 4,
    },
    {
      id: 3,
      name: "Olivia Rhye",
      username: "@olivia",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
      status: "Pending",
      role: "Dental Assistant",
      certification: "Level 2",
      email: "olivia@untitledui.com",
      phone: "+1 (555) 345-6789",
      teams: ["Design", "Product", "Marketing"],
      additionalTeams: 4,
    },
    {
      id: 4,
      name: "Natali Craig",
      username: "@natali",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Natali",
      status: "Approved",
      role: "Dental Assistant",
      certification: "HARP Certified",
      email: "natali@untitledui.com",
      phone: "+1 (555) 456-7890",
      teams: ["Design", "Product", "Marketing"],
      additionalTeams: 2,
    },
    {
      id: 5,
      name: "Lana Steiner",
      username: "@lana",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lana",
      status: "Approved",
      role: "Dental Assistant",
      certification: "level 1",
      email: "lana@untitledui.com",
      phone: "+1 (555) 567-8901",
      teams: ["Design", "Product", "Marketing"],
      additionalTeams: 2,
    },
  ];

  const toggleMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedMembers((prev) =>
      prev.length === teamMembers.length ? [] : teamMembers.map((m) => m.id)
    );
  };

  const handleViewUser = (userId) => {
    // Store user data in sessionStorage for the details page
    const user = teamMembers.find((m) => m.id === userId);
    sessionStorage.setItem("selectedUser", JSON.stringify(user));

    // Navigate to user details page
    window.location.href = `/admin/users/${userId}`;

    // If using React Router with useNavigate, use this instead:
    // navigate(`${userId}`);
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
          <span className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
            100 users
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
            {teamMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
             
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.username}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        member.status === "Approved"
                          ? "bg-emerald-700"
                          : "bg-amber-400"
                      }`}
                    ></span>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleViewUser(member.id)}
                    className="text-sm font-medium text-darkblue hover:text-darkblue/70 hover:cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamMembersTable;
