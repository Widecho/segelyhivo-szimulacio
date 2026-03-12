import { useState } from "react";
import InfoCard from "../components/InfoCard";
import mockUsers from "../utils/mockUsers";
import { loadLatestSimulationResult } from "../utils/simulationResultStorage";
import "../styles/auth.css";

function AdminUsersPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");

  const latestResult = loadLatestSimulationResult();

  const latestActiveUser = latestResult
    ? {
        id: "LATEST-USER",
        fullName: latestResult.callerName || "Mock felhasználó",
        username: "mock.user",
        role: "USER",
        completedScenarios: 1,
        lastScenarioTitle: latestResult.title,
        lastScenarioDate: latestResult.date,
        lastScenarioScore: latestResult.score,
      }
    : null;

  const handleShowDetails = (user) => {
    setSelectedUser(user);
    setMessage("");
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setMessage(
      `Mock művelet: ${user.fullName} jelszava visszaállítva az alapértelmezett Abc123 értékre.`
    );
  };

  return (
    <div>
      <h2>Felhasználók kezelése</h2>
      <p>
        Itt jelennek meg a rendszer felhasználói. Később innen lehet majd
        jelszót visszaállítani és a részletes adatokat megtekinteni.
      </p>

      {latestActiveUser && (
        <div style={{ marginTop: "24px", marginBottom: "28px" }}>
          <h3>Legutóbb aktív felhasználó</h3>

          <InfoCard
            title={`${latestActiveUser.fullName} (${latestActiveUser.role})`}
          >
            <p><strong>Felhasználónév:</strong> {latestActiveUser.username}</p>
            <p>
              <strong>Utolsó szituáció:</strong> {latestActiveUser.lastScenarioTitle}
            </p>
            <p>
              <strong>Utolsó teljesítés ideje:</strong> {latestActiveUser.lastScenarioDate}
            </p>
            <p>
              <strong>Utolsó pontszám:</strong> {latestActiveUser.lastScenarioScore}%
            </p>
          </InfoCard>
        </div>
      )}

      {message && (
        <div
          style={{
            marginTop: "16px",
            marginBottom: "20px",
            padding: "12px 16px",
            borderRadius: "10px",
            backgroundColor: "#eef7ee",
            border: "1px solid #cfe6cf",
          }}
        >
          {message}
        </div>
      )}

      {selectedUser && (
        <div
          style={{
            marginTop: "16px",
            marginBottom: "20px",
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "#f8f8f8",
            border: "1px solid #dddddd",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Kiválasztott felhasználó</h3>
          <p><strong>Teljes név:</strong> {selectedUser.fullName}</p>
          <p><strong>Felhasználónév:</strong> {selectedUser.username}</p>
          <p><strong>Szerepkör:</strong> {selectedUser.role}</p>
          <p>
            <strong>Teljesített szituációk száma:</strong>{" "}
            {selectedUser.completedScenarios}
          </p>
        </div>
      )}

      <div style={{ marginTop: "24px" }}>
        {mockUsers.map((user) => (
          <InfoCard
            key={user.id}
            title={`${user.fullName} (${user.role})`}
            footer={
              <div className="admin-action-row">
                <button
                  type="button"
                  className="admin-action-button"
                  onClick={() => handleShowDetails(user)}
                >
                  Részletek
                </button>

                <button
                  type="button"
                  className="admin-action-button"
                  onClick={() => handleResetPassword(user)}
                >
                  Jelszó visszaállítása
                </button>
              </div>
            }
          >
            <p><strong>Felhasználónév:</strong> {user.username}</p>
            <p>
              <strong>Teljesített szituációk száma:</strong>{" "}
              {user.completedScenarios}
            </p>
          </InfoCard>
        ))}
      </div>
    </div>
  );
}

export default AdminUsersPage;