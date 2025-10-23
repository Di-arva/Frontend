import TeamMembersTable from "./TeamMembersTable";

const Users = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and view all users in the system
          </p>
        </div>
  
      </div>

      <TeamMembersTable />
    </div>
  );
};

export default Users;