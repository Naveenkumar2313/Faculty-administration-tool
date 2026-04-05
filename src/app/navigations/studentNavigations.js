// ─── STUDENT NAVIGATION ──────────────────────────────────────────────────────
// Hostel self-service, transport pass, bus tracking, facility booking, noticeboard
// 4 sections · 8 modules · 17 pages

export const studentNavigations = [
  {
    id: "st-home",
    name: "Dashboard",
    icon: "dashboard",
    path: "/student/dashboard",
    type: "item"
  },

  // ── HOSTEL ────────────────────────────────────────────────────────────────
  {
    id: "st-hostel",
    name: "Hostel",
    icon: "hotel",
    type: "section",
    modules: [
      {
        id: "st-my-hostel",
        name: "My Hostel",
        icon: "meeting_room",
        pages: [
          { name: "My Room Details",  path: "/student/hostel/room",        iconText: "MR", badge: "new" },
          { name: "Entry / Exit Pass",path: "/student/hostel/exit-pass",   iconText: "EP", badge: "new" },
          { name: "Attendance Record",path: "/student/hostel/attendance",  iconText: "AR", badge: "new" }
        ]
      },
      {
        id: "st-mess-food",
        name: "Mess & Food",
        icon: "restaurant",
        pages: [
          { name: "Mess Menu",          path: "/student/mess/menu",     iconText: "MM", badge: "new" },
          { name: "Meal Plan",          path: "/student/mess/plan",     iconText: "MP", badge: "new" },
          { name: "Submit Mess Feedback",path: "/student/mess/feedback",iconText: "MF", badge: "new" }
        ]
      },
      {
        id: "st-complaints",
        name: "Complaints",
        icon: "report_problem",
        pages: [
          { name: "Raise a Complaint", path: "/student/complaints/raise", iconText: "RC", badge: "new" },
          { name: "My Complaints",     path: "/student/complaints/mine",  iconText: "MC", badge: "new" }
        ]
      }
    ]
  },

  // ── TRANSPORT ─────────────────────────────────────────────────────────────
  {
    id: "st-transport",
    name: "Transport",
    icon: "directions_bus",
    type: "section",
    modules: [
      {
        id: "st-bus-travel",
        name: "Bus & Travel",
        icon: "directions_bus",
        pages: [
          { name: "My Bus Pass",        path: "/student/transport/pass",        iconText: "BP", badge: "new" },
          { name: "Apply / Renew Pass", path: "/student/transport/apply",       iconText: "AP", badge: "new" },
          { name: "Live Bus Tracking",  path: "/student/transport/tracking",    iconText: "LT", badge: "new" },
          { name: "Route & Schedule",   path: "/student/transport/route",       iconText: "RS", badge: "new" }
        ]
      }
    ]
  },

  // ── CAMPUS ────────────────────────────────────────────────────────────────
  {
    id: "st-campus",
    name: "Campus",
    icon: "apartment",
    type: "section",
    modules: [
      {
        id: "st-facilities",
        name: "Facilities & Booking",
        icon: "event_available",
        pages: [
          { name: "Book a Room / Lab", path: "/student/bookings/book", iconText: "BR", badge: "new" },
          { name: "My Bookings",       path: "/student/bookings/mine", iconText: "MB", badge: "new" }
        ]
      },
      {
        id: "st-parking",
        name: "Parking",
        icon: "local_parking",
        pages: [
          { name: "My Parking Pass", path: "/student/parking/pass", iconText: "PP", badge: "new" }
        ]
      },
      {
        id: "st-noticeboard",
        name: "Noticeboard",
        icon: "campaign",
        pages: [
          { name: "Announcements", path: "/student/announcements", iconText: "AN", badge: "new" }
        ]
      }
    ]
  }
];

export default studentNavigations;
