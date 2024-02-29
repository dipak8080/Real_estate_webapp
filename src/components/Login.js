import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Ensure this path is correct based on your project structure
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State for storing login error messages
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();
        setError(''); // Clear any existing errors

        axios.post('http://localhost:5000/api/users/login', { email, password })
            .then(response => {
                login(response.data.token); // Update this if your login method expects different parameters
                navigate('/home'); // Navigate to the home page after successful login
            })
            .catch(error => {
                const errorMessage = error.response?.data?.error || 'Login failed, please try again.';
                setError(errorMessage); // Set the error message from the server response or a default error message
                console.error('Login failed:', error);
            });
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Login</h2>
                {error && <div className="login-error">{error}</div>} {/* Display error message */}
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
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="login-button">Login</button>
                <p className="signup-prompt">
                    New user? <Link to="/signup">Create an account</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
