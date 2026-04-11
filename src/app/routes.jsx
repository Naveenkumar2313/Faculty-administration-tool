import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AuthGuard from "./auth/AuthGuard";
import ParcLayout from "./components/ParcLayout/ParcLayout";
import DefaultDashboard from "./views/faculty/dashboard/DefaultDashboard";

// ── Auth ─────────────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import("./views/sessions/LoginPage"));

// ── Faculty views ─────────────────────────────────────────────────────────────
const ProfileView = lazy(() => import("./views/faculty/hr/ProfileView"));
const LeaveAppView = lazy(() => import("./views/faculty/hr/LeaveAppView"));
const PayrollView = lazy(() => import("./views/faculty/hr/PayrollView"));
const AttendanceView = lazy(() => import("./views/faculty/attendance/AttendanceView"));
const PublicationView = lazy(() => import("./views/faculty/research/PublicationView"));
const GrantsView = lazy(() => import("./views/faculty/research/GrantsView"));
const AppraisalView = lazy(() => import("./views/faculty/research/AppraisalView"));
const ReimbursementView = lazy(() => import("./views/faculty/finance/ReimbursementView"));
const AssetView = lazy(() => import("./views/faculty/logistics/AssetView"));
const RoomBookingView = lazy(() => import("./views/faculty/logistics/RoomBookingView"));
const EngagementView = lazy(() => import("./views/faculty/engagement/EngagementView"));
const MeetingView = lazy(() => import("./views/faculty/committee/MeetingView"));
const GovernanceView = lazy(() => import("./views/faculty/governance/GovernanceView"));
const LegalView = lazy(() => import("./views/faculty/legal/LegalView"));
const GrievanceView = lazy(() => import("./views/faculty/grievance/GrievanceView"));

// ── Super Admin views ─────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import("./views/admin/dashboard/AdminDashboard"));
const LeaveApprovalView = lazy(() => import("./views/admin/hr/LeaveApprovalView"));
const ClaimsApprovalView = lazy(() => import("./views/admin/finance/ClaimsApprovalView"));
const PromotionsView = lazy(() => import("./views/admin/faculty/PromotionsView"));
const TransfersView = lazy(() => import("./views/admin/faculty/TransfersView"));
const AttendanceMonitorView = lazy(() => import("./views/admin/attendance/AttendanceMonitorView"));
const RegularizationView = lazy(() => import("./views/admin/attendance/RegularizationView"));
const PayrollProcessingView = lazy(() => import("./views/admin/finance/PayrollProcessingView"));
const LoanManagementView = lazy(() => import("./views/admin/finance/LoanManagementView"));
const PolicyManagementView = lazy(() => import("./views/admin/legal/PolicyManagementView"));
const PolicyComplianceView = lazy(() => import("./views/admin/legal/PolicyComplianceView"));
const BondManagementView = lazy(() => import("./views/admin/legal/BondManagementView"));
const GrievanceManagementView = lazy(() => import("./views/admin/grievance/GrievanceManagementView"));
const CommitteeManagementView = lazy(() => import("./views/admin/academic/CommitteeManagementView"));
const PbasAdminView = lazy(() => import("./views/admin/research/PbasAdminView"));
const EngagementAdminView = lazy(() => import("./views/admin/academic/EngagementAdminView"));
const GrantAdminView = lazy(() => import("./views/admin/research/GrantAdminView"));
const AssetAdminView = lazy(() => import("./views/admin/logistics/AssetAdminView"));
const RoomBookingAdminView = lazy(() => import("./views/admin/logistics/RoomBookingAdminView"));
const AssetMaintenanceView = lazy(() => import("./views/admin/logistics/AssetMaintenanceView"));
const ReportsView = lazy(() => import("./views/admin/reports/ReportsView"));
const CommunicationAdminView = lazy(() => import("./views/admin/communication/CommunicationAdminView"));
const RBACSettingsView = lazy(() => import("./views/admin/settings/RBACSettingsView"));
const BulkOperationsView = lazy(() => import("./views/admin/data/BulkOperationsView"));
const EmailTemplatesView = lazy(() => import("./views/admin/communication/EmailTemplatesView"));
const ProbationView = lazy(() => import("./views/admin/hr/ProbationView"));
const FacultyRegistrationView = lazy(() => import("./views/admin/hr/FacultyRegistrationView"));
const AllFacultyView = lazy(() => import("./views/admin/faculty/AllFacultyView"));
const Classrooms = lazy(() => import("./views/CIMS/campus management/Classrooms"));
const Buildings = lazy(() => import("./views/CIMS/campus management/Buildings"));
const Laboratories = lazy(() => import("./views/CIMS/campus management/Laboratories"));
const Auditoriums = lazy(() => import("./views/CIMS/campus management/Auditoriums"));
const SeminarHalls = lazy(() => import("./views/CIMS/campus management/SeminarHalls"));
const CustomInfrastructure = lazy(() => import("./views/CIMS/campus management/CustomInfrastructure"));
const CampusDigitalTwin = lazy(() => import("./views/CIMS/campus management/CampusDigitalTwin"));
const RoomBooking = lazy(() => import("./views/CIMS/booking-management/RoomBooking"));
const LabBooking = lazy(() => import("./views/CIMS/booking-management/LabBooking"));
const AuditoriumBooking = lazy(() => import("./views/CIMS/booking-management/AuditoriumBooking"));
const CalendarBooking = lazy(() => import("./views/CIMS/booking-management/CalendarBooking"));
const CustomBooking = lazy(() => import("./views/CIMS/booking-management/CustomBooking"));
const BoysHostel = lazy(() => import("./views/CIMS/hostel-management/BoysHostel"));
const GirlsHostel = lazy(() => import("./views/CIMS/hostel-management/GirlsHostel"));
const HostelComplaints = lazy(() => import("./views/CIMS/hostel-management/HostelComplaints"));
const HostelEntryExit = lazy(() => import("./views/CIMS/hostel-management/HostelEntryExit"));
const HostelOverview = lazy(() => import("./views/CIMS/hostel-management/HostelOverview"));
const HostelMess = lazy(() => import("./views/CIMS/hostel-management/HostelMess"));
const HostelAttendance = lazy(() => import("./views/CIMS/hostel-management/HostelAttendance"));



