import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AuthGuard from "./auth/AuthGuard";
import ParcLayout from "./components/ParcLayout/ParcLayout";
import DefaultDashboard from "./views/faculty/dashboard/DefaultDashboard";

// ── Auth ─────────────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import("./views/sessions/LoginPage"));

// ── Faculty views ─────────────────────────────────────────────────────────────
const ProfileView = lazy(() => import("./views/faculty/HR & Payroll/hr/ProfileView"));
const LeaveAppView = lazy(() => import("./views/faculty/HR & Payroll/hr/LeaveAppView"));
const PayrollView = lazy(() => import("./views/faculty/HR & Payroll/hr/PayrollView"));
const AttendanceView = lazy(() => import("./views/faculty/HR & Payroll/hr/AttendanceView"));
const PublicationView = lazy(() => import("./views/faculty/Academic & Research/Research & Appraisal/PublicationView"));
const GrantsView = lazy(() => import("./views/faculty/Academic & Research/Research & Appraisal/GrantsView"));
const AppraisalView = lazy(() => import("./views/faculty/Academic & Research/Research & Appraisal/AppraisalView"));
const ReimbursementView = lazy(() => import("./views/faculty/HR & Payroll/finance/ReimbursementView"));
const AssetView = lazy(() => import("./views/faculty/Campus & Logistics/logistics/AssetView"));
const RoomBookingView = lazy(() => import("./views/faculty/Campus & Logistics/logistics/RoomBookingView"));
const RequestEquipment = lazy(() => import("./views/faculty/Campus & Logistics/logistics/RequestEquipment"));
const MyParkingPass = lazy(() => import("./views/faculty/Campus & Logistics/Parking/MyParkingPass"));
const ParkingAvailability = lazy(() => import("./views/faculty/Campus & Logistics/Parking/ParkingAvailability"));
const EngagementView = lazy(() => import("./views/faculty/Academic & Research/Academic Roles/EngagementView"));
const MeetingView = lazy(() => import("./views/faculty/Academic & Research/Academic Roles/MeetingView"));
const GovernanceView = lazy(() => import("./views/faculty/HR & Payroll/legal/GovernanceView"));
const LegalView = lazy(() => import("./views/faculty/HR & Payroll/legal/LegalView"));
const GrievanceView = lazy(() => import("./views/faculty/HR & Payroll/legal/GrievanceView"));

