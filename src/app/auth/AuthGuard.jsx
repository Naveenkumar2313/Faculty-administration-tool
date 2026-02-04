import { useAuth } from "../contexts/AuthContext"; // Import from the new AuthContext
import { Navigate, useLocation } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  if (isAuthenticated) return <>{children}</>;

  return <Navigate replace to="/session/signin" state={{ from: pathname }} />;
};

export default AuthGuard;