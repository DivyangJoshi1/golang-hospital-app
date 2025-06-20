import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './Register.css';
import { apiRequest } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "receptionist",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await apiRequest("/api/register", "POST", {
        username: formData.username,
        password: formData.password,
        role: formData.role,
      });

      alert("✅ Registration successful. Please login.");
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Create an Account</h2>
        <p className="register-subtitle">Register as doctor or receptionist</p>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="receptionist">Receptionist</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="register-button">Register</button>

          <p className="register-link">
            Already have an account? <Link to="/">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
