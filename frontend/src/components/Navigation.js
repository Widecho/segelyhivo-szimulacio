import { Link } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

function Navigation() {
  const { authState, logout } = useAuth();

  const linkStyle = {
    marginRight: "16px",
  };

  return (
    <nav style={{ marginBottom: "24px" }}>
      <Link to="/" style={linkStyle}>
        Kezdőoldal
      </Link>

      {!authState.isAuthenticated && (
        <>
          <Link to="/login" style={linkStyle}>
            Bejelentkezés
          </Link>

          <Link to="/register" style={linkStyle}>
            Regisztráció
          </Link>
        </>
      )}

      {authState.isAuthenticated && authState.role === "USER" && (
        <>
          <Link to="/dashboard/user" style={linkStyle}>
            Irányítópult
          </Link>

          <Link to="/user/results" style={linkStyle}>
            Saját eredmények
          </Link>

          <Link to="/profile" style={linkStyle}>
            Profil
          </Link>
        </>
      )}

      {authState.isAuthenticated && authState.role === "ADMIN" && (
        <>
          <Link to="/dashboard/admin" style={linkStyle}>
            Irányítópult
          </Link>

          <Link to="/admin/scenarios/new" style={linkStyle}>
            Új szituáció
          </Link>

          <Link to="/admin/scenarios" style={linkStyle}>
            Szituációk
          </Link>

          <Link to="/admin/results" style={linkStyle}>
            Eredmények
          </Link>

          <Link to="/admin/users" style={linkStyle}>
            Felhasználók
          </Link>

          <Link to="/profile" style={linkStyle}>
            Profil
          </Link>
        </>
      )}

      {authState.isAuthenticated && (
        <>
          <span style={{ marginRight: "16px" }}>
            Belépve: {authState.username} ({authState.role})
          </span>

          <button
            type="button"
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