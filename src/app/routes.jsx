import { lazy } from "react";
import { Navigate } from "react-router-dom";
import ParcLayout from "./components/ParcLayout/ParcLayout";
import DefaultDashboard from "./views/dashboard/DefaultDashboard";

// --- EXISTING VIEWS ---
const ProfileView = lazy(() => import("./views/hr/ProfileView"));
const LeaveAppView = lazy(() => import("./views/hr/LeaveAppView"));
const PublicationView = lazy(() => import("./views/research/PublicationView"));
const GrantsView = lazy(() => import("./views/research/GrantsView"));
const AppraisalView = lazy(() => import("./views/research/AppraisalView"));
const PayrollView = lazy(() => import("./views/hr/PayrollView"));
const AssetView = lazy(() => import("./views/logistics/AssetView"));
const RoomBookingView = lazy(() => import("./views/logistics/RoomBookingView"));

// --- NEW MODULES ---
const AttendanceView = lazy(() => import("./views/attendance/AttendanceView"));
const ReimbursementView = lazy(() => import("./views/finance/ReimbursementView"));
const MeetingView = lazy(() => import("./views/committee/MeetingView"));

// --- NEWEST ADDITIONS (The missing ones) ---
const EngagementView = lazy(() => import("./views/engagement/EngagementView"));
const GovernanceView = lazy(() => import("./views/governance/GovernanceView"));
const LegalView = lazy(() => import("./views/legal/LegalView"));
const GrievanceView = lazy(() => import("./views/grievance/GrievanceView"));

const routes = [
  { path: "/", element: <Navigate to="dashboard/default" /> },
  {
    element: <ParcLayout />,
    children: [
      // 1. HR & Attendance
      { path: "/hr/profile", element: <ProfileView /> },
      { path: "/hr/leave", element: <LeaveAppView /> },
      { path: "/hr/payroll", element: <PayrollView /> },
      { path: "/attendance/logs", element: <AttendanceView /> },

      // 2. Legal & Governance
      { path: "/governance/policies", element: <GovernanceView /> },
      { path: "/legal/contracts", element: <LegalView /> },
      { path: "/grievance/submit", element: <GrievanceView /> },

      // 3. Finance
      { path: "/finance/claims", element: <ReimbursementView /> },

      // 4. Academic Roles (Committees & Engagement)
      { path: "/committee/meetings", element: <MeetingView /> },
      { path: "/engagement/portfolio", element: <EngagementView /> },
      
      // 5. Research
      { path: "/research/publications", element: <PublicationView /> },
      { path: "/research/grants", element: <GrantsView /> },
      { path: "/research/appraisal", element: <AppraisalView /> },

      // 6. Logistics
      { path: "/logistics/assets", element: <AssetView /> },
      { path: "/logistics/booking", element: <RoomBookingView /> },

      // Dashboard
      { path: "/dashboard/default", element: <DefaultDashboard /> },
    ]
  }
];

export default routes;