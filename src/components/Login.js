import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './Login.css';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (event) => {
      event.preventDefault();
      setError('');

      axios.post('http://localhost:5000/api/users/login', { email, password })
      .then(response => {
          const { token, isAdmin } = response.data;
          if (token) {
              localStorage.setItem('token', token);
              localStorage.setItem('isAdmin', isAdmin); // Store the isAdmin flag in localStorage
    
              // Update the login call to include isAdmin status
              login({ token, isAdmin }); // Adjusted to pass an object including isAdmin
    
              // Redirect based on admin status
              if (isAdmin) {
                  navigate('/admin/dashboard'); // Adjust the path as necessary
              } else {
                  navigate('/home'); // Navigate to the home page for regular users
              }
          } else {
              throw new Error('Token not provided by the server');
          }
      })
    .catch(error => {
        const errorMessage = error.response?.data?.message || 'Login failed, please try again.';
        setError(errorMessage);
        console.error('Login failed:', error);
    });

  };

  const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        {error && <div className="login-error">{error}</div>}
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button onClick={togglePasswordVisibility} type="button" className="toggle-password">
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </button>
        </div>
        <button type="submit" className="login-button">Login</button>
        <p className="signup-prompt">
          New user? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
