import { useEffect, useState } from "react";
import { getMyProfile } from "../services/userService";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsLoading(true);
      setError("");

      try {
        const response = await getMyProfile();

        if (isMounted) {
          setProfile(response);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Nem sikerült betölteni a profiladatokat.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <h2>Profil</h2>

      {isLoading && <p>Betöltés...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!isLoading && !error && profile && (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            maxWidth: "560px",
            backgroundColor: "#fafafa",
          }}
        >
          <p>
            <strong>Teljes név:</strong> {profile.fullName}
          </p>
          <p>
            <strong>Felhasználónév:</strong> {profile.username}
          </p>
          <p>
            <strong>Szerepkör:</strong> {profile.role}
          </p>
          <p>
            <strong>Aktív:</strong> {profile.isActive ? "Igen" : "Nem"}
          </p>
          <p>
            <strong>Hibás belépések:</strong> {profile.failedLoginAttempts}
          </p>
          <p>
            <strong>Létrehozva:</strong> {profile.createdAt || "-"}
          </p>
          <p>
            <strong>Frissítve:</strong> {profile.updatedAt || "-"}
          </p>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;