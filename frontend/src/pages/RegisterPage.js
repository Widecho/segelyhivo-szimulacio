import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../services/authService";
import { useAuth } from "../services/AuthContext";
import "../styles/auth.css";

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
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
      const response = await registerRequest(formData);

      login({
        username: response.username,
        role: response.role,
        token: response.token,
      });

      setMessage("Sikeres regisztráció.");
      navigate("/dashboard/user");
    } catch (err) {
      setError(err.message || "Sikertelen regisztráció.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Regisztráció</h2>
        <p>Hozz létre új felhasználói fiókot a rendszerhez.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="fullName">Teljes név</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Add meg a teljes neved"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

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
              placeholder="Legalább 1 nagybetű és 1 szám"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {message && <div className="form-message">{message}</div>}

          <button type="submit" className="auth-form-button" disabled={isSubmitting}>
            {isSubmitting ? "Regisztráció..." : "Regisztráció"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;