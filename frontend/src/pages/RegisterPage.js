import AuthLayout from "../layouts/AuthLayout";
import "../styles/auth.css";

function RegisterPage() {
  return (
    <AuthLayout title="Regisztráció">
      <form className="auth-form">
        <div className="auth-form-group">
          <label htmlFor="fullName">Teljes név</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Add meg a teljes neved"
          />
        </div>

        <div className="auth-form-group">
          <label htmlFor="username">Felhasználónév</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Adj meg egy felhasználónevet"
          />
        </div>

        <div className="auth-form-group">
          <label htmlFor="password">Jelszó</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Adj meg egy jelszót"
          />
        </div>

        <div className="auth-form-group">
          <label htmlFor="confirmPassword">Jelszó megerősítése</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Ismételd meg a jelszót"
          />
        </div>

        <p className="auth-helper-text">
          A jelszónak később legalább egy nagybetűt és egy számot kell tartalmaznia.
        </p>

        <button type="submit" className="auth-form-button">
          Regisztráció
        </button>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;