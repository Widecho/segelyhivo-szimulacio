import { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import { loginUser } from "../services/authService";
import "../styles/auth.css";

function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "A felhasználónév megadása kötelező.";
    }

    if (!formData.password) {
      newErrors.password = "A jelszó megadása kötelező.";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage("");
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await loginUser(formData);
      setMessage(result.message);
    } catch (error) {
      setMessage("Váratlan hiba történt a bejelentkezési folyamat során.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Bejelentkezés">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label htmlFor="username">Felhasználónév</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Add meg a felhasználóneved"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="auth-error">{errors.username}</p>}
        </div>

        <div className="auth-form-group">
          <label htmlFor="password">Jelszó</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Add meg a jelszavad"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="auth-error">{errors.password}</p>}
        </div>

        <p className="auth-helper-text">
          A belépés később JWT alapú hitelesítéssel fog működni.
        </p>

        {message && <p className="auth-success">{message}</p>}

        <button
          type="submit"
          className="auth-form-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Folyamatban..." : "Bejelentkezés"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;