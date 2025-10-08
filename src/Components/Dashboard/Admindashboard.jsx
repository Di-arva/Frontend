import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";
import Dashboard from "./Dashboard";

const Admindashboard = () => {
  const [sideBarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={sideBarCollapsed}
        onToggle={() => setSidebarCollapsed(!sideBarCollapsed)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          sideBarCollapsed={sideBarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sideBarCollapsed)}
        />

        {/* Scrollable dashboard content */}
        <main className="flex-1 overflow-auto p-6 space-y-6">
          {currentPage === "dashboard" && <Dashboard />}
        </main>
      </div>
    </div>
  );
};

export default Admindashboard;
