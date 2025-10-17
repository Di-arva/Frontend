import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Users from "./Users";
import UserDetailsPage from "./UserDetailsPage";
import Clinics from "./Clinics"; // ADD THIS IMPORT

const Admindashboard = () => {
  const [sideBarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={sideBarCollapsed}
        onToggle={() => setSidebarCollapsed(!sideBarCollapsed)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          sideBarCollapsed={sideBarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sideBarCollapsed)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UserDetailsPage />} />
            <Route path="clinics" element={<Clinics />} /> {/* ADD THIS ROUTE */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Admindashboard;