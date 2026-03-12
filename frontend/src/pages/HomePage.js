import { useAuth } from "../services/AuthContext";

function HomePage() {
  const { authState } = useAuth();

  return (
    <div>
      <h2>Kezdőoldal</h2>
      <p>
        Ez a felület egy magyar 112-es segélyhívó működését szimuláló oktatási
        alkalmazás alapja.
      </p>

      {authState.isAuthenticated ? (
        <div>
          <p><strong>Bejelentkezett felhasználó:</strong> {authState.username}</p>
          <p><strong>Szerepkör:</strong> {authState.role}</p>
        </div>
      ) : (
        <p>Jelenleg nincs bejelentkezett felhasználó.</p>
      )}
    </div>
  );
}

export default HomePage;