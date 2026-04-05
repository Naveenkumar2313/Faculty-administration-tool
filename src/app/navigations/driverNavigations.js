// ─── DRIVER NAVIGATION ───────────────────────────────────────────────────────
// Personal schedule, attendance, incident reporting, and fuel logs
// 1 section · 4 modules · 9 pages

export const driverNavigations = [
  {
    id: "dr-home",
    name: "Dashboard",
    icon: "dashboard",
    path: "/driver/dashboard",
    type: "item"
  },

  // ── MY PORTAL ─────────────────────────────────────────────────────────────
  {
    id: "dr-portal",
    name: "My Portal",
    icon: "directions_bus",
    type: "section",
    modules: [
      {
        id: "dr-routes-schedule",
        name: "My Routes & Schedule",
        icon: "route",
        pages: [
          { name: "Today's Schedule", path: "/driver/schedule/today",   iconText: "TS", badge: "new" },
          { name: "Route Map",        path: "/driver/schedule/map",     iconText: "RM", badge: "new" },
          { name: "Trip History",     path: "/driver/schedule/history", iconText: "TH", badge: "new" }
        ]
      },
      {
        id: "dr-attendance-leave",
        name: "Attendance & Leave",
        icon: "how_to_reg",
        pages: [
          { name: "Mark Attendance",  path: "/driver/attendance/mark",  iconText: "MA", badge: "new" },
          { name: "Leave Application",path: "/driver/attendance/leave", iconText: "LA", badge: "new" }
        ]
      },
      {
        id: "dr-reporting",
        name: "Reporting",
        icon: "report",
        pages: [
          { name: "Incident Report",      path: "/driver/reports/incident",   iconText: "IR", badge: "new" },
          { name: "Fuel Log",             path: "/driver/reports/fuel",       iconText: "FL", badge: "new" },
          { name: "Bus Condition Report", path: "/driver/reports/condition",  iconText: "BC", badge: "new" }
        ]
      }
    ]
  }
];

export default driverNavigations;
