// Faculty navigation — hierarchical format
// Structure: type:"item" → direct NavLink on icon rail
//            type:"section" → section on rail, modules+pages expand in panel
export const navigations = [
  {
    id: "home",
    name: "Dashboard",
    icon: "dashboard",
    path: "/dashboard/default",
    type: "item"
  },
  {
    id: "administration",
    name: "Admin",
    icon: "manage_accounts",
    type: "section",
    modules: [
      {
        id: "hr-attendance",
        name: "HR & Attendance",
        icon: "person",
        pages: [
          { name: "My Service Book",   path: "/hr/profile",       iconText: "SB" },
          { name: "Attendance Logs",   path: "/attendance/logs",  iconText: "AT" },
          { name: "Leave Application", path: "/hr/leave",         iconText: "LA" },
          { name: "Payroll & Tax",     path: "/hr/payroll",       iconText: "PT" }
        ]
      },
      {
        id: "legal-governance",
        name: "Legal & Governance",
        icon: "gavel",
        pages: [
          { name: "Policies & Compliance", path: "/governance/policies", iconText: "PC" },
          { name: "Contracts & Bonds",     path: "/legal/contracts",     iconText: "CB" },
          { name: "Grievance Redressal",   path: "/grievance/submit",    iconText: "GR" }
        ]
      },
      {
        id: "finance",
        name: "Finance",
        icon: "attach_money",
        pages: [
          { name: "Reimbursements", path: "/finance/claims", iconText: "RC" }
        ]
      }
    ]
  },
  {
    id: "academics",
    name: "Academics",
    icon: "school",
    type: "section",
    modules: [
      {
        id: "academic-roles",
        name: "Academic Roles",
        icon: "school",
        pages: [
          { name: "External Engagement", path: "/engagement/portfolio", iconText: "EE" },
          { name: "Committee Meetings",  path: "/committee/meetings",   iconText: "CM" }
        ]
      },
      {
        id: "research",
        name: "Research & API",
        icon: "biotech",
        pages: [
          { name: "Publications",     path: "/research/publications", iconText: "PB" },
          { name: "Grants & Projects",path: "/research/grants",       iconText: "GP" },
          { name: "Appraisal (PBAS)", path: "/research/appraisal",   iconText: "AP" }
        ]
      }
    ]
  },
  {
    id: "logistics",
    name: "Logistics",
    icon: "inventory",
    type: "section",
    modules: [
      {
        id: "assets-rooms",
        name: "Assets & Rooms",
        icon: "business",
        pages: [
          { name: "Asset Management", path: "/logistics/assets",  iconText: "AM" },
          { name: "Room Booking",     path: "/logistics/booking", iconText: "RB" }
        ]
      }
    ]
  }
];

export default navigations;
