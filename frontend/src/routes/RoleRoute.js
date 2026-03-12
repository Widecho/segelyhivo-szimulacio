import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

function RoleRoute({ allowedRole, children }) {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return <p>Betöltés...</p>;
  }

  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleRoute;