// Admin navigation — hierarchical format
// Structure: type:"item" → direct NavLink on icon rail
//            type:"section" → section on rail, modules+pages expand in panel
export const adminNavigations = [
  {
    id: "admin-home",
    name: "Dashboard",
    icon: "dashboard",
    path: "/admin/dashboard",
    type: "item"
  },
  {
    id: "hr-ops",
    name: "HR & People",
    icon: "people",
    type: "section",
    modules: [
      {
        id: "faculty-mgmt",
        name: "Faculty Management",
        icon: "badge",
        pages: [
          { name: "All Faculty",         path: "/admin/faculty/all",       iconText: "AF" },
          { name: "Add New Faculty",     path: "/admin/hr/onboarding",     iconText: "NF" },
          { name: "Probation Tracker",   path: "/admin/hr/probation",      iconText: "PT" },
          { name: "Promotions & Incr.",  path: "/admin/faculty/promotions",iconText: "PI" },
          { name: "Transfers & Exits",   path: "/admin/faculty/transfers", iconText: "TE" }
        ]
      },
      {
        id: "attendance-leave",
        name: "Attendance & Leave",
        icon: "date_range",
        pages: [
          { name: "Attendance Monitor",    path: "/admin/attendance/monitor",        iconText: "AM" },
          { name: "Leave Approvals",       path: "/admin/hr/leaves",                 iconText: "LA" },
          { name: "Regularization Queue",  path: "/admin/attendance/regularization", iconText: "RQ" }
        ]
      }
    ]
  },
  {
    id: "finance-ops",
    name: "Finance",
    icon: "account_balance",
    type: "section",
    modules: [
      {
        id: "payroll-finance",
        name: "Payroll & Finance",
        icon: "attach_money",
        pages: [
          { name: "Salary Processing",    path: "/admin/finance/payroll", iconText: "SP" },
          { name: "Reimbursement Queue",  path: "/admin/finance/claims",  iconText: "RQ" },
          { name: "Loan Management",      path: "/admin/finance/loans",   iconText: "LM" }
        ]
      }
    ]
  },
  {
    id: "legal-ops",
    name: "Legal",
    icon: "gavel",
    type: "section",
    modules: [
      {
        id: "legal-governance",
        name: "Legal & Governance",
        icon: "gavel",
        pages: [
          { name: "Policy Management",  path: "/admin/legal/policies",    iconText: "PM" },
          { name: "Compliance Tracker", path: "/admin/legal/compliance",  iconText: "CT" },
          { name: "Bonds & Contracts",  path: "/admin/legal/contracts",   iconText: "BC" },
          { name: "Grievance Queue",    path: "/admin/grievance/queue",   iconText: "GQ" }
        ]
      }
    ]
  },
  {
    id: "academics-ops",
    name: "Academics",
    icon: "school",
    type: "section",
    modules: [
      {
        id: "academic-research",
        name: "Academic & Research",
        icon: "school",
        pages: [
          { name: "Committee Mgmt",   path: "/admin/academic/committees", iconText: "CM" },
          { name: "PBAS Review",      path: "/admin/research/pbas",       iconText: "PB" },
          { name: "Grants & Projects",path: "/admin/research/grants",     iconText: "GP" }
        ]
      },
      {
        id: "logistics-admin",
        name: "Logistics",
        icon: "business",
        pages: [
          { name: "Asset Management",    path: "/admin/logistics/assets",      iconText: "AM" },
          { name: "Room Bookings",       path: "/admin/logistics/bookings",     iconText: "RB" },
          { name: "Maintenance Tracker", path: "/admin/logistics/maintenance",  iconText: "MT" }
        ]
      }
    ]
  },
  {
    id: "insights-settings",
    name: "Insights",
    icon: "assessment",
    type: "section",
    modules: [
      {
        id: "reports-comms",
        name: "Reports & Comms",
        icon: "bar_chart",
        pages: [
          { name: "Reports & Analytics", path: "/admin/reports",                          iconText: "RA" },
          { name: "Notifications",       path: "/admin/communication/announcements",       iconText: "NO" }
        ]
      },
      {
        id: "system-settings",
        name: "System Settings",
        icon: "settings",
        pages: [
          { name: "Admin Roles",      path: "/admin/settings/rbac",            iconText: "AR" },
          { name: "Email Templates",  path: "/admin/communication/templates",  iconText: "ET" }
        ]
      }
    ]
  }
];

export default adminNavigations;
