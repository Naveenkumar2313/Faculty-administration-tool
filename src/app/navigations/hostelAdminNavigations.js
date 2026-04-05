// ─── HOSTEL ADMIN NAVIGATION ─────────────────────────────────────────────────
// Hostel-specific: room management, attendance, mess, complaints, finance
// 4 sections · 7 modules · 18 pages

export const hostelAdminNavigations = [
  {
    id: "ha-home",
    name: "Dashboard",
    icon: "dashboard",
    path: "/hostel/dashboard",
    type: "item"
  },

  // ── RESIDENT MANAGEMENT ───────────────────────────────────────────────────
  {
    id: "ha-residents",
    name: "Residents",
    icon: "people",
    type: "section",
    modules: [
      {
        id: "ha-room-allocation",
        name: "Room & Allocation",
        icon: "meeting_room",
        pages: [
          { name: "Room Allocations",  path: "/hostel/rooms/allocations",  iconText: "RA" },
          { name: "Resident Directory",path: "/hostel/rooms/directory",    iconText: "RD", badge: "new" },
          { name: "Occupancy Status",  path: "/hostel/rooms/occupancy",    iconText: "OS", badge: "new" }
        ]
      },
      {
        id: "ha-entry-attendance",
        name: "Entry & Attendance",
        icon: "how_to_reg",
        pages: [
          { name: "Entry & Exit Log",    path: "/hostel/attendance/entry-exit",  iconText: "EE" },
          { name: "Nightly Attendance",  path: "/hostel/attendance/nightly",     iconText: "NA" },
          { name: "Late Entry Requests", path: "/hostel/attendance/late-entry",  iconText: "LE", badge: "new" }
        ]
      }
    ]
  },

  // ── FACILITIES ────────────────────────────────────────────────────────────
  {
    id: "ha-facilities",
    name: "Facilities",
    icon: "restaurant",
    type: "section",
    modules: [
      {
        id: "ha-mess",
        name: "Mess Management",
        icon: "restaurant_menu",
        pages: [
          { name: "Meal Plans",       path: "/hostel/mess/meal-plans",  iconText: "MP" },
          { name: "Daily Menu",       path: "/hostel/mess/daily-menu",  iconText: "DM", badge: "new" },
          { name: "Food Inventory",   path: "/hostel/mess/inventory",   iconText: "FI" },
          { name: "Resident Feedback",path: "/hostel/mess/feedback",    iconText: "RF", badge: "new" }
        ]
      },
      {
        id: "ha-complaints",
        name: "Complaints & Maintenance",
        icon: "report_problem",
        pages: [
          { name: "Complaints Inbox",       path: "/hostel/complaints/inbox",     iconText: "CI" },
          { name: "Escalate to Maintenance",path: "/hostel/complaints/escalate",  iconText: "EM", badge: "new" },
          { name: "Resolved Complaints",    path: "/hostel/complaints/resolved",  iconText: "RC", badge: "new" }
        ]
      }
    ]
  },

  // ── FINANCE & REPORTS ─────────────────────────────────────────────────────
  {
    id: "ha-finance-reports",
    name: "Finance",
    icon: "account_balance",
    type: "section",
    modules: [
      {
        id: "ha-fees",
        name: "Fees & Finance",
        icon: "payments",
        pages: [
          { name: "Fee Collection", path: "/hostel/finance/collection", iconText: "FC", badge: "new" },
          { name: "Fee Receipts",   path: "/hostel/finance/receipts",   iconText: "FR", badge: "new" }
        ]
      },
      {
        id: "ha-reports",
        name: "Reports",
        icon: "bar_chart",
        pages: [
          { name: "Occupancy Reports",  path: "/hostel/reports/occupancy",  iconText: "OR", badge: "new" },
          { name: "Attendance Reports", path: "/hostel/reports/attendance", iconText: "AR", badge: "new" }
        ]
      }
    ]
  }
];

export default hostelAdminNavigations;
