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
    name: "Campus CIMS",
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
          { name: "Laboratories", path: "/cims/campus/laboratories", iconText: "LB" },
          { name: "Auditoriums", path: "/cims/campus/auditoriums", iconText: "AU" },
          { name: "Seminar Halls", path: "/cims/campus/seminar-halls", iconText: "SH" },
          { name: "Other Facilities", path: "/cims/campus/facilities", iconText: "OF" },
          { name: "Campus Digital Twin", path: "/cims/campus/digital-twin", iconText: "DT" }
        ]
      },
      {
        id: "sa-booking-mgmt",
        name: "Booking Management",
        icon: "event_available",
        pages: [
          { name: "Room Booking", path: "/cims/bookings/rooms", iconText: "RB" },
          { name: "Lab Booking", path: "/cims/bookings/labs", iconText: "LB" },
          { name: "Auditorium Booking", path: "/cims/bookings/auditoriums", iconText: "AB" },
          { name: "Calendar View", path: "/cims/bookings/calendar", iconText: "CV" },
          { name: "Other Bookings", path: "/cims/bookings/other", iconText: "OB" }
        ]
      },
      {
        id: "sa-hostel-mgmt",
        name: "Hostel Management",
        icon: "hotel",
        pages: [
          { name: "Hostel Overview", path: "/cims/hostel/overview", iconText: "HO" },
          { name: "Boys Hostel", path: "/cims/hostel/boys", iconText: "BH" },
          { name: "Girls Hostel", path: "/cims/hostel/girls", iconText: "GH" },
          { name: "Entry & Exit", path: "/cims/hostel/entry-exit", iconText: "EE" },
          { name: "Hostel Attendance", path: "/cims/hostel/attendance", iconText: "HA" },
          { name: "Mess Management", path: "/cims/hostel/mess", iconText: "MM" },
          { name: "Hostel Complaints", path: "/cims/hostel/complaints", iconText: "HC" }
        ]
      },
      {
        id: "sa-transport",
        name: "Transportation",
        icon: "directions_bus",
        pages: [
          { name: "Bus Fleet", path: "/cims/transport/fleet", iconText: "BF" },
          { name: "Routes", path: "/cims/transport/routes", iconText: "RT" },
          { name: "Driver Management", path: "/cims/transport/drivers", iconText: "DM" },
          { name: "Student Bus Pass", path: "/cims/transport/bus-pass", iconText: "BP" },
          { name: "Live Tracking", path: "/cims/transport/tracking", iconText: "LT" }
        ]
      },
      {
        id: "sa-parking",
        name: "Parking",
        icon: "local_parking",
        pages: [
          { name: "Parking Management", path: "/cims/parking/management", iconText: "PM" },
          { name: "Parking Passes", path: "/cims/parking/passes", iconText: "PP" },
          { name: "Main Gate Entry/Exit", path: "/cims/parking/gate", iconText: "GE" }
        ]
      },
      {
        id: "sa-maintenance",
        name: "Maintenance",
        icon: "build",
        pages: [
          { name: "Maintenance Requests", path: "/cims/maintenance/requests", iconText: "MR" },
          { name: "Work Orders", path: "/cims/maintenance/work-orders", iconText: "WO" },
          { name: "Staff Assignment", path: "/cims/maintenance/assignment", iconText: "SA" }
        ]
      },
      {
        id: "sa-assets",
        name: "Asset Management",
        icon: "inventory_2",
        pages: [
          { name: "Equipment", path: "/cims/assets/equipment", iconText: "EQ" },
          { name: "Furniture", path: "/cims/assets/furniture", iconText: "FU" },
          { name: "Inventory", path: "/cims/assets/inventory", iconText: "IN" },
          { name: "Faculty Assets", path: "/cims/assets/faculty", iconText: "FA" }
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
          { name: "HR Reports", path: "/admin/reports/hr", iconText: "HR" },
          { name: "Finance Reports", path: "/admin/reports/finance", iconText: "FR" },
          { name: "Infrastructure Reports", path: "/admin/reports/infrastructure", iconText: "IR" },
          { name: "Academic Reports", path: "/admin/reports/academic", iconText: "AR" },
          { name: "Custom Report Builder", path: "/admin/reports/custom", iconText: "CR", badge: "new" }
        ]
      },
      {
        id: "sa-notifications",
        name: "Notifications",
        icon: "campaign",
        pages: [
          { name: "Broadcast Announcements", path: "/admin/communication/announcements", iconText: "BA" },
          { name: "Notification History", path: "/admin/communication/history", iconText: "NH" }
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
