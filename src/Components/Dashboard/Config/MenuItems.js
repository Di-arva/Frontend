import {
    LayoutDashboard,
    ChartBar,
    Users,
    CreditCardIcon,
    Calendar,
    FileSpreadsheet,
    MessageSquare,
    Settings,
    Building2,
    Clock,
    UserCheck,
    FileText
  } from "lucide-react";
  
  // Admin Menu Items
  export const adminMenuItems = [
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
  
  // Clinic Menu Items
  export const clinicMenuItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/clinic",
      badge: "New",
    },
    {
      id: "shifts",
      icon: Calendar,
      label: "Shifts",
      submenu: [
        { id: "all-shifts", label: "All Shifts", path: "/clinic/shifts" },
        { id: "post-shift", label: "Post New Shift", path: "/clinic/post-shift" },
        {
          id: "shift-calendar",
          label: "Shift Calendar",
          path: "/clinic/shift-calendar",
        },
      ],
    },
    {
      id: "All Applicants",
      label: "Applicants",
      icon: Users,
      path: "/clinic/applicants",
    },
    {
      id: "staff",
      icon: Users,
      label: "Staff",
      count: "8",
      submenu: [
        { id: "all-staff", label: "All Staff", path: "/clinic/staff" },
        { id: "schedules", label: "Schedules", path: "/clinic/staff/schedules" },
        { id: "performance", label: "Performance", path: "/clinic/staff/performance" },
      ],
    },
    {
      id: "billing",
      icon: CreditCardIcon,
      label: "Billing",
      path: "/clinic/billing",
    },
    {
      id: "clinicprofile",
      icon: Building2,
      label: "Clinic Profile",
      path: "/clinic/clinic-profile",
    
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      path: "/clinic/settings",
    },
  
  ];
  
  // Candidate Menu Items
  export const candidateMenuItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/candidate",
    },
    {
      id: "available-shifts",
      icon: Calendar,
      label: "Available Shifts",
      path: "/candidate/shifts",
    },
    {
      id: "my-applications",
      icon: FileText,
      label: "My Applications",
      path: "/candidate/applications",
    },
    {
      id: "schedule",
      icon: Clock,
      label: "My Schedule",
      path: "/candidate/schedule",
    },
    {
      id: "profile",
      icon: UserCheck,
      label: "My Profile",
      path: "/candidate/profile",
    },
    {
      id: "earnings",
      icon: CreditCardIcon,
      label: "Earnings",
      path: "/candidate/earnings",
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      path: "/candidate/settings",
    },
  ];