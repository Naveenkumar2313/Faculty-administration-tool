import { lazy } from "react";
import { Navigate } from "react-router-dom";
import ParcLayout from "./components/ParcLayout/ParcLayout";
import DefaultDashboard from "./views/dashboard/DefaultDashboard";

// --- FACULTY PORTAL VIEWS ---

// 1. HR & Attendance
const ProfileView = lazy(() => import("./views/hr/ProfileView"));
const LeaveAppView = lazy(() => import("./views/hr/LeaveAppView"));
const PayrollView = lazy(() => import("./views/hr/PayrollView"));
const AttendanceView = lazy(() => import("./views/attendance/AttendanceView"));

// 2. Research & Publications
const PublicationView = lazy(() => import("./views/research/PublicationView"));
const GrantsView = lazy(() => import("./views/research/GrantsView"));
const AppraisalView = lazy(() => import("./views/research/AppraisalView"));

// 3. Finance & Claims
const ReimbursementView = lazy(() => import("./views/finance/ReimbursementView"));

// 4. Logistics & Assets
const AssetView = lazy(() => import("./views/logistics/AssetView"));
const RoomBookingView = lazy(() => import("./views/logistics/RoomBookingView"));

// 5. Academic Roles & Committees
const EngagementView = lazy(() => import("./views/engagement/EngagementView"));
const MeetingView = lazy(() => import("./views/committee/MeetingView"));

// 6. Governance & Legal
const GovernanceView = lazy(() => import("./views/governance/GovernanceView"));
const LegalView = lazy(() => import("./views/legal/LegalView"));
const GrievanceView = lazy(() => import("./views/grievance/GrievanceView"));

// --- ADMIN PORTAL VIEWS ---
const AdminDashboard = lazy(() => import("./views/admin/dashboard/AdminDashboard"));
const LeaveApprovalView = lazy(() => import("./views/admin/hr/LeaveApprovalView"));
const ClaimsApprovalView = lazy(() => import("./views/admin/finance/ClaimsApprovalView"));

const routes = [
  { path: "/", element: <Navigate to="dashboard/default" /> },
  {
    element: <ParcLayout />,
    children: [
      // ==========================
      // FACULTY ROUTES
      // ==========================
      
      // Dashboard
      { path: "/dashboard/default", element: <DefaultDashboard /> },

      // HR & Profile
      { path: "/hr/profile", element: <ProfileView /> },
      { path: "/hr/leave", element: <LeaveAppView /> },
      { path: "/hr/payroll", element: <PayrollView /> },
      { path: "/attendance/logs", element: <AttendanceView /> },

      // Research
      { path: "/research/publications", element: <PublicationView /> },
      { path: "/research/grants", element: <GrantsView /> },
      { path: "/research/appraisal", element: <AppraisalView /> },

      // Finance
      { path: "/finance/claims", element: <ReimbursementView /> },

      // Logistics
      { path: "/logistics/assets", element: <AssetView /> },
      { path: "/logistics/booking", element: <RoomBookingView /> },

      // Academic Roles
      { path: "/engagement/portfolio", element: <EngagementView /> },
      { path: "/committee/meetings", element: <MeetingView /> },

      // Governance & Legal
      { path: "/governance/policies", element: <GovernanceView /> },
      { path: "/legal/contracts", element: <LegalView /> },
      { path: "/grievance/submit", element: <GrievanceView /> },

      // ==========================
      // ADMIN ROUTES
      // ==========================
      
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      
      // Approvals
      { path: "/admin/hr/leaves", element: <LeaveApprovalView /> },
      { path: "/admin/finance/claims", element: <ClaimsApprovalView /> },
      
      // (Future Admin Routes Placeholders)
      { path: "/admin/hr/attendance", element: <AttendanceView /> }, // Reusing view for now or create specific admin view
      { path: "/admin/logistics/assets", element: <AssetView /> },   // Reusing view for now
    ]
  }
];

export default routes;