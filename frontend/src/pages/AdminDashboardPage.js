import { Link } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import DashboardCard from "../components/DashboardCard";

function AdminDashboardPage() {
  const { username } = useAuth();

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Admin irányítópult</h2>
          <p className="page-description">
            Üdv, <strong>{username}</strong>! Itt kezelheted a felhasználókat,
            a szituációkat és az értékelési eredményeket.
          </p>
        </div>
      </div>

      <div className="card-grid three-col">
        <DashboardCard
          title="Felhasználók kezelése"
          description="A rendszerben szereplő felhasználók áttekintése és adminisztrációja."
          footer={
            <Link to="/admin/users" className="secondary-button">
              Megnyitás
            </Link>
          }
        />

        <DashboardCard
          title="Szituációk"
          description="A meglévő szituációk listázása, szerkesztése, aktiválása és kezelése."
          footer={
            <Link to="/admin/scenarios" className="primary-button">
              Megnyitás
            </Link>
          }
        />

        <DashboardCard
          title="Új szituáció"
          description="Új oktatási szituáció létrehozása adminisztrátorként."
          footer={
            <Link to="/admin/scenarios/new" className="secondary-button">
              Megnyitás
            </Link>
          }
        />

        <DashboardCard
          title="Eredmények"
          description="A felhasználók teljesítményeinek és próbálkozásainak áttekintése."
          footer={
            <Link to="/admin/results" className="secondary-button">
              Megnyitás
            </Link>
          }
        />
      </div>
    </div>
  );
}

export default AdminDashboardPage;