import InfoCard from "../components/InfoCard";
import mockUsers from "../utils/mockUsers";

function AdminUsersPage() {
  return (
    <div>
      <h2>Felhasználók kezelése</h2>
      <p>
        Itt jelennek meg a rendszer felhasználói. Később innen lehet majd
        jelszót visszaállítani és a részletes adatokat megtekinteni.
      </p>

      <div style={{ marginTop: "24px" }}>
        {mockUsers.map((user) => (
          <InfoCard
            key={user.id}
            title={`${user.fullName} (${user.role})`}
          >
            <p><strong>Felhasználónév:</strong> {user.username}</p>
            <p><strong>Teljesített szituációk száma:</strong> {user.completedScenarios}</p>
          </InfoCard>
        ))}
      </div>
    </div>
  );
}

export default AdminUsersPage;