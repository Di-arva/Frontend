import Sidebar from "../Sidebar";
import Header from "../Header";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../Dashboard";
import Users from "../Users";
import { adminMenuItems } from "../Config/MenuItems";
import Clinics from "../Clinics"; 
import UserDetailsView from "../UserDetailsView";

const Admindashboard = () => {
  const [sideBarCollapsed, setSidebarCollapsed] = useState(false);
  const adminUser = {
    name: "Navjot Bassi",
    role: "Administrator",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
  };
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await fetch("/api/v1/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
      }
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        collapsed={sideBarCollapsed}
        onToggle={() => setSidebarCollapsed(!sideBarCollapsed)}
        menuItems={adminMenuItems}
        user={adminUser}
        portalName="Admin Panel"
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
            <Route path="users/:id" element={<UserDetailsView />} />
       
            <Route path="clinics" element={<Clinics />} /> {/* ADD THIS ROUTE */}
        
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Admindashboard;