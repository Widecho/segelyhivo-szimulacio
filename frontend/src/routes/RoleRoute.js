import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

function RoleRoute({ allowedRole, children }) {
  const { authState } = useAuth();

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (authState.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleRoute;