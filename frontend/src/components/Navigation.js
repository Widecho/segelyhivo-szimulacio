import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

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
        marginBottom: "24px",
        padding: "16px 18px",
        border: "1px solid rgba(203, 213, 225, 0.85)",
        borderRadius: "18px",
        background: "rgba(255,255,255,0.82)",
        boxShadow: "0 10px 28px rgba(15, 23, 42, 0.07)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "14px",
      }}
    >
      {!isAuthenticated ? (
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <Link to="/" className="secondary-button">
            Kezdőlap
          </Link>
          <Link to="/login" className="secondary-button">
            Bejelentkezés
          </Link>
          <Link to="/register" className="primary-button">
            Regisztráció
          </Link>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #1f3c88, #4c74d1)",
                color: "#fff",
                fontWeight: 800,
              }}
            >
              {(username || "U").slice(0, 1).toUpperCase()}
            </div>

            <div>
              <div style={{ fontWeight: 800, color: "#172033" }}>{username}</div>
              <div style={{ fontSize: "13px", color: "#667085" }}>{role}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            {role === "ADMIN" ? (
              <>
                <Link to="/dashboard/admin" className="secondary-button">
                  Admin főoldal
                </Link>
                <Link to="/admin/users" className="secondary-button">
                  Felhasználók
                </Link>
                <Link to="/admin/scenarios" className="secondary-button">
                  Szituációk
                </Link>
                <Link to="/admin/results" className="secondary-button">
                  Eredmények
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard/user" className="secondary-button">
                  Saját felület
                </Link>
                <Link to="/user/simulation" className="secondary-button">
                  Szimuláció
                </Link>
                <Link to="/user/results" className="secondary-button">
                  Eredmények
                </Link>
                <Link to="/profile" className="secondary-button">
                  Profil
                </Link>
              </>
            )}

            <button type="button" onClick={handleLogout} className="danger-button">
              Kijelentkezés
            </button>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navigation;