import {
  LayoutDashboard,
  ChartBar,
  Users,
  CreditCardIcon,
  Calendar,
  FileSpreadsheet,
  MessageSquare,
  Settings,
  ChevronDown,
  Building2
} from "lucide-react";
import Marklogo from "../../assets/icons/Dashboard.png";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/admin",
    badge: "New",
  },
  {
    id: "analytics",
    icon: ChartBar,
    label: "Analytics",
    submenu: [
      { id: "overview", label: "Overview", path: "/admin/analytics/overview" },
      { id: "reports", label: "Reports", path: "/admin/analytics/reports" },
      { id: "insights", label: "Insights", path: "/admin/analytics/insights" },
    ],
  },
  {
    id: "users",
    icon: Users,
    label: "Users",
    count: "2.4k",
    submenu: [
      { id: "all-users", label: "All Users", path: "/admin/users" },
      { id: "roles", label: "Roles & Permission", path: "/admin/users/roles" },
      { id: "activity", label: "User Activity", path: "/admin/users/activity" },
    ],
  },
  {
    id: "clinics",
    icon: Building2,
    label: "Clinics",
    path: "/admin/clinics",
  },
  {
    id: "messages",
    icon: MessageSquare,
    label: "Messages",
    count: "12",
    path: "/admin/messages",
  },
  {
    id: "transactions",
    icon: CreditCardIcon,
    label: "Transaction",
    count: "23",
    path: "/admin/transactions",
  },
  {
    id: "calendar",
    icon: Calendar,
    label: "Calendar",
    path: "/admin/calendar",
  },
  {
    id: "reports",
    icon: FileSpreadsheet,
    label: "Reports",
    path: "/admin/reports",
  },
  {
    id: "settings",
    icon: Settings,
    label: "Settings",
    path: "/admin/settings",
  },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState(new Set(["analytics"]));

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const isActive = (item) => {
    if (item.path && location.pathname === item.path) {
      return true;
    }
    if (item.submenu) {
      return item.submenu.some(sub => location.pathname === sub.path);
    }
    return false;
  };

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-72"
      } transition-all duration-300 ease-in-out bg-lightblue backdrop-blur-xl border-r border-blue-200 flex flex-col relative z-10`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-blue-200 flex gap-4 items-center">
        <div className="flex items-center space-x-3 ">
        <img
              src={Marklogo}
              alt="Diarva Mark Logo"
              className="bg-lightbg h-20 rounded-full w-auto "
            />
        </div>

        {/* conditional Rendering */}
        {!collapsed && (
          <div>
            <h1 className="font-poppins text-md text-darkblue font-medium">
              Di'arva
            </h1>
            <p className="font-poppins text-xs font-medium text-darkblack">
              Admin Panel
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-auto">
        {menuItems.map((item) => {
          return (
            <div key={item.id}>
              <button
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive(item)
                    ? "border-darkblue border-1 bg-white/50"
                    : "hover:bg-white/30"
                }`}
                onClick={() => {
                  if (item.submenu) {
                    toggleExpanded(item.id);
                  } else if (item.path) {
                    handleNavigation(item.path);
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5`} />
                  {/* Conditional Rendering */}
                  {!collapsed && (
                    <>
                      <span className="font-poppins font-normal ml-2 text-darkblack">
                        {item.label}
                      </span>

                      {item.badge && (
                        <span className="px-2 py-1 text-xs bg-darkblue text-lightbg rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.count && (
                        <span className="px-2 py-1 text-xs bg-darkblue text-lightbg rounded-full">
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {!collapsed && item.submenu && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedItems.has(item.id) ? "rotate-180" : ""
                    } hover:cursor-pointer`}
                  />
                )}
              </button>

              {/* Submenus */}
              {!collapsed && item.submenu && expandedItems.has(item.id) && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.submenu.map((subitem) => {
                    return (
                      <button
                        key={subitem.id}
                        onClick={() => handleNavigation(subitem.path)}
                        className={`w-full text-left p-2 text-sm font-poppins text-darkblack hover:cursor-pointer rounded-lg transition-all ${
                          location.pathname === subitem.path
                            ? "border-1 border-darkblue bg-white/50"
                            : "hover:border-1 hover:border-darkblue hover:bg-white/30"
                        }`}
                      >
                        {subitem.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-200/50">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-white">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="user profile image"
              className="w-10 h-10 rounded-full ring-2 ring-darkblue  object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-darkblue truncate">
                  Navjot Bassi
                </p>
                <p className="text-xs font-medium text-darkblack truncate">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;