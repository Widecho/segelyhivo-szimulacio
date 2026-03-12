import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

function ProtectedRoute({ children }) {
  const { authState } = useAuth();

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;