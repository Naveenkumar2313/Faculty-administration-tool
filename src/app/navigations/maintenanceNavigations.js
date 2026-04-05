// ─── MAINTENANCE STAFF NAVIGATION ────────────────────────────────────────────
// Assigned work orders, attendance, leave, and material requests
// 1 section · 4 modules · 8 pages

export const maintenanceNavigations = [
  {
    id: "ms-home",
    name: "Dashboard",
    icon: "dashboard",
    path: "/maintenance/dashboard",
    type: "item"
  },

  // ── MY WORK PORTAL ────────────────────────────────────────────────────────
  {
    id: "ms-portal",
    name: "My Work",
    icon: "build",
    type: "section",
    modules: [
      {
        id: "ms-work-orders",
        name: "Work Orders",
        icon: "assignment",
        pages: [
          { name: "My Work Orders",       path: "/maintenance/work/orders",   iconText: "WO" },
          { name: "Update Work Status",   path: "/maintenance/work/update",   iconText: "UW", badge: "new" },
          { name: "Completed Work History",path: "/maintenance/work/history", iconText: "CW", badge: "new" }
        ]
      },
      {
        id: "ms-attendance-leave",
        name: "Attendance & Leave",
        icon: "how_to_reg",
        pages: [
          { name: "Mark Attendance",  path: "/maintenance/attendance/mark",  iconText: "MA", badge: "new" },
          { name: "Leave Application",path: "/maintenance/attendance/leave", iconText: "LA", badge: "new" }
        ]
      },
      {
        id: "ms-inventory",
        name: "Inventory Access",
        icon: "inventory",
        pages: [
          { name: "Request Materials", path: "/maintenance/inventory/request", iconText: "RM", badge: "new" },
          { name: "My Material Log",   path: "/maintenance/inventory/log",     iconText: "ML", badge: "new" }
        ]
      }
    ]
  }
];

export default maintenanceNavigations;
