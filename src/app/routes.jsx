import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AuthGuard from "./auth/AuthGuard";
import ParcLayout from "./components/ParcLayout/ParcLayout";
import DefaultDashboard from "./views/faculty/dashboard/DefaultDashboard";

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════════════
const LoginPage = lazy(() => import("./views/sessions/LoginPage"));

// ═══════════════════════════════════════════════════════════════════════════════
// FACULTY VIEWS
// ═══════════════════════════════════════════════════════════════════════════════

// ── HR & Payroll ────────────────────────────────────────────────────────────
const ProfileView = lazy(() => import("./views/faculty/HR & Payroll/hr/ProfileView"));
const LeaveAppView = lazy(() => import("./views/faculty/HR & Payroll/hr/LeaveAppView"));
const PayrollView = lazy(() => import("./views/faculty/HR & Payroll/hr/PayrollView"));
const AttendanceView = lazy(() => import("./views/faculty/HR & Payroll/hr/AttendanceView"));

// ── Finance ─────────────────────────────────────────────────────────────────
const ReimbursementView = lazy(() => import("./views/faculty/HR & Payroll/finance/ReimbursementView"));

// ── Legal & Governance ──────────────────────────────────────────────────────
const GovernanceView = lazy(() => import("./views/faculty/HR & Payroll/legal/GovernanceView"));
const LegalView = lazy(() => import("./views/faculty/HR & Payroll/legal/LegalView"));
const GrievanceView = lazy(() => import("./views/faculty/HR & Payroll/legal/GrievanceView"));

// ── Academic & Research ─────────────────────────────────────────────────────
const PublicationView = lazy(() => import("./views/faculty/Academic & Research/Research & Appraisal/PublicationView"));
const GrantsView = lazy(() => import("./views/faculty/Academic & Research/Research & Appraisal/GrantsView"));
const AppraisalView = lazy(() => import("./views/faculty/Academic & Research/Research & Appraisal/AppraisalView"));
const EngagementView = lazy(() => import("./views/faculty/Academic & Research/Academic Roles/EngagementView"));
const MeetingView = lazy(() => import("./views/faculty/Academic & Research/Academic Roles/MeetingView"));

// ── Campus & Logistics ──────────────────────────────────────────────────────
const AssetView = lazy(() => import("./views/faculty/Campus & Logistics/logistics/AssetView"));
const RoomBookingView = lazy(() => import("./views/faculty/Campus & Logistics/logistics/RoomBookingView"));
const RequestEquipment = lazy(() => import("./views/faculty/Campus & Logistics/logistics/RequestEquipment"));
const MyParkingPass = lazy(() => import("./views/faculty/Campus & Logistics/Parking/MyParkingPass"));
const ParkingAvailability = lazy(() => import("./views/faculty/Campus & Logistics/Parking/ParkingAvailability"));

// ── Campus Info ─────────────────────────────────────────────────────────────
const NoticeboardView = lazy(() => import("./views/faculty/Campus Info/NoticeboardView"));

// ═══════════════════════════════════════════════════════════════════════════════
// SUPER ADMIN VIEWS
// ═══════════════════════════════════════════════════════════════════════════════

// ── Dashboard ───────────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import("./views/Super-admin/admin/dashboard/AdminDashboard"));

// ── HR ──────────────────────────────────────────────────────────────────────
const FacultyRegistrationView = lazy(() => import("./views/Super-admin/admin/hr/FacultyRegistrationView"));
const ProbationView = lazy(() => import("./views/Super-admin/admin/hr/ProbationView"));
const LeaveApprovalView = lazy(() => import("./views/Super-admin/admin/hr/LeaveApprovalView"));

// ── Faculty Management ──────────────────────────────────────────────────────
const AllFacultyView = lazy(() => import("./views/Super-admin/admin/faculty/AllFacultyView"));
const PromotionsView = lazy(() => import("./views/Super-admin/admin/faculty/PromotionsView"));
const TransfersView = lazy(() => import("./views/Super-admin/admin/faculty/TransfersView"));

// ── Attendance ──────────────────────────────────────────────────────────────
const AttendanceMonitorView = lazy(() => import("./views/Super-admin/admin/attendance/AttendanceMonitorView"));
const RegularizationView = lazy(() => import("./views/Super-admin/admin/attendance/RegularizationView"));

// ── Finance ─────────────────────────────────────────────────────────────────
const ClaimsApprovalView = lazy(() => import("./views/Super-admin/admin/finance/ClaimsApprovalView"));
const PayrollProcessingView = lazy(() => import("./views/Super-admin/admin/finance/PayrollProcessingView"));
const LoanManagementView = lazy(() => import("./views/Super-admin/admin/finance/LoanManagementView"));

