const navigations = [
  { name: "Dashboard", path: "/dashboard/default", icon: "dashboard" },
  
  { label: "ADMINISTRATION", type: "label" },
  {
    name: "HR & Profile",
    icon: "person",
    children: [
      { name: "My Service Book", path: "/hr/profile", iconText: "SB" },
      { name: "Leave Application", path: "/hr/leave", iconText: "LA" },
      { name: "Payroll & Tax", path: "/hr/payroll", iconText: "PT" }
    ]
  },
  {
    name: "Research & API",
    icon: "school", // Material UI icon name
    children: [
      { name: "Publications", path: "/research/publications", iconText: "PB" },
      { name: "Grants & Projects", path: "/research/grants", iconText: "GP" },
      { name: "Appraisal (PBAS)", path: "/research/appraisal", iconText: "AP" }
    ]
  },
  {
    name: "Logistics",
    icon: "inventory",
    children: [
      { name: "Asset Management", path: "/logistics/assets", iconText: "AM" },
      { name: "Room Booking", path: "/logistics/booking", iconText: "RB" }
    ]
  }
];

export default navigations;