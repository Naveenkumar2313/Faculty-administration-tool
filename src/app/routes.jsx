import { lazy } from "react";
import { Navigate } from "react-router-dom";
import ParcLayout from "./components/ParcLayout/ParcLayout";
import DefaultDashboard from "./views/dashboard/DefaultDashboard";

// Lazy Load the new views we just created
const ProfileView = lazy(() => import("./views/hr/ProfileView"));
const LeaveAppView = lazy(() => import("./views/hr/LeaveAppView"));
const PublicationView = lazy(() => import("./views/research/PublicationView"));
const GrantsView = lazy(() => import("./views/research/GrantsView"));
const AppraisalView = lazy(() => import("./views/research/AppraisalView"));
const PayrollView = lazy(() => import("./views/hr/PayrollView"));
const AssetView = lazy(() => import("./views/logistics/AssetView"));
const RoomBookingView = lazy(() => import("./views/logistics/RoomBookingView"));

const routes = [
  { path: "/", element: <Navigate to="dashboard/default" /> },
  {
    element: <ParcLayout />,
    children: [
      // 1. HR Routes
      { path: "/hr/profile", element: <ProfileView /> },
      { path: "/hr/leave", element: <LeaveAppView /> },
      { path: "/hr/payroll", element: <PayrollView /> },
      
      // 2. Research Routes
      { path: "/research/publications", element: <PublicationView /> },
  { path: "/research/grants", element: <GrantsView /> },
  { path: "/research/appraisal", element: <AppraisalView /> },

      // 3. Logistics Routes
      { path: "/logistics/assets", element: <AssetView /> },
      { path: "/logistics/booking", element: <RoomBookingView /> },

      // 4. Existing Dashboard
      { path: "/dashboard/default", element: <DefaultDashboard /> },

    ]
  }
];

export default routes;