// ── Legal ───────────────────────────────────────────────────────────────────
const PolicyManagementView = lazy(() => import("./views/Super-admin/admin/legal/PolicyManagementView"));
const PolicyComplianceView = lazy(() => import("./views/Super-admin/admin/legal/PolicyComplianceView"));
const BondManagementView = lazy(() => import("./views/Super-admin/admin/legal/BondManagementView"));

// ── Grievance ───────────────────────────────────────────────────────────────
const GrievanceManagementView = lazy(() => import("./views/Super-admin/admin/grievance/GrievanceManagementView"));

// ── Academic ────────────────────────────────────────────────────────────────
const CommitteeManagementView = lazy(() => import("./views/Super-admin/admin/academic/CommitteeManagementView"));
const EngagementAdminView = lazy(() => import("./views/Super-admin/admin/academic/EngagementAdminView"));

// ── Research ────────────────────────────────────────────────────────────────
const PbasAdminView = lazy(() => import("./views/Super-admin/admin/research/PbasAdminView"));
const GrantAdminView = lazy(() => import("./views/Super-admin/admin/research/GrantAdminView"));

// ── Logistics ───────────────────────────────────────────────────────────────
const AssetAdminView = lazy(() => import("./views/Super-admin/admin/logistics/AssetAdminView"));
const RoomBookingAdminView = lazy(() => import("./views/Super-admin/admin/logistics/RoomBookingAdminView"));
const AssetMaintenanceView = lazy(() => import("./views/Super-admin/admin/logistics/AssetMaintenanceView"));

// ── Data ────────────────────────────────────────────────────────────────────
const BulkOperationsView = lazy(() => import("./views/Super-admin/admin/data/BulkOperationsView"));

// ── CIMS → Campus Management ────────────────────────────────────────────────
const Classrooms = lazy(() => import("./views/Super-admin/CIMS/campus management/Classrooms"));
const Buildings = lazy(() => import("./views/Super-admin/CIMS/campus management/Buildings"));
const Laboratories = lazy(() => import("./views/Super-admin/CIMS/campus management/Laboratories"));
const Auditoriums = lazy(() => import("./views/Super-admin/CIMS/campus management/Auditoriums"));
const SeminarHalls = lazy(() => import("./views/Super-admin/CIMS/campus management/SeminarHalls"));
const CustomInfrastructure = lazy(() => import("./views/Super-admin/CIMS/campus management/CustomInfrastructure"));
const CampusDigitalTwin = lazy(() => import("./views/Super-admin/CIMS/campus management/CampusDigitalTwin"));

// ── CIMS → Booking Management ───────────────────────────────────────────────
const RoomBooking = lazy(() => import("./views/Super-admin/CIMS/booking-management/RoomBooking"));
const LabBooking = lazy(() => import("./views/Super-admin/CIMS/booking-management/LabBooking"));
const AuditoriumBooking = lazy(() => import("./views/Super-admin/CIMS/booking-management/AuditoriumBooking"));
const CalendarBooking = lazy(() => import("./views/Super-admin/CIMS/booking-management/CalendarBooking"));
const CustomBooking = lazy(() => import("./views/Super-admin/CIMS/booking-management/CustomBooking"));

// ── CIMS → Hostel Management ────────────────────────────────────────────────
const HostelOverview = lazy(() => import("./views/Super-admin/CIMS/hostel-management/HostelOverview"));
const BoysHostel = lazy(() => import("./views/Super-admin/CIMS/hostel-management/BoysHostel"));
const GirlsHostel = lazy(() => import("./views/Super-admin/CIMS/hostel-management/GirlsHostel"));
const HostelComplaints = lazy(() => import("./views/Super-admin/CIMS/hostel-management/HostelComplaints"));
const HostelEntryExit = lazy(() => import("./views/Super-admin/CIMS/hostel-management/HostelEntryExit"));
const HostelMess = lazy(() => import("./views/Super-admin/CIMS/hostel-management/HostelMess"));
const HostelAttendance = lazy(() => import("./views/Super-admin/CIMS/hostel-management/HostelAttendance"));

// ── CIMS → Transportation ──────────────────────────────────────────────────
const BusFleetView = lazy(() => import("./views/Super-admin/CIMS/Transportation/BusFleetView"));
const RoutesView = lazy(() => import("./views/Super-admin/CIMS/Transportation/RoutesView"));
const DriversView = lazy(() => import("./views/Super-admin/CIMS/Transportation/DriversView"));
const StudentPassesView = lazy(() => import("./views/Super-admin/CIMS/Transportation/StudentPassesView"));
const LiveTrackingView = lazy(() => import("./views/Super-admin/CIMS/Transportation/LiveTrackingView"));

// ── CIMS → Parking ──────────────────────────────────────────────────────────
const ParkingManagement = lazy(() => import("./views/Super-admin/CIMS/Parking/ParkingManagement"));
const ParkingPasses = lazy(() => import("./views/Super-admin/CIMS/Parking/ParkingPasses"));
const GateManagement = lazy(() => import("./views/Super-admin/CIMS/Parking/GateManagement"));

// ── CIMS → Maintenance ─────────────────────────────────────────────────────
const MaintenanceRequests = lazy(() => import("./views/Super-admin/CIMS/maintenance/MaintenanceRequests"));
const WorkOrders = lazy(() => import("./views/Super-admin/CIMS/maintenance/WorkOrders"));
const StaffAssignment = lazy(() => import("./views/Super-admin/CIMS/maintenance/StaffAssignment"));

// ── CIMS → Asset Management ────────────────────────────────────────────────
const Equipment = lazy(() => import("./views/Super-admin/CIMS/asset management/Equipment"));
const Furniture = lazy(() => import("./views/Super-admin/CIMS/asset management/Furniture"));
const Inventory = lazy(() => import("./views/Super-admin/CIMS/asset management/Inventory"));

// ── Insights & System → Reports ────────────────────────────────────────────
const ReportsView = lazy(() => import("./views/Super-admin/Insights & System/reports/ReportsView"));
const CustomReportBuilder = lazy(() => import("./views/Super-admin/Insights & System/reports/CustomReportBuilder"));

// ── Insights & System → Communication ──────────────────────────────────────
const CommunicationAdminView = lazy(() => import("./views/Super-admin/Insights & System/communication/CommunicationAdminView"));
const NotificationHistory = lazy(() => import("./views/Super-admin/Insights & System/communication/NotificationHistory"));

// ── Insights & System → System Settings ────────────────────────────────────
const RBACSettingsView = lazy(() => import("./views/Super-admin/Insights & System/System-settings/RBACSettingsView"));
const EmailTemplatesView = lazy(() => import("./views/Super-admin/Insights & System/System-settings/EmailTemplatesView"));
const IntegrationSettingsView = lazy(() => import("./views/Super-admin/Insights & System/System-settings/IntegrationSettingsView"));
const DeviceManagement = lazy(() => import("./views/Super-admin/Insights & System/System-settings/DeviceManagement"));

// ═══════════════════════════════════════════════════════════════════════════════
// HOSTEL ADMIN VIEWS
// ═══════════════════════════════════════════════════════════════════════════════

// ── Dashboard ───────────────────────────────────────────────────────────────
const HostelDashboard = lazy(() => import("./views/Hostel-admin/Dashboard/HostelDashboard"));

// ── Resident Management → Room & Allocation ─────────────────────────────────
const RoomAllocations = lazy(() => import("./views/Hostel-admin/Resident Management/Room & Allocation/RoomAllocations"));
const ResidentDirectory = lazy(() => import("./views/Hostel-admin/Resident Management/Room & Allocation/ResidentDirectory"));
const OccupancyStatus = lazy(() => import("./views/Hostel-admin/Resident Management/Room & Allocation/OccupancyStatus"));

// ── Resident Management → Entry & Attendance ────────────────────────────────
const EntryExitLog = lazy(() => import("./views/Hostel-admin/Resident Management/Entry & Attendance/EntryExitLog"));
const NightlyAttendance = lazy(() => import("./views/Hostel-admin/Resident Management/Entry & Attendance/NightlyAttendance"));
const LateEntryRequests = lazy(() => import("./views/Hostel-admin/Resident Management/Entry & Attendance/LateEntryRequests"));

// ── Facilities → Mess Management ────────────────────────────────────────────
const DailyMenu = lazy(() => import("./views/Hostel-admin/Facilities/Mess Management/DailyMenu"));
const MealPlans = lazy(() => import("./views/Hostel-admin/Facilities/Mess Management/MealPlans"));
const FoodInventory = lazy(() => import("./views/Hostel-admin/Facilities/Mess Management/FoodInventory"));
const ResidentFeedback = lazy(() => import("./views/Hostel-admin/Facilities/Mess Management/ResidentFeedback"));

// ── Facilities → Complaints & Maintenance ───────────────────────────────────
const EscalateToMaintenance = lazy(() => import("./views/Hostel-admin/Facilities/Complaints & Maintenance/EscalateToMaintenance"));
const ResolvedComplaints = lazy(() => import("./views/Hostel-admin/Facilities/Complaints & Maintenance/ResolvedComplaints"));

