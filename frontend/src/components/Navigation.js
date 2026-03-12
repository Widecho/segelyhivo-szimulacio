import { Link } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

function Navigation() {
  const { authState, logout } = useAuth();

  return (
    <nav style={{ marginBottom: "24px" }}>
      <Link to="/" style={{ marginRight: "16px" }}>
        Kezdőoldal
      </Link>

      {!authState.isAuthenticated && (
        <>
          <Link to="/login" style={{ marginRight: "16px" }}>
            Bejelentkezés
          </Link>

          <Link to="/register" style={{ marginRight: "16px" }}>
            Regisztráció
          </Link>
        </>
      )}

      {authState.isAuthenticated && (
        <>
          <span style={{ marginRight: "16px" }}>
            Belépve: {authState.username} ({authState.role})
          </span>

          <button
            onClick={logout}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #cccccc",
              backgroundColor: "#ffffff",
              cursor: "pointer",
            }}
          >
            Kijelentkezés
          </button>
        </>
      )}
    </nav>
  );
}

export default Navigation;