// ── Placeholder for new role dashboards (create real views as you build them) ────────
// These are stub placeholders — replace with real views as you build them.
const PlaceholderView = (title) => () => (
  <div style={{ padding: '2rem', textAlign: 'center', marginTop: '20vh' }}>
    <h2>{title}</h2>
    <p style={{ color: '#888' }}>This view is under construction.</p>
  </div>
);

const HostelDashboard = PlaceholderView("Hostel Admin Dashboard");
const TransportDashboard = PlaceholderView("Transport Admin Dashboard");
const DriverDashboard = PlaceholderView("Driver Dashboard");
const StudentDashboard = PlaceholderView("Student Dashboard");
const MaintenanceDashboard = PlaceholderView("Maintenance Staff Dashboard");

const routes = [
  { path: "/", element: <Navigate to="/session/signin" /> },
  { path: "/session/signin", element: <LoginPage /> },

  {
    element: (
      <AuthGuard>
        <ParcLayout />
      </AuthGuard>
    ),
    children: [
      // ── Shared ──────────────────────────────────────────────────────────
      { path: "/dashboard/default", element: <DefaultDashboard /> },

      // ── Faculty ─────────────────────────────────────────────────────────
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

      // ── Super Admin ──────────────────────────────────────────────────────
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/admin/hr/leaves", element: <LeaveApprovalView /> },
      { path: "/admin/faculty/all", element: <AllFacultyView /> },
      { path: "/admin/finance/claims", element: <ClaimsApprovalView /> },
      { path: "/admin/hr/onboarding", element: <FacultyRegistrationView /> },
      { path: "/admin/hr/probation", element: <ProbationView /> },
      { path: "/admin/faculty/promotions", element: <PromotionsView /> },
      { path: "/admin/faculty/transfers", element: <TransfersView /> },
      { path: "/admin/attendance/monitor", element: <AttendanceMonitorView /> },
      { path: "/admin/attendance/regularization", element: <RegularizationView /> },
      { path: "/admin/finance/payroll", element: <PayrollProcessingView /> },
      { path: "/admin/finance/loans", element: <LoanManagementView /> },
      { path: "/admin/legal/policies", element: <PolicyManagementView /> },
      { path: "/admin/legal/compliance", element: <PolicyComplianceView /> },
      { path: "/admin/legal/contracts", element: <BondManagementView /> },
      { path: "/admin/grievance/queue", element: <GrievanceManagementView /> },
      { path: "/admin/academic/committees", element: <CommitteeManagementView /> },
      { path: "/admin/research/pbas", element: <PbasAdminView /> },
      { path: "/admin/academic/engagement", element: <EngagementAdminView /> },
      { path: "/admin/research/grants", element: <GrantAdminView /> },
      { path: "/admin/logistics/assets", element: <AssetAdminView /> },
      { path: "/admin/logistics/bookings", element: <RoomBookingAdminView /> },
      { path: "/admin/logistics/maintenance", element: <AssetMaintenanceView /> },
      { path: "/admin/reports", element: <ReportsView /> },
      { path: "/admin/communication/announcements", element: <CommunicationAdminView /> },
      { path: "/admin/settings/rbac", element: <RBACSettingsView /> },
      { path: "/admin/data/bulk", element: <BulkOperationsView /> },
      { path: "/admin/communication/templates", element: <EmailTemplatesView /> },
      { path: "/admin/CIMS/classrooms", element: <Classrooms /> },
      { path: "/admin/CIMS/buildings", element: <Buildings /> },
      { path: "/admin/CIMS/laboratories", element: <Laboratories /> },
      { path: "/admin/CIMS/auditoriums", element: <Auditoriums /> },
      { path: "/admin/CIMS/seminar-halls", element: <SeminarHalls /> },
      { path: "/admin/CIMS/custom-infrastructure", element: <CustomInfrastructure /> },
      { path: "/admin/CIMS/campus-digital-twin", element: <CampusDigitalTwin /> },
      { path: "/admin/CIMS/room-booking", element: <RoomBooking /> },
      { path: "/admin/CIMS/lab-booking", element: <LabBooking /> },
      { path: "/admin/CIMS/auditorium-booking", element: <AuditoriumBooking /> },
      { path: "/admin/CIMS/calendar-booking", element: <CalendarBooking /> },
      { path: "/admin/CIMS/custom-booking", element: <CustomBooking /> },
      { path: "/admin/CIMS/boys-hostel", element: <BoysHostel /> },
      { path: "/admin/CIMS/girls-hostel", element: <GirlsHostel /> },
      { path: "/admin/CIMS/hostel-complaints", element: <HostelComplaints /> },
      { path: "/admin/CIMS/hostel-entry-exit", element: <HostelEntryExit /> },
      { path: "/admin/CIMS/hostel-overview", element: <HostelOverview /> },
      { path: "/admin/CIMS/hostel-mess", element: <HostelMess /> },
      { path: "/admin/CIMS/hostel-attendance", element: <HostelAttendance /> },






      // ── Hostel Admin ─────────────────────────────────────────────────────
      { path: "/hostel/dashboard", element: <HostelDashboard /> },
      // TODO: add hostel views as you build them
      // e.g. { path: "/hostel/rooms/allocations", element: <RoomAllocationsView /> }

      // ── Transport Admin ──────────────────────────────────────────────────
      { path: "/transport/dashboard", element: <TransportDashboard /> },
      // TODO: add transport views

      // ── Driver ───────────────────────────────────────────────────────────
      { path: "/driver/dashboard", element: <DriverDashboard /> },
      // TODO: add driver views

      // ── Student ──────────────────────────────────────────────────────────
      { path: "/student/dashboard", element: <StudentDashboard /> },
      // TODO: add student views

      // ── Maintenance Staff ─────────────────────────────────────────────────
      { path: "/maintenance/dashboard", element: <MaintenanceDashboard /> }
      // TODO: add maintenance views
    ]
  },

  { path: "*", element: <Navigate to="/session/signin" /> }
];

export default routes;