// ── Finance & Reports → Fees & Finance ──────────────────────────────────────
const FeeCollection = lazy(() => import("./views/Hostel-admin/Finance & Reports/Fees & Finance/FeeCollection"));
const FeeReceipts = lazy(() => import("./views/Hostel-admin/Finance & Reports/Fees & Finance/FeeReceipts"));

// ── Finance & Reports → Reports ─────────────────────────────────────────────
const OccupancyReports = lazy(() => import("./views/Hostel-admin/Finance & Reports/Reports/OccupancyReports"));
const AttendanceReports = lazy(() => import("./views/Hostel-admin/Finance & Reports/Reports/AttendanceReports"));

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSPORT ADMIN VIEWS
// ═══════════════════════════════════════════════════════════════════════════════

// ── Dashboard ───────────────────────────────────────────────────────────────
const TransportDashboard = lazy(() => import("./views/Transport-admin/TransportDashboard"));

// ── Fleet & Routes → Bus Fleet ──────────────────────────────────────────────
const VehicleRegistry = lazy(() => import("./views/Transport-admin/VehicleRegistry"));
const MaintenanceSchedule = lazy(() => import("./views/Transport-admin/MaintenanceSchedule"));
const FuelManagement = lazy(() => import("./views/Transport-admin/FuelManagement"));

// ── Fleet & Routes → Routes & Schedules ─────────────────────────────────────
const RouteManagement = lazy(() => import("./views/Transport-admin/RouteManagement"));
const ScheduleManagement = lazy(() => import("./views/Transport-admin/ScheduleManagement"));
const RouteDeviationAlerts = lazy(() => import("./views/Transport-admin/RouteDeviationAlerts"));

// ── Drivers & Passes → Driver Management ────────────────────────────────────
const DriverProfiles = lazy(() => import("./views/Transport-admin/DriverProfiles"));
const DriverAttendance = lazy(() => import("./views/Transport-admin/DriverAttendance"));
const IncidentReports = lazy(() => import("./views/Transport-admin/IncidentReports"));

// ── Drivers & Passes → Bus Pass Management ──────────────────────────────────
const StudentBusPasses = lazy(() => import("./views/Transport-admin/StudentBusPasses"));
const FacultyBusPasses = lazy(() => import("./views/Transport-admin/FacultyBusPasses"));
const PassRevenue = lazy(() => import("./views/Transport-admin/PassRevenue"));

// ── Tracking ────────────────────────────────────────────────────────────────
const GPSLiveMap = lazy(() => import("./views/Transport-admin/GPSLiveMap"));
const ETABoard = lazy(() => import("./views/Transport-admin/ETABoard"));

// ── Reports & Analytics ─────────────────────────────────────────────────────
const RouteEfficiencyReports = lazy(() => import("./views/Transport-admin/RouteEfficiencyReports"));
const DriverPerformance = lazy(() => import("./views/Transport-admin/DriverPerformance"));

// ═══════════════════════════════════════════════════════════════════════════════
// DRIVER VIEWS
// ═══════════════════════════════════════════════════════════════════════════════

// ── Dashboard ───────────────────────────────────────────────────────────────
const DriverDashboard = lazy(() => import("./views/Drivers/DriverDashboard"));

// ── My Routes & Schedule ────────────────────────────────────────────────────
const TodaysSchedule = lazy(() => import("./views/Drivers/TodaysSchedule"));
const RouteMap = lazy(() => import("./views/Drivers/RouteMap"));
const TripHistory = lazy(() => import("./views/Drivers/TripHistory"));

// ── Attendance & Leave ──────────────────────────────────────────────────────
const MarkAttendance = lazy(() => import("./views/Drivers/MarkAttendance"));
const LeaveApplication = lazy(() => import("./views/Drivers/LeaveApplication"));

// ── Reporting ───────────────────────────────────────────────────────────────
const IncidentReport = lazy(() => import("./views/Drivers/IncidentReport"));
const FuelLog = lazy(() => import("./views/Drivers/FuelLog"));
const BusConditionReport = lazy(() => import("./views/Drivers/BusConditionReport"));

// ═══════════════════════════════════════════════════════════════════════════════
// STUDENT VIEWS
// ═══════════════════════════════════════════════════════════════════════════════

// ── Dashboard ───────────────────────────────────────────────────────────────
const StudentDashboard = lazy(() => import("./views/Students/StudentDashboard"));

