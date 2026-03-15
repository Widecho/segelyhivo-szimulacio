import { useEffect, useState } from "react";
import { getAdminUsers } from "../services/adminService";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      setIsLoading(true);
      setError("");

      try {
        const response = await getAdminUsers();

        if (isMounted) {
          setUsers(Array.isArray(response) ? response : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Nem sikerült betölteni a felhasználókat.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <h2>Felhasználók kezelése</h2>
      <p>Itt láthatók a rendszerben szereplő felhasználók.</p>

      {isLoading && <p>Betöltés...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!isLoading && !error && users.length === 0 && (
        <p>Jelenleg nincs megjeleníthető felhasználó.</p>
      )}

      {!isLoading && !error && users.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            display: "grid",
            gap: "14px",
          }}
        >
          {users.map((user) => (
            <div
              key={user.id}
              style={{
                border: "1px solid #d9d9d9",
                borderRadius: "12px",
                padding: "16px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: "10px" }}>
                {user.fullName}
              </h3>

              <p style={{ margin: "4px 0" }}>
                <strong>Felhasználónév:</strong> {user.username}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Szerepkör:</strong> {user.role}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Aktív:</strong> {user.isActive ? "Igen" : "Nem"}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Hibás belépések:</strong> {user.failedLoginAttempts}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Létrehozva:</strong> {user.createdAt || "-"}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Frissítve:</strong> {user.updatedAt || "-"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminUsersPage;