import { useAuth } from "../services/AuthContext";

function ProfilePage() {
  const { username, role, isAuthenticated } = useAuth();

  return (
    <div>
      <h2>Profil</h2>

      {!isAuthenticated ? (
        <p>Nincs bejelentkezett felhasználó.</p>
      ) : (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            maxWidth: "500px",
            backgroundColor: "#fafafa",
          }}
        >
          <p>
            <strong>Felhasználónév:</strong> {username}
          </p>
          <p>
            <strong>Szerepkör:</strong> {role}
          </p>
          <p>
            <strong>Állapot:</strong> Bejelentkezve
          </p>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;