// ── Super Admin views ─────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import("./views/Super-admin/admin/dashboard/AdminDashboard"));
const LeaveApprovalView = lazy(() => import("./views/Super-admin/admin/hr/LeaveApprovalView"));
const ClaimsApprovalView = lazy(() => import("./views/Super-admin/admin/finance/ClaimsApprovalView"));
const PromotionsView = lazy(() => import("./views/Super-admin/admin/faculty/PromotionsView"));
const TransfersView = lazy(() => import("./views/Super-admin/admin/faculty/TransfersView"));
const AttendanceMonitorView = lazy(() => import("./views/Super-admin/admin/attendance/AttendanceMonitorView"));
const RegularizationView = lazy(() => import("./views/Super-admin/admin/attendance/RegularizationView"));
const PayrollProcessingView = lazy(() => import("./views/Super-admin/admin/finance/PayrollProcessingView"));
const LoanManagementView = lazy(() => import("./views/Super-admin/admin/finance/LoanManagementView"));
const PolicyManagementView = lazy(() => import("./views/Super-admin/admin/legal/PolicyManagementView"));
const PolicyComplianceView = lazy(() => import("./views/Super-admin/admin/legal/PolicyComplianceView"));
const BondManagementView = lazy(() => import("./views/Super-admin/admin/legal/BondManagementView"));
const GrievanceManagementView = lazy(() => import("./views/Super-admin/admin/grievance/GrievanceManagementView"));
const CommitteeManagementView = lazy(() => import("./views/Super-admin/admin/academic/CommitteeManagementView"));
const PbasAdminView = lazy(() => import("./views/Super-admin/admin/research/PbasAdminView"));
const EngagementAdminView = lazy(() => import("./views/Super-admin/admin/academic/EngagementAdminView"));
const GrantAdminView = lazy(() => import("./views/Super-admin/admin/research/GrantAdminView"));
const AssetAdminView = lazy(() => import("./views/Super-admin/admin/logistics/AssetAdminView"));
const RoomBookingAdminView = lazy(() => import("./views/Super-admin/admin/logistics/RoomBookingAdminView"));
const AssetMaintenanceView = lazy(() => import("./views/Super-admin/admin/logistics/AssetMaintenanceView"));
const ReportsView = lazy(() => import("./views/Super-admin/Insights & System/reports/ReportsView"));
const CommunicationAdminView = lazy(() => import("./views/Super-admin/Insights & System/communication/CommunicationAdminView"));
const RBACSettingsView = lazy(() => import("./views/Super-admin/Insights & System/System-settings/RBACSettingsView"));
const BulkOperationsView = lazy(() => import("./views/Super-admin/admin/data/BulkOperationsView"));
const EmailTemplatesView = lazy(() => import("./views/Super-admin/Insights & System/System-settings/EmailTemplatesView"));
const IntegrationSettingsView = lazy(() => import("./views/Super-admin/Insights & System/System-settings/IntegrationSettingsView"));
const ProbationView = lazy(() => import("./views/Super-admin/admin/hr/ProbationView"));
const FacultyRegistrationView = lazy(() => import("./views/Super-admin/admin/hr/FacultyRegistrationView"));
const AllFacultyView = lazy(() => import("./views/Super-admin/admin/faculty/AllFacultyView"));
const Classrooms = lazy(() => import("./views/Super-admin/CIMS/campus management/Classrooms"));
const Buildings = lazy(() => import("./views/Super-admin/CIMS/campus management/Buildings"));
const Laboratories = lazy(() => import("./views/Super-admin/CIMS/campus management/Laboratories"));
const Auditoriums = lazy(() => import("./views/Super-admin/CIMS/campus management/Auditoriums"));
const SeminarHalls = lazy(() => import("./views/Super-admin/CIMS/campus management/SeminarHalls"));
const CustomInfrastructure = lazy(() => import("./views/Super-admin/CIMS/campus management/CustomInfrastructure"));
const CampusDigitalTwin = lazy(() => import("./views/Super-admin/CIMS/campus management/CampusDigitalTwin"));
const RoomBooking = lazy(() => import("./views/Super-admin/CIMS/booking-management/RoomBooking"));
const LabBooking = lazy(() => import("./views/Super-admin/CIMS/booking-management/LabBooking"));
const AuditoriumBooking = lazy(() => import("./views/Super-admin/CIMS/booking-management/AuditoriumBooking"));
const CalendarBooking = lazy(() => import("./views/Super-admin/CIMS/booking-management/CalendarBooking"));
const CustomBooking = lazy(() => import("./views/Super-admin/CIMS/booking-management/CustomBooking"));
const BoysHostel = lazy(() => import("./views/Super-admin/CIMS/hostel-management/BoysHostel"));
const GirlsHostel = lazy(() => import("./views/Super-admin/CIMS/hostel-management/GirlsHostel"));
const HostelComplaints = lazy(() => import("./views/Super-admin/CIMS/hostel-management/HostelComplaints"));
const HostelEntryExit = lazy(() => import("./views/Super-admin/CIMS/hostel-management/HostelEntryExit"));
const HostelOverview = lazy(() => import("./views/Super-admin/CIMS/hostel-management/HostelOverview"));
const HostelMess = lazy(() => import("./views/Super-admin/CIMS/hostel-management/HostelMess"));
const HostelAttendance = lazy(() => import("./views/Super-admin/CIMS/hostel-management/HostelAttendance"));
const BusFleetView = lazy(() => import("./views/Super-admin/CIMS/Transportation/BusFleetView"));
const RoutesView = lazy(() => import("./views/Super-admin/CIMS/Transportation/RoutesView"));
const DriversView = lazy(() => import("./views/Super-admin/CIMS/Transportation/DriversView"));
const StudentPassesView = lazy(() => import("./views/Super-admin/CIMS/Transportation/StudentPassesView"));
const LiveTrackingView = lazy(() => import("./views/Super-admin/CIMS/Transportation/LiveTrackingView"));
const ParkingManagement = lazy(() => import("./views/Super-admin/CIMS/Parking/ParkingManagement"));
const ParkingPasses = lazy(() => import("./views/Super-admin/CIMS/Parking/ParkingPasses"));
const GateManagement = lazy(() => import("./views/Super-admin/CIMS/Parking/GateManagement"));
const MaintenanceRequests = lazy(() => import("./views/Super-admin/CIMS/maintenance/MaintenanceRequests"));
const WorkOrders = lazy(() => import("./views/Super-admin/CIMS/maintenance/WorkOrders"));
const StaffAssignment = lazy(() => import("./views/Super-admin/CIMS/maintenance/StaffAssignment"));
const Equipment = lazy(() => import("./views/Super-admin/CIMS/asset management/Equipment"));
const Furniture = lazy(() => import("./views/Super-admin/CIMS/asset management/Furniture"));
const Inventory = lazy(() => import("./views/Super-admin/CIMS/asset management/Inventory"));
const CustomReportBuilder = lazy(() => import("./views/Super-admin/Insights & System/reports/CustomReportBuilder"));
const NotificationHistory = lazy(() => import("./views/Super-admin/Insights & System/communication/NotificationHistory"));
const DeviceManagement = lazy(() => import("./views/Super-admin/Insights & System/System-settings/DeviceManagement"))


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
      { path: "/faculty/assets/request", element: <RequestEquipment /> },
      { path: "/faculty/bookings/book", element: <RoomBookingView /> },
      { path: "/faculty/parking/pass", element: <MyParkingPass /> },
      { path: "/faculty/parking/availability", element: <ParkingAvailability /> },
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
      { path: "/admin/CIMS/transport/fleet", element: <BusFleetView /> },
      { path: "/admin/CIMS/transport/routes", element: <RoutesView /> },
      { path: "/admin/CIMS/transport/drivers", element: <DriversView /> },
      { path: "/admin/CIMS/transport/passes", element: <StudentPassesView /> },
      { path: "/admin/CIMS/transport/tracking", element: <LiveTrackingView /> },
      { path: "/admin/CIMS/parking/management", element: <ParkingManagement /> },
      { path: "/admin/CIMS/parking/passes", element: <ParkingPasses /> },
      { path: "/admin/CIMS/parking/gate-management", element: <GateManagement /> },
      { path: "/admin/CIMS/maintenance/requests", element: <MaintenanceRequests /> },
      { path: "/admin/CIMS/maintenance/work-orders", element: <WorkOrders /> },
      { path: "/admin/CIMS/maintenance/staff-assignment", element: <StaffAssignment /> },
      { path: "/admin/CIMS/asset-management/equipment", element: <Equipment /> },
      { path: "/admin/CIMS/asset-management/furniture", element: <Furniture /> },
      { path: "/admin/CIMS/asset-management/inventory", element: <Inventory /> },
      { path: "/admin/reports/ReportsView", element: <ReportsView /> },
      { path: "/admin/reports/custom", element: <CustomReportBuilder /> },
      { path: "/admin/communication/announcements", element: <CommunicationAdminView /> },
      { path: "/admin/insights/notification-history", element: <NotificationHistory /> },
      { path: "/admin/settings/rbac", element: <RBACSettingsView /> },
      { path: "/admin/data/bulk", element: <BulkOperationsView /> },
      { path: "/admin/settings/integrations", element: <IntegrationSettingsView /> },
      { path: "/admin/communication/templates", element: <EmailTemplatesView /> },
      { path: "/admin/settings/device-management", element: <DeviceManagement /> },





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
