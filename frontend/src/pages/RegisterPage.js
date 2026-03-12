import { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import { registerUser } from "../services/authService";
import "../styles/auth.css";

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
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

  const validatePassword = (password) => {
    const hasUppercase = /[A-ZÁÉÍÓÖŐÚÜŰ]/.test(password);
    const hasNumber = /\d/.test(password);

    return hasUppercase && hasNumber;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "A teljes név megadása kötelező.";
    }

    if (!formData.username.trim()) {
      newErrors.username = "A felhasználónév megadása kötelező.";
    }

    if (!formData.password) {
      newErrors.password = "A jelszó megadása kötelező.";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "A jelszónak legalább egy nagybetűt és egy számot kell tartalmaznia.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "A jelszó megerősítése kötelező.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "A két jelszó nem egyezik meg.";
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
      const result = await registerUser(formData);
      setMessage(result.message);
    } catch (error) {
      setMessage("Váratlan hiba történt a regisztráció során.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Regisztráció">
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
          {errors.fullName && <p className="auth-error">{errors.fullName}</p>}
        </div>

        <div className="auth-form-group">
          <label htmlFor="username">Felhasználónév</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Adj meg egy felhasználónevet"
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
            placeholder="Adj meg egy jelszót"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="auth-error">{errors.password}</p>}
        </div>

        <div className="auth-form-group">
          <label htmlFor="confirmPassword">Jelszó megerősítése</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Ismételd meg a jelszót"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="auth-error">{errors.confirmPassword}</p>
          )}
        </div>

        <p className="auth-helper-text">
          A jelszónak legalább egy nagybetűt és egy számot kell tartalmaznia.
        </p>

        {message && <p className="auth-success">{message}</p>}

        <button
          type="submit"
          className="auth-form-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Folyamatban..." : "Regisztráció"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;