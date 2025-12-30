const navigations = [
  { name: "Dashboard", path: "/dashboard/default", icon: "dashboard" },
  
  { label: "ADMINISTRATION", type: "label" },
  {
    name: "HR & Attendance",
    icon: "person",
    children: [
      { name: "My Service Book", path: "/hr/profile", iconText: "SB" },
      { name: "Attendance Logs", path: "/attendance/logs", iconText: "AT" },
      { name: "Leave Application", path: "/hr/leave", iconText: "LA" },
      { name: "Payroll & Tax", path: "/hr/payroll", iconText: "PT" }
    ]
  },
  {
    name: "Legal & Governance",
    icon: "gavel", 
    children: [
      { name: "Policies & Compliance", path: "/governance/policies", iconText: "PC" },
      { name: "Contracts & Bonds", path: "/legal/contracts", iconText: "CB" },
      { name: "Grievance Redressal", path: "/grievance/submit", iconText: "GR" },
    ]
  },
  {
    name: "Finance",
    icon: "attach_money",
    children: [
      { name: "Reimbursements", path: "/finance/claims", iconText: "RC" },
    ]
  },
  {
    name: "Academic Roles",
    icon: "school",
    children: [
      { name: "External Engagement", path: "/engagement/portfolio", iconText: "EE" },
      { name: "Committee Meetings", path: "/committee/meetings", iconText: "CM" },
    ]
  },
  {
    name: "Research & API",
    icon: "biotech",
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