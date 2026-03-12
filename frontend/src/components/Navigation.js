import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

function linkStyle() {
  return {
    textDecoration: "none",
    color: "#1f3c88",
    fontWeight: 600,
  };
}

function buttonStyle() {
  return {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #cfcfcf",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontWeight: 600,
  };
}

function Navigation() {
  const navigate = useNavigate();
  const { isAuthenticated, role, username, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        marginBottom: "28px",
        padding: "14px 18px",
        border: "1px solid #dddddd",
        borderRadius: "12px",
        backgroundColor: "#fafafa",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "14px",
      }}
    >
      {!isAuthenticated ? (
        <div style={{ display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
          <Link to="/" style={linkStyle()}>
            Kezdőlap
          </Link>
          <Link to="/login" style={linkStyle()}>
            Bejelentkezés
          </Link>
          <Link to="/register" style={linkStyle()}>
            Regisztráció
          </Link>
        </div>
      ) : (
        <>
          <div style={{ fontWeight: 700 }}>
            {username} ({role})
          </div>

          <div style={{ display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
            {role === "ADMIN" ? (
              <>
                <Link to="/dashboard/admin" style={linkStyle()}>
                  Admin főoldal
                </Link>
                <Link to="/admin/users" style={linkStyle()}>
                  Felhasználók
                </Link>
                <Link to="/admin/scenarios" style={linkStyle()}>
                  Szituációk
                </Link>
                <Link to="/admin/results" style={linkStyle()}>
                  Eredmények
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard/user" style={linkStyle()}>
                  Saját felület
                </Link>
                <Link to="/user/simulation" style={linkStyle()}>
                  Szimuláció
                </Link>
                <Link to="/user/results" style={linkStyle()}>
                  Eredmények
                </Link>
                <Link to="/profile" style={linkStyle()}>
                  Profil
                </Link>
              </>
            )}

            <button type="button" onClick={handleLogout} style={buttonStyle()}>
              Kijelentkezés
            </button>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navigation;