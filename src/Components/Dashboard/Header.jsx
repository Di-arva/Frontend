import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  Settings,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const Header = ({ sideBarCollapsed, onToggleSidebar }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      
      // Get token from localStorage if it exists
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      
      const headers = {
        "Content-Type": "application/json",
      };
      
      // Add Authorization header if token exists
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include", // This sends cookies
        headers: headers,
      });

      // If we get 401, user session is already invalid, just clear and redirect
      if (response.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        // Clear any local user data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        
        // Redirect to login page
        window.location.href = "/login";
      } else {
        throw new Error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local data and redirect
      localStorage.clear();
      window.location.href = "/login";
    } finally {
      setLoggingOut(false);
      setShowProfileMenu(false);
    }
  };

  return (
    <div className="bg-lightbg backdrop-blur-xl border-b border-lightbg px-6 py-4 ">
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
              Dashboard
            </h1>
            <p className="text-sm font-poppins font-normal">
              Welcome back,
              <span className="text-darkblue mx-1">Navjot Bassi.</span>
              Here's what's happening today
            </p>
          </div>
        </div>

        {/* Center part */}
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

        {/* Right */}
        <div className="flex items-center space-x-3">
          {/* Notification */}
          <button className="relative p-2.5 rounded-xl text-darkblue bg-lightblue hover:bg-lightblue/70 transition-colors hover:cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 w-5 h-5 bg-darkblue text-lightbg text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Settings */}
          <button className=" p-2.5 rounded-xl text-darkblue bg-lightblue hover:bg-lightblue/70 transition-colors hover:cursor-pointer">
            <Settings className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="relative flex items-center space-x-3 pl-3 border-l border-lightblue">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                alt="user profile"
                className="w-9 h-9 rounded-full ring-2 ring-darkblue object-cover shrink-0"
              />
              <div className="hidden md:block">
                <p className="text-sm font-poppins text-darkblue font-medium">
                  Navjot Bassi
                </p>
                <p className="text-xs font-medium text-darkblack font-poppins">
                  Administrator
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
                    onClick={handleLogout}
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