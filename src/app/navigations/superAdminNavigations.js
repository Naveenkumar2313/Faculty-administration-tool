// ─── SUPER ADMIN NAVIGATION ──────────────────────────────────────────────────
// Full access: Faculty Administration + Campus Infrastructure (CIMS)
// 4 sections · 16 modules · 65 pages

export const superAdminNavigations = [
  {
    id: "sa-home",
    name: "Dashboard",
    icon: "dashboard",
    path: "/admin/dashboard",
    type: "item"
  },

  // ── FACULTY ADMINISTRATION ─────────────────────────────────────────────────
  {
    id: "sa-faculty-admin",
    name: "Faculty Admin",
    icon: "manage_accounts",
    type: "section",
    modules: [
      {
        id: "sa-faculty-mgmt",
        name: "Faculty Management",
        icon: "badge",
        pages: [
          { name: "All Faculty", path: "/admin/faculty/all", iconText: "AF" },
          { name: "Add New Faculty", path: "/admin/hr/onboarding", iconText: "NF" },
          { name: "Probation Tracker", path: "/admin/hr/probation", iconText: "PT" },
          { name: "Promotions & Increments", path: "/admin/faculty/promotions", iconText: "PI" },
          { name: "Transfers & Exits", path: "/admin/faculty/transfers", iconText: "TE" }
        ]
      },
      {
        id: "sa-attendance-leave",
        name: "Attendance & Leave",
        icon: "date_range",
        pages: [
          { name: "Attendance Monitor", path: "/admin/attendance/monitor", iconText: "AM" },
          { name: "Leave Approvals", path: "/admin/hr/leaves", iconText: "LA" },
          { name: "Regularization Queue", path: "/admin/attendance/regularization", iconText: "RQ" }
        ]
      },
      {
        id: "sa-payroll-finance",
        name: "Payroll & Finance",
        icon: "attach_money",
        pages: [
          { name: "Salary Processing", path: "/admin/finance/payroll", iconText: "SP" },
          { name: "Reimbursement Queue", path: "/admin/finance/claims", iconText: "RQ" },
          { name: "Loan Management", path: "/admin/finance/loans", iconText: "LM" }
        ]
      },
      {
        id: "sa-legal",
        name: "Legal & Governance",
        icon: "gavel",
        pages: [
          { name: "Policy Management", path: "/admin/legal/policies", iconText: "PM" },
          { name: "Compliance Tracker", path: "/admin/legal/compliance", iconText: "CT" },
          { name: "Bonds & Contracts", path: "/admin/legal/contracts", iconText: "BC" },
          { name: "Grievance Queue", path: "/admin/grievance/queue", iconText: "GQ" }
        ]
      },
      {
        id: "sa-academic-research",
        name: "Academic & Research",
        icon: "school",
        pages: [
          { name: "Committee Management", path: "/admin/academic/committees", iconText: "CM" },
          { name: "PBAS Review", path: "/admin/research/pbas", iconText: "PB" },
          { name: "Grants & Projects", path: "/admin/research/grants", iconText: "GP" }
        ]
      }
    ]
  },

  // ── CAMPUS INFRASTRUCTURE (CIMS) ──────────────────────────────────────────
  {
    id: "sa-cims",
    name: "CIMS",
    icon: "domain",
    type: "section",
    modules: [
      {
        id: "sa-campus-mgmt",
        name: "Campus Management",
        icon: "apartment",
        pages: [
          { name: "Buildings", path: "/admin/CIMS/buildings", iconText: "BL" },
          { name: "Classrooms", path: "/admin/CIMS/classrooms", iconText: "CR" },
          { name: "Laboratories", path: "/admin/CIMS/laboratories", iconText: "LB" },
          { name: "Auditoriums", path: "/admin/CIMS/auditoriums", iconText: "AU" },
          { name: "Seminar Halls", path: "/admin/CIMS/seminar-halls", iconText: "SH" },
          { name: "Other Facilities", path: "/admin/CIMS/custom-infrastructure", iconText: "OF" },
          { name: "Campus Digital Twin", path: "/admin/CIMS/campus-digital-twin", iconText: "DT" }
        ]
      },
      {
        id: "sa-booking-mgmt",
        name: "Booking Management",
        icon: "event_available",
        pages: [
          { name: "Room Booking", path: "/admin/CIMS/room-booking", iconText: "RB" },
          { name: "Lab Booking", path: "/admin/CIMS/lab-booking", iconText: "LB" },
          { name: "Auditorium Booking", path: "/admin/CIMS/auditorium-booking", iconText: "AB" },
          { name: "Calendar View", path: "/admin/CIMS/calendar-booking", iconText: "CV" },
          { name: "Other Bookings", path: "/admin/CIMS/custom-booking", iconText: "OB" }
        ]
      },
      {
        id: "sa-hostel-mgmt",
        name: "Hostel Management",
        icon: "hotel",
        pages: [
          { name: "Hostel Overview", path: "/admin/CIMS/hostel-overview", iconText: "HO" },
          { name: "Boys Hostel", path: "/admin/CIMS/boys-hostel", iconText: "BH" },
          { name: "Girls Hostel", path: "/admin/CIMS/girls-hostel", iconText: "GH" },
          { name: "Entry & Exit", path: "/admin/CIMS/hostel-entry-exit", iconText: "EE" },
          { name: "Hostel Attendance", path: "/admin/CIMS/hostel-attendance", iconText: "HA" },
          { name: "Mess Management", path: "/admin/CIMS/hostel-mess", iconText: "MM" },
          { name: "Hostel Complaints", path: "/admin/CIMS/hostel-complaints", iconText: "HC" }
        ]
      },
      {
        id: "sa-transport",
        name: "Transportation",
        icon: "directions_bus",
        pages: [
          { name: "Bus Fleet", path: "/admin/CIMS/transport/fleet", iconText: "BF" },
          { name: "Routes", path: "/admin/CIMS/transport/routes", iconText: "RT" },
          { name: "Driver Management", path: "/admin/CIMS/transport/drivers", iconText: "DM" },
          { name: "Student Bus Pass", path: "/admin/CIMS/transport/passes", iconText: "BP" },
          { name: "Live Tracking", path: "/admin/CIMS/transport/tracking", iconText: "LT" }
        ]
      },
      {
        id: "sa-parking",
        name: "Parking",
        icon: "local_parking",
        pages: [
          { name: "Parking Management", path: "/admin/CIMS/parking/management", iconText: "PM" },
          { name: "Parking Passes", path: "/admin/CIMS/parking/passes", iconText: "PP" },
          { name: "Main Gate Entry/Exit", path: "/admin/CIMS/parking/gate-management", iconText: "GE" }
        ]
      },
      {
        id: "sa-maintenance",
        name: "Maintenance",
        icon: "build",
        pages: [
          { name: "Maintenance Requests", path: "/admin/CIMS/maintenance/requests", iconText: "MR" },
          { name: "Work Orders", path: "/admin/CIMS/maintenance/work-orders", iconText: "WO" },
          { name: "Staff Assignment", path: "/admin/CIMS/maintenance/staff-assignment", iconText: "SA" }
        ]
      },
      {
        id: "sa-assets",
        name: "Asset Management",
        icon: "inventory_2",
        pages: [
          { name: "Equipment", path: "/admin/CIMS/asset-management/equipment", iconText: "EQ" },
          { name: "Furniture", path: "/admin/CIMS/asset-management/furniture", iconText: "FU" },
          { name: "Inventory", path: "/admin/CIMS/asset-management/inventory", iconText: "IN" },
          { name: "Faculty Assets", path: "/admin/logistics/assets", iconText: "FA" }
        ]
      }
    ]
  },

  // ── INSIGHTS & SYSTEM ─────────────────────────────────────────────────────
  {
    id: "sa-insights",
    name: "Insights",
    icon: "assessment",
    type: "section",
    modules: [
      {
        id: "sa-reports",
        name: "Reports & Analytics",
        icon: "bar_chart",
        pages: [
          { name: "Report Generation Engine", path: "/admin/reports/ReportsView", iconText: "RGE" },
          { name: "Custom Report Builder", path: "/admin/reports/custom", iconText: "CR", badge: "new" }
        ]
      },
      {
        id: "sa-notifications",
        name: "Notifications",
        icon: "campaign",
        pages: [
          { name: "Broadcast Announcements", path: "/admin/communication/announcements", iconText: "BA" },
          { name: "Notification History", path: "/admin/insights/notification-history", iconText: "NH" }
        ]
      },
      {
        id: "sa-settings",
        name: "System Settings",
        icon: "settings",
        pages: [
          { name: "Admin Roles (RBAC)", path: "/admin/settings/rbac", iconText: "AR" },
          { name: "Email Templates", path: "/admin/communication/templates", iconText: "ET" },
          { name: "Device Logins", path: "/admin/settings/device-logins", iconText: "DL" },
          { name: "Integration Settings", path: "/admin/settings/integrations", iconText: "IS", badge: "new" }
        ]
      }
    ]
  }
];

export default superAdminNavigations;
