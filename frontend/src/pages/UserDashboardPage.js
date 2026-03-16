import { Link } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import DashboardCard from "../components/DashboardCard";

function UserDashboardPage() {
  const { username } = useAuth();

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Felhasználói irányítópult</h2>
          <p className="page-description">
            Üdv, <strong>{username}</strong>! Innen érheted el a szimulációt,
            a korábbi eredményeidet és a profilodat.
          </p>
        </div>
      </div>

      <div className="card-grid three-col">
        <DashboardCard
          title="Szimuláció indítása"
          description="Új 112-es operátori gyakorlati szituáció indítása."
          footer={
            <Link to="/user/simulation" className="primary-button">
              Megnyitás
            </Link>
          }
        />

        <DashboardCard
          title="Korábbi eredmények"
          description="A teljesített szituációk és a részletes kiértékelések áttekintése."
          footer={
            <Link to="/user/results" className="secondary-button">
              Megnyitás
            </Link>
          }
        />

        <DashboardCard
          title="Profil"
          description="A saját felhasználói adatok és állapot megtekintése."
          footer={
            <Link to="/profile" className="secondary-button">
              Megnyitás
            </Link>
          }
        />
      </div>
    </div>
  );
}

export default UserDashboardPage;