import DashboardCard from "../components/DashboardCard";
import { useAuth } from "../services/AuthContext";

function AdminDashboardPage() {
  const { authState } = useAuth();

  return (
    <div>
      <h2>Admin irányítópult</h2>
      <p>
        Üdv, <strong>{authState.username}</strong>! Itt fogod kezelni a
        felhasználókat, a szituációkat és a kiértékelések áttekintését.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <DashboardCard
          title="Új szituáció létrehozása"
          description="Itt lesz lehetőség új hanganyaggal és elvárt kitöltéssel rendelkező szituáció létrehozására."
          to="/admin/scenarios/new"
        />

        <DashboardCard
          title="Szituációk kezelése"
          description="Itt lehet majd a meglévő szituációkat listázni, megnyitni és szerkeszteni."
          to="/admin/scenarios"
        />

        <DashboardCard
          title="Felhasználói eredmények"
          description="Itt lesz áttekinthető az összes felhasználó teljesítménye és a korábbi próbálkozások eredménye."
          to="/admin/results"
        />

        <DashboardCard
          title="Felhasználók kezelése"
          description="Itt fog az admin jelszót visszaállítani, illetve később a felhasználói adatokkal kapcsolatos műveleteket végezni."
          to="/admin/users"
        />
      </div>
    </div>
  );
}

export default AdminDashboardPage;