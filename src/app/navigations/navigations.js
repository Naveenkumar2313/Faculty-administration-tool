// ─── FACULTY NAVIGATION ───────────────────────────────────────────────────────
// Faculty self-service: HR, payroll, academic, and CIMS features
// 5 sections · 11 modules · 24 pages

export const navigations = [
  {
    id: "fac-home",
    name: "Dashboard",
    icon: "dashboard",
    path: "/dashboard/default",
    type: "item"
  },

  // ── HR & PAYROLL ──────────────────────────────────────────────────────────
  {
    id: "fac-hr-payroll",
    name: "HR & Pay",
    icon: "person",
    type: "section",
    modules: [
      {
        id: "fac-my-profile",
        name: "My Profile & HR",
        icon: "badge",
        pages: [
          { name: "My Service Book", path: "/hr/profile", iconText: "SB" },
          { name: "Attendance Logs", path: "/attendance/logs", iconText: "AT" },
          { name: "Leave Application", path: "/hr/leave", iconText: "LA" },
          { name: "Payroll & Tax", path: "/hr/payroll", iconText: "PT" }
        ]
      },
      {
        id: "fac-finance",
        name: "Finance",
        icon: "attach_money",
        pages: [
          { name: "Reimbursements", path: "/finance/claims", iconText: "RC" }
        ]
      },
      {
        id: "fac-legal",
        name: "Legal & Governance",
        icon: "gavel",
        pages: [
          { name: "Policies & Compliance", path: "/governance/policies", iconText: "PC" },
          { name: "Contracts & Bonds", path: "/legal/contracts", iconText: "CB" },
          { name: "Grievance Redressal", path: "/grievance/submit", iconText: "GR" }
        ]
      }
    ]
  },

  // ── ACADEMIC & RESEARCH ───────────────────────────────────────────────────
  {
    id: "fac-academic",
    name: "Academics",
    icon: "school",
    type: "section",
    modules: [
      {
        id: "fac-academic-roles",
        name: "Academic Roles",
        icon: "groups",
        pages: [
          { name: "External Engagement", path: "/engagement/portfolio", iconText: "EE" },
          { name: "Committee Meetings", path: "/committee/meetings", iconText: "CM" }
        ]
      },
      {
        id: "fac-research",
        name: "Research & Appraisal",
        icon: "biotech",
        pages: [
          { name: "Publications", path: "/research/publications", iconText: "PB" },
          { name: "Grants & Projects", path: "/research/grants", iconText: "GP" },
          { name: "Appraisal (PBAS)", path: "/research/appraisal", iconText: "AP" }
        ]
      }
    ]
  },

  // ── CAMPUS & LOGISTICS ────────────────────────────────────────────────────
  {
    id: "fac-campus",
    name: "Campus",
    icon: "apartment",
    type: "section",
    modules: [
      {
        id: "fac-my-assets",
        name: "My Assets",
        icon: "inventory_2",
        pages: [
          { name: "Assigned Assets", path: "/logistics/assets", iconText: "AA" },
          { name: "Request Equipment", path: "/faculty/assets/request", iconText: "RE", badge: "new" }
        ]
      },
      {
        id: "fac-room-booking",
        name: "Room & Space Booking",
        icon: "event_available",
        pages: [
          { name: "Book a Room / Lab", path: "/faculty/bookings/book", iconText: "BR" }
        ]
      },
      {
        id: "fac-parking",
        name: "Parking",
        icon: "local_parking",
        pages: [
          { name: "My Parking Pass", path: "/faculty/parking/pass", iconText: "PP", badge: "new" },
          { name: "Parking Availability", path: "/faculty/parking/availability", iconText: "PA", badge: "new" }
        ]
      }
    ]
  },

  // ── CAMPUS INFO ───────────────────────────────────────────────────────────
  {
    id: "fac-info",
    name: "Info",
    icon: "notifications",
    type: "section",
    modules: [
      {
        id: "fac-announcements",
        name: "Announcements",
        icon: "campaign",
        pages: [
          { name: "Noticeboard", path: "/faculty/announcements/noticeboard", iconText: "NB", badge: "new" }
        ]
      }
    ]
  }
];

export default navigations;
