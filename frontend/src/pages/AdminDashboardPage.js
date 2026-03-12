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

function AdminDashboardPage() {
  const { username } = useAuth();

  return (
    <div>
      <h2>Admin irányítópult</h2>
      <p>
        Üdv, <strong>{username}</strong>! Itt kezelheted a felhasználókat,
        szituációkat és eredményeket.
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
          title="Felhasználók kezelése"
          description="A rendszerben szereplő felhasználók áttekintése."
          footer={
            <Link to="/admin/users" style={dashboardLinkStyle()}>
              Megnyitás
            </Link>
          }
        />

        <DashboardCard
          title="Szituációk"
          description="A meglévő szituációk listázása és kezelése."
          footer={
            <Link to="/admin/scenarios" style={dashboardLinkStyle()}>
              Megnyitás
            </Link>
          }
        />

        <DashboardCard
          title="Új szituáció"
          description="Új szituáció létrehozása adminisztrátorként."
          footer={
            <Link to="/admin/scenarios/new" style={dashboardLinkStyle()}>
              Megnyitás
            </Link>
          }
        />

        <DashboardCard
          title="Eredmények"
          description="A felhasználók teljesítményeinek áttekintése."
          footer={
            <Link to="/admin/results" style={dashboardLinkStyle()}>
              Megnyitás
            </Link>
          }
        />
      </div>
    </div>
  );
}

export default AdminDashboardPage;