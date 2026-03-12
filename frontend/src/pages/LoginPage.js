import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../services/authService";
import { useAuth } from "../services/AuthContext";
import "../styles/auth.css";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await loginRequest({
        username: formData.username,
        password: formData.password,
      });

      login({
        username: response.username,
        role: response.role,
        token: response.token,
      });

      setMessage("Sikeres bejelentkezés.");

      if (String(response.role).toUpperCase() === "ADMIN") {
        navigate("/dashboard/admin");
        return;
      }

      navigate("/dashboard/user");
    } catch (err) {
      setError(err.message || "Sikertelen bejelentkezés.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Bejelentkezés</h2>
        <p>Jelentkezz be a 112 operátori szimulációs rendszerbe.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="username">Felhasználónév</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Add meg a felhasználónevet"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">Jelszó</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Add meg a jelszót"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {message && <div className="form-message">{message}</div>}

          <button type="submit" className="auth-form-button" disabled={isSubmitting}>
            {isSubmitting ? "Bejelentkezés..." : "Bejelentkezés"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;