// ── Hostel ──────────────────────────────────────────────────────────────────
const MyRoomDetails = lazy(() => import("./views/Students/MyRoomDetails"));
const EntryExitPass = lazy(() => import("./views/Students/EntryExitPass"));
const AttendanceRecord = lazy(() => import("./views/Students/AttendanceRecord"));
const MessMenu = lazy(() => import("./views/Students/MessMenu"));
const MealPlan = lazy(() => import("./views/Students/MealPlan"));
const MessFeedback = lazy(() => import("./views/Students/MessFeedback"));
const RaiseComplaint = lazy(() => import("./views/Students/RaiseComplaint"));
const MyComplaints = lazy(() => import("./views/Students/MyComplaints"));

// ── Transport ───────────────────────────────────────────────────────────────
const MyBusPass = lazy(() => import("./views/Students/MyBusPass"));
const ApplyRenewPass = lazy(() => import("./views/Students/ApplyRenewPass"));
const LiveBusTracking = lazy(() => import("./views/Students/LiveBusTracking"));
const RouteSchedule = lazy(() => import("./views/Students/RouteSchedule"));

// ── Campus ──────────────────────────────────────────────────────────────────
const BookFacility = lazy(() => import("./views/Students/BookFacility"));
const MyBookings = lazy(() => import("./views/Students/MyBookings"));
const StudentParkingPass = lazy(() => import("./views/Students/MyParkingPass"));
const Announcements = lazy(() => import("./views/Students/Announcements"));

// ═══════════════════════════════════════════════════════════════════════════════
// MAINTENANCE STAFF VIEWS
// ═══════════════════════════════════════════════════════════════════════════════

// ── Dashboard ───────────────────────────────────────────────────────────────
const MaintenanceDashboard = lazy(() => import("./views/Maintenance Staff/MaintenanceDashboard"));

// ── Work Orders ─────────────────────────────────────────────────────────────
const MyWorkOrders = lazy(() => import("./views/Maintenance Staff/MyWorkOrders"));
const UpdateWorkStatus = lazy(() => import("./views/Maintenance Staff/UpdateWorkStatus"));
const CompletedWorkHistory = lazy(() => import("./views/Maintenance Staff/CompletedWorkHistory"));

// ── Attendance & Leave ──────────────────────────────────────────────────────
const MaintenanceMarkAttendance = lazy(() => import("./views/Maintenance Staff/MarkAttendance"));
const MaintenanceLeaveApplication = lazy(() => import("./views/Maintenance Staff/LeaveApplication"));

