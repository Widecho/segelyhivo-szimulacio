import { useAuth } from "../services/AuthContext";

function ProfilePage() {
  const { authState } = useAuth();

  return (
    <div>
      <h2>Profil</h2>
      <p><strong>Felhasználónév:</strong> {authState.username}</p>
      <p><strong>Szerepkör:</strong> {authState.role}</p>
      <p>
        Később itt jelennek majd meg a részletes felhasználói adatok és a saját
        statisztikák.
      </p>
    </div>
  );
}

export default ProfilePage;