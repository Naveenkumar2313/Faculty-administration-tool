import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AuthGuard from "./auth/AuthGuard";
import ParcLayout from "./components/ParcLayout/ParcLayout";
import DefaultDashboard from "./views/dashboard/DefaultDashboard";

// Auth View
const LoginPage = lazy(() => import("./views/sessions/LoginPage"));

// Faculty Views
const ProfileView = lazy(() => import("./views/hr/ProfileView"));
const LeaveAppView = lazy(() => import("./views/hr/LeaveAppView"));
const PayrollView = lazy(() => import("./views/hr/PayrollView"));
const AttendanceView = lazy(() => import("./views/attendance/AttendanceView"));
const PublicationView = lazy(() => import("./views/research/PublicationView"));
const GrantsView = lazy(() => import("./views/research/GrantsView"));
const AppraisalView = lazy(() => import("./views/research/AppraisalView"));
const ReimbursementView = lazy(() => import("./views/finance/ReimbursementView"));
const AssetView = lazy(() => import("./views/logistics/AssetView"));
const RoomBookingView = lazy(() => import("./views/logistics/RoomBookingView"));
const EngagementView = lazy(() => import("./views/engagement/EngagementView"));
const MeetingView = lazy(() => import("./views/committee/MeetingView"));
const GovernanceView = lazy(() => import("./views/governance/GovernanceView"));
const LegalView = lazy(() => import("./views/legal/LegalView"));
const GrievanceView = lazy(() => import("./views/grievance/GrievanceView"));

// Admin Views
const AdminDashboard = lazy(() => import("./views/admin/dashboard/AdminDashboard"));
const LeaveApprovalView = lazy(() => import("./views/admin/hr/LeaveApprovalView"));
const ClaimsApprovalView = lazy(() => import("./views/admin/finance/ClaimsApprovalView"));
const PromotionsView = lazy(() => import("./views/admin/faculty/PromotionsView"));
const TransfersView = lazy(() => import("./views/admin/faculty/TransfersView"));
const AttendanceMonitorView = lazy(() => import("./views/admin/attendance/AttendanceMonitorView"));
const RegularizationView = lazy(() => import("./views/admin/attendance/RegularizationView"));

const routes = [
  // 1. CHANGE: Redirect root to Login
  { path: "/", element: <Navigate to="/session/signin" /> },
  { path: "/session/signin", element: <LoginPage /> },

  // 2. Protected Routes
  {
    element: (
      <AuthGuard>
        <ParcLayout />
      </AuthGuard>
    ),
    children: [
      // Common
      { path: "/dashboard/default", element: <DefaultDashboard /> },

      // Faculty Routes
      { path: "/hr/profile", element: <ProfileView /> },
      { path: "/hr/leave", element: <LeaveAppView /> },
      { path: "/hr/payroll", element: <PayrollView /> },
      { path: "/attendance/logs", element: <AttendanceView /> },
      { path: "/research/publications", element: <PublicationView /> },
      { path: "/research/grants", element: <GrantsView /> },
      { path: "/research/appraisal", element: <AppraisalView /> },
      { path: "/finance/claims", element: <ReimbursementView /> },
      { path: "/logistics/assets", element: <AssetView /> },
      { path: "/logistics/booking", element: <RoomBookingView /> },
      { path: "/engagement/portfolio", element: <EngagementView /> },
      { path: "/committee/meetings", element: <MeetingView /> },
      { path: "/governance/policies", element: <GovernanceView /> },
      { path: "/legal/contracts", element: <LegalView /> },
      { path: "/grievance/submit", element: <GrievanceView /> },

      // Admin Routes
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/admin/hr/leaves", element: <LeaveApprovalView /> },
      { path: "/admin/finance/claims", element: <ClaimsApprovalView /> },
      { path: "/admin/hr/attendance", element: <AttendanceView /> },
      { path: "/admin/logistics/assets", element: <AssetView /> },
      { path: "/admin/faculty/promotions", element: <PromotionsView /> },
      { path: "/admin/faculty/transfers", element: <TransfersView /> },
      { path: "/admin/attendance/monitor", element: <AttendanceMonitorView /> },
      { path: "/admin/attendance/regularization", element: <RegularizationView /> },
    ]
  },
  
  // Catch-all
  { path: "*", element: <Navigate to="/session/signin" /> }
];

export default routes;