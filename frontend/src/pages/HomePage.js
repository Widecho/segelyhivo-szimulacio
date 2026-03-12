import { Link } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

function HomePage() {
  const { isAuthenticated, role, username } = useAuth();

  return (
    <div>
      <h2>Kezdőoldal</h2>
      <p>
        Ez a segélyhívó működését szimuláló oktatási alkalmazás alapja.
      </p>

      {!isAuthenticated ? (
        <div style={{ marginTop: "20px" }}>
          <p>Jelenleg nincs bejelentkezett felhasználó.</p>

          <div style={{ marginTop: "12px" }}>
            <Link to="/login" style={{ marginRight: "16px" }}>
              Bejelentkezés
            </Link>

            <Link to="/register">Regisztráció</Link>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <p>
            Bejelentkezve mint: <strong>{username}</strong> ({role})
          </p>

          <div style={{ marginTop: "12px" }}>
            {role === "ADMIN" ? (
              <Link to="/dashboard/admin">Tovább az admin felületre</Link>
            ) : (
              <Link to="/dashboard/user">Tovább a saját felületre</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;