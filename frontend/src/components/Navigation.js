import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav style={{ marginBottom: "24px" }}>
      <Link to="/" style={{ marginRight: "16px" }}>
        Kezdőoldal
      </Link>

      <Link to="/login" style={{ marginRight: "16px" }}>
        Bejelentkezés
      </Link>

      <Link to="/register">
        Regisztráció
      </Link>
    </nav>
  );
}

export default Navigation;