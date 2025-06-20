import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { apiRequest } from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await apiRequest("/api/login", "POST", { username, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "receptionist") {
        navigate("/receptionist");
      } else if (data.role === "doctor") {
        navigate("/doctor");
      } else {
        setError("Unknown role");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Sign In</h2>
        <p className="login-subtitle">Enter your credentials</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="login-button">Login</button>

          <p className="login-register-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