// ── Inventory Access ────────────────────────────────────────────────────────
const RequestMaterials = lazy(() => import("./views/Maintenance Staff/RequestMaterials"));
const MyMaterialLog = lazy(() => import("./views/Maintenance Staff/MyMaterialLog"));

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════════════
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
      // ── Shared ────────────────────────────────────────────────────────────
      { path: "/dashboard/default", element: <DefaultDashboard /> },

      // ════════════════════════════════════════════════════════════════════════
      // FACULTY ROUTES
      // ════════════════════════════════════════════════════════════════════════

      // ── HR & Payroll ────────────────────────────────────────────────────
      { path: "/hr/profile", element: <ProfileView /> },
      { path: "/hr/leave", element: <LeaveAppView /> },
      { path: "/hr/payroll", element: <PayrollView /> },
      { path: "/attendance/logs", element: <AttendanceView /> },

      // ── Finance ─────────────────────────────────────────────────────────
      { path: "/finance/claims", element: <ReimbursementView /> },

      // ── Legal & Governance ──────────────────────────────────────────────
      { path: "/governance/policies", element: <GovernanceView /> },
      { path: "/legal/contracts", element: <LegalView /> },
      { path: "/grievance/submit", element: <GrievanceView /> },

      // ── Academic & Research ─────────────────────────────────────────────
      { path: "/research/publications", element: <PublicationView /> },
      { path: "/research/grants", element: <GrantsView /> },
      { path: "/research/appraisal", element: <AppraisalView /> },
      { path: "/engagement/portfolio", element: <EngagementView /> },
      { path: "/committee/meetings", element: <MeetingView /> },

      // ── Campus & Logistics ──────────────────────────────────────────────
      { path: "/logistics/assets", element: <AssetView /> },
      { path: "/faculty/assets/request", element: <RequestEquipment /> },
      { path: "/faculty/bookings/book", element: <RoomBookingView /> },
      { path: "/faculty/parking/pass", element: <MyParkingPass /> },
      { path: "/faculty/parking/availability", element: <ParkingAvailability /> },

      // ── Campus Info ─────────────────────────────────────────────────────
      { path: "/faculty/announcements/noticeboard", element: <NoticeboardView /> },

      // ════════════════════════════════════════════════════════════════════════
      // SUPER ADMIN ROUTES
      // ════════════════════════════════════════════════════════════════════════

      // ── Dashboard ───────────────────────────────────────────────────────
      { path: "/admin/dashboard", element: <AdminDashboard /> },

      // ── HR ──────────────────────────────────────────────────────────────
      { path: "/admin/hr/onboarding", element: <FacultyRegistrationView /> },
      { path: "/admin/hr/probation", element: <ProbationView /> },
      { path: "/admin/hr/leaves", element: <LeaveApprovalView /> },

      // ── Faculty Management ──────────────────────────────────────────────
      { path: "/admin/faculty/all", element: <AllFacultyView /> },
      { path: "/admin/faculty/promotions", element: <PromotionsView /> },
      { path: "/admin/faculty/transfers", element: <TransfersView /> },

      // ── Attendance ──────────────────────────────────────────────────────
      { path: "/admin/attendance/monitor", element: <AttendanceMonitorView /> },
      { path: "/admin/attendance/regularization", element: <RegularizationView /> },

      // ── Finance ─────────────────────────────────────────────────────────
      { path: "/admin/finance/claims", element: <ClaimsApprovalView /> },
      { path: "/admin/finance/payroll", element: <PayrollProcessingView /> },
      { path: "/admin/finance/loans", element: <LoanManagementView /> },

      // ── Legal ───────────────────────────────────────────────────────────
      { path: "/admin/legal/policies", element: <PolicyManagementView /> },
      { path: "/admin/legal/compliance", element: <PolicyComplianceView /> },
      { path: "/admin/legal/contracts", element: <BondManagementView /> },

      // ── Grievance ───────────────────────────────────────────────────────
      { path: "/admin/grievance/queue", element: <GrievanceManagementView /> },

      // ── Academic ────────────────────────────────────────────────────────
      { path: "/admin/academic/committees", element: <CommitteeManagementView /> },
      { path: "/admin/academic/engagement", element: <EngagementAdminView /> },

      // ── Research ────────────────────────────────────────────────────────
      { path: "/admin/research/pbas", element: <PbasAdminView /> },
      { path: "/admin/research/grants", element: <GrantAdminView /> },

      // ── Logistics ───────────────────────────────────────────────────────
      { path: "/admin/logistics/assets", element: <AssetAdminView /> },
      { path: "/admin/logistics/bookings", element: <RoomBookingAdminView /> },
      { path: "/admin/logistics/maintenance", element: <AssetMaintenanceView /> },

      // ── Data ────────────────────────────────────────────────────────────
      { path: "/admin/data/bulk", element: <BulkOperationsView /> },

      // ── CIMS → Campus Management ────────────────────────────────────────
      { path: "/admin/CIMS/classrooms", element: <Classrooms /> },
      { path: "/admin/CIMS/buildings", element: <Buildings /> },
      { path: "/admin/CIMS/laboratories", element: <Laboratories /> },
      { path: "/admin/CIMS/auditoriums", element: <Auditoriums /> },
      { path: "/admin/CIMS/seminar-halls", element: <SeminarHalls /> },
      { path: "/admin/CIMS/custom-infrastructure", element: <CustomInfrastructure /> },
      { path: "/admin/CIMS/campus-digital-twin", element: <CampusDigitalTwin /> },

      // ── CIMS → Booking Management ───────────────────────────────────────
      { path: "/admin/CIMS/room-booking", element: <RoomBooking /> },
      { path: "/admin/CIMS/lab-booking", element: <LabBooking /> },
      { path: "/admin/CIMS/auditorium-booking", element: <AuditoriumBooking /> },
      { path: "/admin/CIMS/calendar-booking", element: <CalendarBooking /> },
      { path: "/admin/CIMS/custom-booking", element: <CustomBooking /> },

      // ── CIMS → Hostel Management ────────────────────────────────────────
      { path: "/admin/CIMS/hostel-overview", element: <HostelOverview /> },
      { path: "/admin/CIMS/boys-hostel", element: <BoysHostel /> },
      { path: "/admin/CIMS/girls-hostel", element: <GirlsHostel /> },
      { path: "/admin/CIMS/hostel-complaints", element: <HostelComplaints /> },
      { path: "/admin/CIMS/hostel-entry-exit", element: <HostelEntryExit /> },
      { path: "/admin/CIMS/hostel-mess", element: <HostelMess /> },
      { path: "/admin/CIMS/hostel-attendance", element: <HostelAttendance /> },

      // ── CIMS → Transportation ───────────────────────────────────────────
      { path: "/admin/CIMS/transport/fleet", element: <BusFleetView /> },
      { path: "/admin/CIMS/transport/routes", element: <RoutesView /> },
      { path: "/admin/CIMS/transport/drivers", element: <DriversView /> },
      { path: "/admin/CIMS/transport/passes", element: <StudentPassesView /> },
      { path: "/admin/CIMS/transport/tracking", element: <LiveTrackingView /> },

      // ── CIMS → Parking ──────────────────────────────────────────────────
      { path: "/admin/CIMS/parking/management", element: <ParkingManagement /> },
      { path: "/admin/CIMS/parking/passes", element: <ParkingPasses /> },
      { path: "/admin/CIMS/parking/gate-management", element: <GateManagement /> },

      // ── CIMS → Maintenance ──────────────────────────────────────────────
      { path: "/admin/CIMS/maintenance/requests", element: <MaintenanceRequests /> },
      { path: "/admin/CIMS/maintenance/work-orders", element: <WorkOrders /> },
      { path: "/admin/CIMS/maintenance/staff-assignment", element: <StaffAssignment /> },

      // ── CIMS → Asset Management ─────────────────────────────────────────
      { path: "/admin/CIMS/asset-management/equipment", element: <Equipment /> },
      { path: "/admin/CIMS/asset-management/furniture", element: <Furniture /> },
      { path: "/admin/CIMS/asset-management/inventory", element: <Inventory /> },

      // ── Insights & System → Reports ─────────────────────────────────────
      { path: "/admin/reports/ReportsView", element: <ReportsView /> },
      { path: "/admin/reports/custom", element: <CustomReportBuilder /> },

      // ── Insights & System → Communication ───────────────────────────────
      { path: "/admin/communication/announcements", element: <CommunicationAdminView /> },
      { path: "/admin/insights/notification-history", element: <NotificationHistory /> },

      // ── Insights & System → System Settings ─────────────────────────────
      { path: "/admin/settings/rbac", element: <RBACSettingsView /> },
      { path: "/admin/communication/templates", element: <EmailTemplatesView /> },
      { path: "/admin/settings/integrations", element: <IntegrationSettingsView /> },
      { path: "/admin/settings/device-management", element: <DeviceManagement /> },

      // ════════════════════════════════════════════════════════════════════════
      // HOSTEL ADMIN ROUTES
      // ════════════════════════════════════════════════════════════════════════

      // ── Dashboard ───────────────────────────────────────────────────────
      { path: "/hostel/dashboard", element: <HostelDashboard /> },

      // ── Room & Allocation ───────────────────────────────────────────────
      { path: "/hostel/rooms/allocations", element: <RoomAllocations /> },
      { path: "/hostel/rooms/directory", element: <ResidentDirectory /> },
      { path: "/hostel/rooms/occupancy", element: <OccupancyStatus /> },

      // ── Entry & Attendance ──────────────────────────────────────────────
      { path: "/hostel/attendance/entry-exit", element: <EntryExitLog /> },
      { path: "/hostel/attendance/nightly", element: <NightlyAttendance /> },
      { path: "/hostel/attendance/late-entry", element: <LateEntryRequests /> },

      // ── Mess Management ─────────────────────────────────────────────────
      { path: "/hostel/facilities/mess/menu", element: <DailyMenu /> },
      { path: "/hostel/facilities/mess/plans", element: <MealPlans /> },
      { path: "/hostel/facilities/mess/inventory", element: <FoodInventory /> },
      { path: "/hostel/facilities/mess/feedback", element: <ResidentFeedback /> },

      // ── Complaints & Maintenance ────────────────────────────────────────
      { path: "/hostel/complaints/escalate", element: <EscalateToMaintenance /> },
      { path: "/hostel/complaints/resolved", element: <ResolvedComplaints /> },

      // ── Fees & Finance ──────────────────────────────────────────────────
      { path: "/hostel/finance/collection", element: <FeeCollection /> },
      { path: "/hostel/finance/receipts", element: <FeeReceipts /> },

      // ── Reports ─────────────────────────────────────────────────────────
      { path: "/hostel/reports/occupancy", element: <OccupancyReports /> },
      { path: "/hostel/reports/attendance", element: <AttendanceReports /> },

      // ════════════════════════════════════════════════════════════════════════
      // OTHER ROLE ROUTES (placeholder)
      // ════════════════════════════════════════════════════════════════════════

      // ════════════════════════════════════════════════════════════════════════
      // TRANSPORT ADMIN ROUTES
      // ════════════════════════════════════════════════════════════════════════

      // ── Dashboard ───────────────────────────────────────────────────────
      { path: "/transport/dashboard", element: <TransportDashboard /> },

      // ── Fleet & Routes → Bus Fleet ────────────────────────────────────
      { path: "/transport/fleet/registry", element: <VehicleRegistry /> },
      { path: "/transport/fleet/maintenance", element: <MaintenanceSchedule /> },
      { path: "/transport/fleet/fuel", element: <FuelManagement /> },

      // ── Fleet & Routes → Routes & Schedules ───────────────────────────
      { path: "/transport/routes/management", element: <RouteManagement /> },
      { path: "/transport/routes/schedules", element: <ScheduleManagement /> },
      { path: "/transport/routes/alerts", element: <RouteDeviationAlerts /> },

      // ── Drivers & Passes → Driver Management ──────────────────────────
      { path: "/transport/drivers/profiles", element: <DriverProfiles /> },
      { path: "/transport/drivers/attendance", element: <DriverAttendance /> },
      { path: "/transport/drivers/incidents", element: <IncidentReports /> },

      // ── Drivers & Passes → Bus Pass Management ────────────────────────
      { path: "/transport/passes/students", element: <StudentBusPasses /> },
      { path: "/transport/passes/faculty", element: <FacultyBusPasses /> },
      { path: "/transport/passes/revenue", element: <PassRevenue /> },

      // ── Tracking ──────────────────────────────────────────────────────
      { path: "/transport/tracking/live", element: <GPSLiveMap /> },
      { path: "/transport/tracking/eta", element: <ETABoard /> },

      // ── Reports & Analytics ───────────────────────────────────────────
      { path: "/transport/reports/routes", element: <RouteEfficiencyReports /> },
      { path: "/transport/reports/drivers", element: <DriverPerformance /> },

      // ════════════════════════════════════════════════════════════════════════
      // DRIVER ROUTES
      // ════════════════════════════════════════════════════════════════════════

      // ── Dashboard ───────────────────────────────────────────────────────
      { path: "/driver/dashboard", element: <DriverDashboard /> },

      // ── My Routes & Schedule ──────────────────────────────────────────
      { path: "/driver/schedule/today", element: <TodaysSchedule /> },
      { path: "/driver/schedule/map", element: <RouteMap /> },
      { path: "/driver/schedule/history", element: <TripHistory /> },

      // ── Attendance & Leave ────────────────────────────────────────────
      { path: "/driver/attendance/mark", element: <MarkAttendance /> },
      { path: "/driver/attendance/leave", element: <LeaveApplication /> },

      // ── Reporting ─────────────────────────────────────────────────────
      { path: "/driver/reports/incident", element: <IncidentReport /> },
      { path: "/driver/reports/fuel", element: <FuelLog /> },
      { path: "/driver/reports/condition", element: <BusConditionReport /> },

      // ── Student ─────────────────────────────────────────────────────────
      { path: "/student/dashboard", element: <StudentDashboard /> },
      { path: "/student/hostel/room", element: <MyRoomDetails /> },
      { path: "/student/hostel/exit-pass", element: <EntryExitPass /> },
      { path: "/student/hostel/attendance", element: <AttendanceRecord /> },
      { path: "/student/mess/menu", element: <MessMenu /> },
      { path: "/student/mess/plan", element: <MealPlan /> },
      { path: "/student/mess/feedback", element: <MessFeedback /> },
      { path: "/student/complaints/raise", element: <RaiseComplaint /> },
      { path: "/student/complaints/mine", element: <MyComplaints /> },
      { path: "/student/transport/pass", element: <MyBusPass /> },
      { path: "/student/transport/apply", element: <ApplyRenewPass /> },
      { path: "/student/transport/tracking", element: <LiveBusTracking /> },
      { path: "/student/transport/route", element: <RouteSchedule /> },
      { path: "/student/bookings/book", element: <BookFacility /> },
      { path: "/student/bookings/mine", element: <MyBookings /> },
      { path: "/student/parking/pass", element: <StudentParkingPass /> },
      { path: "/student/announcements", element: <Announcements /> },

      // ── Maintenance Staff ───────────────────────────────────────────────
      { path: "/maintenance/dashboard", element: <MaintenanceDashboard /> },
      { path: "/maintenance/work/orders", element: <MyWorkOrders /> },
      { path: "/maintenance/work/update", element: <UpdateWorkStatus /> },
      { path: "/maintenance/work/history", element: <CompletedWorkHistory /> },
      { path: "/maintenance/attendance/mark", element: <MaintenanceMarkAttendance /> },
      { path: "/maintenance/attendance/leave", element: <MaintenanceLeaveApplication /> },
      { path: "/maintenance/inventory/request", element: <RequestMaterials /> },
      { path: "/maintenance/inventory/log", element: <MyMaterialLog /> }
    ]
  },

  { path: "*", element: <Navigate to="/session/signin" /> }
];

export default routes;
