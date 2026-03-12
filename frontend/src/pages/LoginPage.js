import AuthLayout from "../layouts/AuthLayout";
import "../styles/auth.css";

function LoginPage() {
  return (
    <AuthLayout title="Bejelentkezés">
      <form className="auth-form">
        <div className="auth-form-group">
          <label htmlFor="username">Felhasználónév</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Add meg a felhasználóneved"
          />
        </div>

        <div className="auth-form-group">
          <label htmlFor="password">Jelszó</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Add meg a jelszavad"
          />
        </div>

        <p className="auth-helper-text">
          A belépés később JWT alapú hitelesítéssel fog működni.
        </p>

        <button type="submit" className="auth-form-button">
          Bejelentkezés
        </button>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;