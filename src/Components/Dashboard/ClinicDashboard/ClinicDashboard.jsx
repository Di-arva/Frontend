import { useState } from "react";
import {
  Calendar,
  ClockArrowDown,
  Clock,
  UserCheck,
  Plus,
  Check,
  X,
  FileText,
  Download,
  LayoutDashboard,
  CreditCardIcon,
  Settings,
  ChevronDown,
  Building2,
  Users,
  DollarSign,
} from "lucide-react";

import Button from "../../Button";

const stats = [
  {
    title: "Active Shifts",
    value: "12",

    icon: UserCheck,
  },
  {
    title: "Pending Request",
    value: "3",

    icon: ClockArrowDown,
  },
  {
    title: "Total Staff",
    value: "22",

    icon: Users,
  },
  {
    title: "Monthly Cost",
    value: "$4000",

    icon: DollarSign,
  },
];
import ClinicTasksList from "./ClinicTasksList";
import CreateShiftModal from "./CreateShiftModal";
import Header from "../Header";
import Marklogo from "../../../assets/icons/Dashboard.png";

const ClinicDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sideBarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [expandedItems, setExpandedItems] = useState(new Set());

   // Clinic-specific user data
   const clinicUser = {
    name: "Clinic Manager",
    role: "clinic",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
  };

  // Clinic-specific menu items
  const clinicMenuItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "dashboard",
      badge: "New",
    },
    {
      id: "shifts",
      icon: Calendar,
      label: "Shifts",
      submenu: [
        { id: "all-shifts", label: "All Shifts", path: "shifts" },
        { id: "post-shift", label: "Post New Shift", path: "post-shift" },
        {
          id: "shift-calendar",
          label: "Shift Calendar",
          path: "shift-calendar",
        },
      ],
    },
    {
      id: "staff",
      icon: Users,
      label: "Staff",
      count: "8",
      submenu: [
        { id: "all-staff", label: "All Staff", path: "staff" },
        { id: "schedules", label: "Schedules", path: "staff/schedules" },
        { id: "performance", label: "Performance", path: "staff/performance" },
      ],
    },
    {
      id: "billing",
      icon: CreditCardIcon,
      label: "Billing",
      path: "billing",
    },
    {
      id: "clinic-profile",
      icon: Building2,
      label: "Clinic Profile",
      path: "clinic-profile",
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      path: "settings",
    },
  ];

  const upcomingShifts = [
    {
      id: 1,
      role: "Dental Hygienist",
      date: "Oct 18, 2025",
      time: "9:00 AM - 5:00 PM",
      status: "confirmed",
      staff: "Sarah Johnson",
    },
    {
      id: 2,
      role: "Dental Assistant",
      date: "Oct 19, 2025",
      time: "8:00 AM - 4:00 PM",
      status: "confirmed",
      staff: "Mike Chen",
    },
    {
      id: 3,
      role: "Dental Hygienist",
      date: "Oct 20, 2025",
      time: "10:00 AM - 6:00 PM",
      status: "pending",
      staff: "Not assigned",
    },
  ];

  const pendingRequests = [
    {
      id: 1,
      role: "Dental Assistant",
      date: "Oct 22, 2025",
      time: "9:00 AM - 5:00 PM",
      applicants: 3,
      hourlyRate: "$35",
    },
    {
      id: 2,
      role: "Dental Hygienist",
      date: "Oct 23, 2025",
      time: "8:00 AM - 4:00 PM",
      applicants: 5,
      hourlyRate: "$45",
    },
    {
      id: 3,
      role: "Receptionist",
      date: "Oct 24, 2025",
      time: "9:00 AM - 5:00 PM",
      applicants: 2,
      hourlyRate: "$25",
    },
  ];

  const recentInvoices = [
    {
      id: "INV-2025-1012",
      date: "Oct 10, 2025",
      amount: "$1,280",
      status: "Paid",
      period: "Week 40",
    },
    {
      id: "INV-2025-1005",
      date: "Oct 3, 2025",
      amount: "$1,560",
      status: "Paid",
      period: "Week 39",
    },
    {
      id: "INV-2025-0928",
      date: "Sep 28, 2025",
      amount: "$980",
      status: "Pending",
      period: "Week 38",
    },
  ];

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
      
      // Clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("user");
      
      // Redirect to login
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: clear storage and redirect
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  const [showShiftModal, setShowShiftModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newShift, setNewShift] = useState({
    title: "",
    description: "",
    role: "",
    date: "",
    startTime: "",
    endTime: "",
    breakDuration: 30,
    hourlyRate: "",
    certificationLevel: "",
    minimumExperience: "0",
    requiredSpecializations: [],
    preferredSkills: [],
    priority: "normal",
    paymentMethod: "E-transfer",
    paymentTerms: "Same Day",
    parkingInfo: "",
    specificInstructions: "",
    contactName: "",
    contactPhone: "",
    contactRole: "",
    maxApplications: 10,
    requiresBackgroundCheck: true,
    applicationDeadline: "",
  });

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
      setCurrentPage(path);
    }
  };

  const isActive = (item) => {
    if (item.path && currentPage === item.path) {
      return true;
    }
    if (item.submenu) {
      return item.submenu.some((sub) => currentPage === sub.path);
    }
    return false;
  };

  const handleCreateShift = async () => {
    // Your existing handleCreateShift function remains the same
    if (
      !newShift.title ||
      !newShift.priority ||
      !newShift.date ||
      !newShift.startTime ||
      !newShift.endTime ||
      !newShift.hourlyRate
    ) {
      alert("Please fill in all required fields marked with *");
      return;
    }

    setIsSubmitting(true);
    try {
      // Extract clinic_id from JWT token
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Authentication token not found. Please log in again.");
        setIsSubmitting(false);
        return;
      }

      // Construct the datetime strings (ISO format)
      const startDateTime = new Date(
        `${newShift.date}T${newShift.startTime}`
      ).toISOString();
      const endDateTime = new Date(
        `${newShift.date}T${newShift.endTime}`
      ).toISOString();
      const deadlineDateTime = newShift.applicationDeadline
        ? new Date(`${newShift.applicationDeadline}T23:59:59`).toISOString()
        : new Date(`${newShift.date}T00:00:00`).toISOString();

      // Calculate duration in hours
      const start = new Date(`${newShift.date}T${newShift.startTime}`);
      const end = new Date(`${newShift.date}T${newShift.endTime}`);
      const durationMs = end - start;
      const durationHours = durationMs / (1000 * 60 * 60);

      if (durationHours <= 0 || durationHours > 12) {
        alert("Duration must be between 0.5 and 12 hours");
        setIsSubmitting(false);
        return;
      }

      // Build the payload according to schema
      const payload = {
        title: newShift.title.trim(),
        description: newShift.description.trim(),
        requirements: {
          certification_level: newShift.certificationLevel,
          minimum_experience: parseInt(newShift.minimumExperience) || 0,
        },
        schedule: {
          start_datetime: startDateTime,
          end_datetime: endDateTime,
          duration_hours: parseFloat(durationHours.toFixed(2)),
          break_duration_minutes: parseInt(newShift.breakDuration) || 30,
        },
        compensation: {
          hourly_rate: parseFloat(newShift.hourlyRate),
          currency: "CAD",
          payment_method: newShift.paymentMethod,
          payment_terms: newShift.paymentTerms,
        },
        priority: newShift.priority,
        max_applications: parseInt(newShift.maxApplications) || 10,
        requires_background_check: newShift.requiresBackgroundCheck,
        application_deadline: deadlineDateTime,
      };

      // Add optional arrays only if they have values
      if (newShift.requiredSpecializations.length > 0) {
        payload.requirements.required_specializations =
          newShift.requiredSpecializations;
      }

      if (newShift.preferredSkills.length > 0) {
        payload.requirements.preferred_skills = newShift.preferredSkills;
      }

      // Add location details only if at least one field is filled
      if (
        newShift.specificInstructions ||
        newShift.parkingInfo ||
        newShift.contactName
      ) {
        payload.location_details = {};

        if (newShift.specificInstructions) {
          payload.location_details.specific_instructions =
            newShift.specificInstructions;
        }

        if (newShift.parkingInfo) {
          payload.location_details.parking_info = newShift.parkingInfo;
        }

        if (newShift.contactName) {
          payload.location_details.contact_person = {
            name: newShift.contactName,
          };

          if (newShift.contactPhone) {
            payload.location_details.contact_person.phone =
              newShift.contactPhone;
          }

          if (newShift.contactRole) {
            payload.location_details.contact_person.role = newShift.contactRole;
          }
        }
      }

      // Replace with your actual API base URL
      const apiBaseUrl =
        import.meta?.env?.VITE_SERVER_BASE_URL || "http://localhost:1080";

      console.log("=== SENDING PAYLOAD ===");
      console.log(JSON.stringify(payload, null, 2));
      console.log("======================");

      const response = await fetch(`${apiBaseUrl}/api/v1/clinic/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("=== API ERROR RESPONSE ===");
        console.error("Status:", response.status);
        console.error("Response:", JSON.stringify(result, null, 2));
        console.error("=========================");

        // Handle 401 specifically
        if (response.status === 401) {
          alert("Authentication failed. Please log in again.");
          setIsSubmitting(false);
          return;
        }

        // Show detailed error message
        const errorMessage =
          result.message || result.error || "Failed to create shift";
        const errorDetails = result.errors
          ? "\n\nDetails:\n" + JSON.stringify(result.errors, null, 2)
          : "";
        throw new Error(errorMessage + errorDetails);
      }

      console.log("=== SUCCESS ===");
      console.log(JSON.stringify(result, null, 2));
      console.log("===============");

      setShowShiftModal(false);
      setNewShift({
        title: "",
        description: "",
        role: "",
        date: "",
        startTime: "",
        endTime: "",
        breakDuration: 30,
        hourlyRate: "",
        certificationLevel: "",
        minimumExperience: "0",
        requiredSpecializations: [],
        preferredSkills: [],
        priority: "normal",
        paymentMethod: "E-transfer",
        paymentTerms: "Same Day",
        parkingInfo: "",
        specificInstructions: "",
        contactName: "",
        contactPhone: "",
        contactRole: "",
        maxApplications: 10,
        requiresBackgroundCheck: true,
        applicationDeadline: "",
      });

      alert("Shift posted successfully!");
    } catch (error) {
      console.error("=== CATCH ERROR ===");
      console.error(error);
      console.error("===================");
      alert(`Failed to create shift:\n\n${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar - Updated to match your admin sidebar style */}
      <div
        className={`${
          sideBarCollapsed ? "w-20" : "w-72"
        } transition-all duration-300 ease-in-out bg-lightblue backdrop-blur-xl border-r border-blue-200 flex flex-col relative z-10`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-blue-200 flex gap-4 items-center">
          <div className="flex items-center space-x-3">
            <img
              src={Marklogo}
              alt="Diarva Mark Logo"
              className="bg-lightbg h-12 rounded-full w-auto"
            />
          </div>

          {/* Conditional Rendering */}
          {!sideBarCollapsed && (
            <div>
              <h1 className="font-poppins text-md text-darkblue font-medium">
                Di'arva
              </h1>
              <p className="font-poppins text-xs font-medium text-darkblack">
                Clinic Portal
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-auto">
          {clinicMenuItems.map((item) => {
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
                    {!sideBarCollapsed && (
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

                  {!sideBarCollapsed && item.submenu && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedItems.has(item.id) ? "rotate-180" : ""
                      } hover:cursor-pointer`}
                    />
                  )}
                </button>

                {/* Submenus */}
                {!sideBarCollapsed &&
                  item.submenu &&
                  expandedItems.has(item.id) && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.submenu.map((subitem) => {
                        return (
                          <button
                            key={subitem.id}
                            onClick={() => handleNavigation(subitem.path)}
                            className={`w-full text-left p-2 text-sm font-poppins text-darkblack hover:cursor-pointer rounded-lg transition-all ${
                              currentPage === subitem.path
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
        {!sideBarCollapsed && (
          <div className="p-4 border-t border-slate-200/50">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="user profile image"
                className="w-10 h-10 rounded-full ring-2 ring-darkblue object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-darkblue truncate">
                  Clinic Manager
                </p>
                <p className="text-xs font-medium text-darkblack truncate">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          sideBarCollapsed={sideBarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sideBarCollapsed)}
          onLogout={handleLogout}
          user={clinicUser}
          showSearch={true}
          variant="clinic"
        />

        {/* Scrollable dashboard content */}
        <main className="flex-1 overflow-auto p-8">
          {currentPage === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 bg-lightbg">
                {stats.map((stats, index) => {
                  return (
                    <div
                      className="bg-lightblue backdrop-blur-xl rounded-2xl p-6  transition-all duration-300 group  hover:cursor-pointer hover:scale-110"
                      key={index}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-md font-light text-darkblack font-poppins">
                            {stats.title}
                          </p>
                          <p className="text-3xl font-medium text-darkblue font-poppins my-2">
                            {stats.value}
                          </p>
                        </div>

                        <div
                          className={`p-2 rounded-xl bg-darkblue group-hover:scale-110 transition-all duration-200 hover:cursor-pointer`}
                        >
                          {<stats.icon className={`w-6 h-6 text-lightbg`} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}

              <div className="border border-lightblue font-poppins rounded-xl p-6 shadow-sm">
                <h3 className="text-3xl font-normal text-darkblack mb-4">
                  Quick Actions
                </h3>
                <div className="flex gap-4">
                  <Button
                    variant="dark"
                    size="sm"
                    onClick={() => setShowShiftModal(true)}
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Post New Shift
                    </div>
                  </Button>

                  <Button variant="dark" size="sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      View Staffs
                    </div>
                  </Button>

                  <Button variant="dark" size="sm">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Download Reports
                    </div>
                  </Button>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-poppins">
                {/* Upcoming Shifts */}
                <div className="bg-lightblue rounded-xl p-6 shadow-sm ">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-darkblue">
                      Upcoming Shifts
                    </h3>
                    <button className="font-poppins font-medium text-sm hover:cursor-pointer text-darkblue hover:text-blue-800">
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {upcomingShifts.map((shift) => (
                      <div
                        key={shift.id}
                        className="p-4 bg-lightbg rounded-2xl border border-lightblue"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold  text-darkblue">
                              {shift.role}
                            </h4>
                            <p className="text-sm text-darkblack">
                              {shift.staff}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              shift.status === "confirmed"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {shift.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-darkblack">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-darkblue" />
                            {shift.date}
                          </span>
                          <span className="flex items-center gap-1 ">
                            <Clock className="w-4 h-4 text-darkblue" />
                            {shift.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Applications */}
                <div className="bg-lightblue rounded-xl p-6 shadow-sm border border-lightblue">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-darkblue">
                      Pending Applications
                    </h3>
                    <button className="font-poppins font-medium text-sm hover:cursor-pointer text-darkblue hover:text-blue-800">
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {pendingRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-4 bg-gray-50 rounded-2xl border border-lightblue"
                      >
                        <div className="flex items-start justify-between mb-3 ">
                          <div>
                            <h4 className="font-semibold text-darkblue">
                              {req.role}
                            </h4>
                            <div className="flex items-center w-full gap-2 mt-2 text-sm text-darkblack">
                              <span className="flex items-center gap-1 ">
                                <Calendar className="w-4 h-4 text-darkblue" />
                                {req.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-darkblue" />
                                {req.time}
                              </span>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-darkblue rounded-full text-xs font-medium">
                            {req.applicants} applicants
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-md font-medium text-darkblue">
                            {req.hourlyRate}/hr
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Invoices */}
              <div className="bg-lightbg rounded-xl p-6 shadow-sm border border-lightblue">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-darkblue font-poppins">
                    Recent Bills
                  </h3>
                  <button className="font-poppins font-medium text-sm hover:cursor-pointer text-darkblue hover:text-blue-800">
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-lightblue">
                        <th className="text-left p-4 text-sm font-semibold text-darkblue font-poppins">
                          Bill ID
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-darkblue font-poppins">
                          Period
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-darkblue font-poppins">
                          Date
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-darkblue font-poppins">
                          Amount
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-darkblue font-poppins">
                          Status
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-darkblue font-poppins">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInvoices.map((invoice) => (
                        <tr
                          key={invoice.id}
                          className="border-b border-lightblue hover:bg-lightblue/50"
                        >
                          <td className="py-4 px-4 text-sm font-medium text-darkblack">
                            {invoice.id}
                          </td>
                          <td className="py-4 px-4 text-sm text-darkblack">
                            {invoice.period}
                          </td>
                          <td className="py-4 px-4 text-sm text-darkblack">
                            {invoice.date}
                          </td>
                          <td className="py-4 px-4 text-sm font-semibold text-darkblack">
                            {invoice.amount}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                invoice.status === "Paid"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {invoice.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button className="text-darkblue hover:cursor-pointer hover:text-darkblue/70 text-sm font-medium">
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentPage === "shifts" && <ClinicTasksList />}

          {currentPage !== "dashboard" && currentPage !== "shifts" && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}{" "}
                Page
              </h3>
              <p className="text-gray-600">
                Content for {currentPage} will be displayed here
              </p>
            </div>
          )}

          {/* Create Shift Modal - Keep your existing modal code */}

          <CreateShiftModal
            showShiftModal={showShiftModal}
            setShowShiftModal={setShowShiftModal}
            newShift={newShift}
            setNewShift={setNewShift}
            isSubmitting={isSubmitting}
            handleCreateShift={handleCreateShift}
          />
        </main>
      </div>
    </div>
  );
};

export default ClinicDashboard;
