import DashboardCard from "../components/DashboardCard";
import { useAuth } from "../services/AuthContext";

function UserDashboardPage() {
  const { authState } = useAuth();

  return (
    <div>
      <h2>Felhasználói irányítópult</h2>
      <p>
        Üdv, <strong>{authState.username}</strong>! Itt fogod kezelni a saját
        szituációidat és a későbbiekben innen indul majd a szimuláció.
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
          title="Szituáció indítása"
          description="Innen fogod elérni a beérkező hívásokat és a szimulációs felületet."
          to="/user/simulation"
        />

        <DashboardCard
          title="Korábbi eredményeim"
          description="Itt fogod később visszanézni az eddig teljesített szituációkat és azok kiértékelését."
          to="/user/results"
        />

        <DashboardCard
          title="Profil"
          description="Itt jelennek majd meg a saját felhasználói adataid és a hozzád tartozó statisztikák."
          to="/profile"
        />
      </div>
    </div>
  );
}

export default UserDashboardPage;