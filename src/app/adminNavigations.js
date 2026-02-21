export const adminNavigations = [
  { 
    name: "Dashboard",
    path: "/admin/dashboard", 
    icon: "dashboard" 
  },

  { label: "ADMINISTRATION", type: "label" },
  
  {
    name: "Faculty Management",
    icon: "people",
    children: [
      { name: "All Faculty", path: "/admin/faculty/all", iconText: "AF" },
      { name: "Add New Faculty", path: "/admin/hr/onboarding", iconText: "NF" },
      { name: "Probation Tracker", path: "/admin/hr/probation", iconText: "PT" },
      { name: "Promotions & Incr.", path: "/admin/faculty/promotions", iconText: "PI" },
      { name: "Transfers & Exits", path: "/admin/faculty/transfers", iconText: "TE" }
    ]
  },

  {
    name: "Attendance & Leave",
    icon: "date_range",
    children: [
      { name: "Attendance Monitor", path: "/admin/attendance/monitor", iconText: "AM" },
      { name: "Leave Approvals", path: "/admin/hr/leaves", iconText: "LA" }, // Linked to existing view
      { name: "Regularization Queue", path: "/admin/attendance/regularization", iconText: "RQ" }
    ]
  },

  {
    name: "Payroll & Finance",
    icon: "attach_money",
    children: [
      { name: "Salary Processing", path: "/admin/finance/payroll", iconText: "SP" },
      { name: "Reimbursement Queue", path: "/admin/finance/claims", iconText: "RQ" }, // Linked to existing view
      { name: "Loan Management", path: "/admin/finance/loans", iconText: "LM" },
    ]
  },

  {
    name: "Legal & Governance",
    icon: "gavel",
    children: [
      { name: "Policy Management", path: "/admin/legal/policies", iconText: "PM" },
      { name: "Compliance Tracker", path: "/admin/legal/compliance", iconText: "CT" },
      { name: "Bonds & Contracts", path: "/admin/legal/contracts", iconText: "BC" },
      { name: "Grievance Queue", path: "/admin/grievance/queue", iconText: "GQ" }
    ]
  },

  { label: "ACADEMICS & OPERATIONS", type: "label" },

  {
    name: "Academic & Research",
    icon: "school",
    children: [
      { name: "Committee Mgmt", path: "/admin/academic/committees", iconText: "CM" },
      { name: "PBAS Review", path: "/admin/research/pbas", iconText: "PB" },
      { name: "Grants & Projects", path: "/admin/research/grants", iconText: "GP" },
    ]
  },

  {
    name: "Logistics",
    icon: "business",
    children: [
      { name: "Asset Management", path: "/admin/logistics/assets", iconText: "AM" }, // Linked to existing view
      { name: "Room Bookings", path: "/admin/logistics/bookings", iconText: "RB" },
      { name: "Maintenance Tracker", path: "/admin/logistics/maintenance", iconText: "MT" }
    ]
  },

  { label: "INSIGHTS & SETTINGS", type: "label" },

  { 
    name: "Reports & Analytics", 
    path: "/admin/reports", 
    icon: "assessment" 
  },
  
  { 
    name: "Notifications", 
    path: "/admin/communication/announcements", 
    icon: "notifications" 
  },

  {
    name: "System Settings",
    icon: "settings",
    children: [
      { name: "Admin Roles", path: "/admin/settings/rbac", iconText: "AR" },
      { name: "Email Templates", path: "/admin/communication/templates", iconText: "ET" },
    ]
  }
];