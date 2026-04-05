// ─── TRANSPORT ADMIN NAVIGATION ──────────────────────────────────────────────
// Fleet, routes, drivers, bus passes, live tracking, and reports
// 4 sections · 7 modules · 17 pages

export const transportAdminNavigations = [
  {
    id: "ta-home",
    name: "Dashboard",
    icon: "dashboard",
    path: "/transport/dashboard",
    type: "item"
  },

  // ── FLEET & ROUTES ────────────────────────────────────────────────────────
  {
    id: "ta-fleet-routes",
    name: "Fleet & Routes",
    icon: "directions_bus",
    type: "section",
    modules: [
      {
        id: "ta-bus-fleet",
        name: "Bus Fleet",
        icon: "directions_bus",
        pages: [
          { name: "Vehicle Registry",    path: "/transport/fleet/registry",       iconText: "VR" },
          { name: "Maintenance Schedule",path: "/transport/fleet/maintenance",     iconText: "MS", badge: "new" },
          { name: "Fuel Management",     path: "/transport/fleet/fuel",           iconText: "FM", badge: "new" }
        ]
      },
      {
        id: "ta-routes-schedules",
        name: "Routes & Schedules",
        icon: "route",
        pages: [
          { name: "Route Management",     path: "/transport/routes/management",  iconText: "RM" },
          { name: "Schedule Management",  path: "/transport/routes/schedules",   iconText: "SM", badge: "new" },
          { name: "Route Deviation Alerts",path: "/transport/routes/alerts",     iconText: "RD", badge: "new" }
        ]
      }
    ]
  },

  // ── DRIVERS & PASSES ─────────────────────────────────────────────────────
  {
    id: "ta-drivers-passes",
    name: "Drivers & Passes",
    icon: "badge",
    type: "section",
    modules: [
      {
        id: "ta-driver-mgmt",
        name: "Driver Management",
        icon: "person",
        pages: [
          { name: "Driver Profiles",  path: "/transport/drivers/profiles",   iconText: "DP" },
          { name: "Driver Attendance",path: "/transport/drivers/attendance", iconText: "DA", badge: "new" },
          { name: "Incident Reports", path: "/transport/drivers/incidents",  iconText: "IR", badge: "new" }
        ]
      },
      {
        id: "ta-bus-pass",
        name: "Bus Pass Management",
        icon: "card_membership",
        pages: [
          { name: "Student Bus Passes", path: "/transport/passes/students", iconText: "SP" },
          { name: "Faculty Bus Passes", path: "/transport/passes/faculty",  iconText: "FP", badge: "new" },
          { name: "Pass Revenue",       path: "/transport/passes/revenue",  iconText: "PR", badge: "new" }
        ]
      }
    ]
  },

  // ── TRACKING & REPORTS ────────────────────────────────────────────────────
  {
    id: "ta-tracking-reports",
    name: "Tracking",
    icon: "gps_fixed",
    type: "section",
    modules: [
      {
        id: "ta-live-tracking",
        name: "Live Tracking",
        icon: "gps_fixed",
        pages: [
          { name: "GPS Live Map", path: "/transport/tracking/live", iconText: "GL" },
          { name: "ETA Board",    path: "/transport/tracking/eta",  iconText: "EB", badge: "new" }
        ]
      },
      {
        id: "ta-reports",
        name: "Reports",
        icon: "bar_chart",
        pages: [
          { name: "Route Efficiency Reports",path: "/transport/reports/routes",  iconText: "RE", badge: "new" },
          { name: "Driver Performance",      path: "/transport/reports/drivers", iconText: "DP", badge: "new" }
        ]
      }
    ]
  }
];

export default transportAdminNavigations;
