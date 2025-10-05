import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";
import Dashboard from "./Dashboard";

const Admindashboard = () => {
  const [sideBarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  return (
    <div className="min-h-screen">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          collapsed={sideBarCollapsed}
          onToggle={() => setSidebarCollapsed(!sideBarCollapsed)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            sideBarCollapsed={sideBarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sideBarCollapsed)}
          />

          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 space-y-6">
              {currentPage === "dashboard" && <Dashboard />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Admindashboard;
