import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Login failed');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);

    if (data.role === 'receptionist') {
      navigate('/receptionist');
    } else if (data.role === 'doctor') {
      navigate('/doctor');
    } else {
      setError('Unknown role');
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
