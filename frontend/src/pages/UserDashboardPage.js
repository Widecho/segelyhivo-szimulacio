import { Link } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import DashboardCard from "../components/DashboardCard";

function dashboardLinkStyle() {
  return {
    display: "inline-block",
    padding: "10px 14px",
    backgroundColor: "#1f3c88",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: 600,
  };
}

function UserDashboardPage() {
  const { username } = useAuth();

  return (
    <div>
      <h2>Felhasználói irányítópult</h2>
      <p>
        Üdv, <strong>{username}</strong>! Innen érheted el a szimulációt,
        a korábbi eredményeidet és a profilodat.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <DashboardCard
          title="Szimuláció indítása"
          description="Új 112-es operátori szituáció indítása."
          footer={
            <Link to="/user/simulation" style={dashboardLinkStyle()}>
              Megnyitás
            </Link>
          }
        />

        <DashboardCard
          title="Korábbi eredmények"
          description="A teljesített szituációk és értékelések áttekintése."
          footer={
            <Link to="/user/results" style={dashboardLinkStyle()}>
              Megnyitás
            </Link>
          }
        />

        <DashboardCard
          title="Profil"
          description="A saját felhasználói adatok és állapot megtekintése."
          footer={
            <Link to="/profile" style={dashboardLinkStyle()}>
              Megnyitás
            </Link>
          }
        />
      </div>
    </div>
  );
}

export default UserDashboardPage;