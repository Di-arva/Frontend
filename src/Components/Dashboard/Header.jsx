import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  Settings,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const Header = ({ 
  sideBarCollapsed, 
  onToggleSidebar, 
  onLogout,
  user = {},
  showSearch = true,
  variant = "default" 
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Default user data
  const defaultUser = {
    name: "User Name",
    role: "User",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    ...user
  };

  // Role-based titles and styling
  const roleConfig = {
    admin: {
      title: "Dashboard",
      subtitle: "Welcome back, here's what's happening today",
      portal: "Admin Portal"
    },
    clinic: {
      title: "Clinic Dashboard",
      subtitle: "Manage your clinic operations and staff",
      portal: "Clinic Portal"
    },
    candidate: {
      title: "Candidate Dashboard",
      subtitle: "Find and apply to available shifts",
      portal: "Candidate Portal"
    },
    assistant: {
      title: "Assistant Dashboard", 
      subtitle: "Find and apply to available shifts",
      portal: "Assistant Portal"
    }
  };

  const currentRole = defaultUser.role?.toLowerCase() || 'admin';
  const config = roleConfig[currentRole] || roleConfig.admin;

  const handleLogoutClick = async () => {
    try {
      setLoggingOut(true);
      if (onLogout) {
        await onLogout();
      } else {
        // Default logout behavior
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback logout
      localStorage.clear();
      window.location.href = "/login";
    } finally {
      setLoggingOut(false);
      setShowProfileMenu(false);
    }
  };

  return (
    <div className="bg-lightbg backdrop-blur-xl border-b border-lightbg px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-lg text-darkblack hover:cursor-pointer bg-lightblue hover:bg-lightblue/60 transition-colors"
            onClick={onToggleSidebar}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:block">
            <h1 className="font-poppins text-2xl font-medium text-darkblack">
              {config.title}
            </h1>
            <p className="text-sm font-poppins font-normal">
              {config.subtitle}
              {currentRole === 'admin' && (
                <span className="text-darkblue mx-1">{defaultUser.name}</span>
              )}
            </p>
          </div>
        </div>

        {/* Center Search - Conditionally rendered */}
        {showSearch && (
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-darkblue" />
              <input
                type="text"
                placeholder="Search Anything"
                className="w-full pl-10 pr-4 py-2.5 bg-lightblue border-lightblue/50 rounded-xl text-darkblack font-poppins text-sm placeholder:text-darkblue focus:outline-none focus:ring-2 focus:ring-darkblue focus:border-transparent transition-all"
              />
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Notification */}
          <button className="relative p-2.5 rounded-xl text-darkblue bg-lightblue hover:bg-lightblue/70 transition-colors hover:cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-darkblue text-lightbg text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Settings */}
          <button className="p-2.5 rounded-xl text-darkblue bg-lightblue hover:bg-lightblue/70 transition-colors hover:cursor-pointer">
            <Settings className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="relative flex items-center space-x-3 pl-3 border-l border-lightblue">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <img
                src={defaultUser.avatar}
                alt="user profile"
                className="w-9 h-9 rounded-full ring-2 ring-darkblue object-cover shrink-0"
              />
              <div className="hidden md:block">
                <p className="text-sm font-poppins text-darkblue font-medium">
                  {defaultUser.name}
                </p>
                <p className="text-xs font-medium text-darkblack font-poppins">
                  {config.portal}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-darkblue" />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileMenu(false)}
                ></div>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-lightblue py-2 z-20">
                  <button
                    onClick={handleLogoutClick}
                    disabled={loggingOut}
                    className="w-full px-4 py-2.5 text-left text-sm font-poppins text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="w-4 h-4" />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;