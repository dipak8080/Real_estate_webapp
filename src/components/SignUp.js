import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Ensure useNavigate is imported
import axios from 'axios';
import './SignUp.css';

function SignUp() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [password, setPassword] = useState(''); // State for the password
    const [error, setError] = useState(''); // State for storing error messages
    const navigate = useNavigate(); // Hook for navigation

    const handleSignUp = (event) => {
        event.preventDefault();

        const user = {
            fullName,
            email,
            phone,
            location,
            password, // Include password in the user object
        };

        axios.post('http://localhost:5000/api/users/signup', user)
        .then(response => {
            alert('Account created successfully');
            navigate('/login'); // Redirect to the login page
        })
        .catch(error => {
            const errorMessage = error.response?.data?.message || 'Failed to create account, please try again.';
            setError(errorMessage); // Set error message to state
            console.error('Signup error:', errorMessage);
        });
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSignUp} className="signup-form">
                <h2>Create an Account</h2>
                <label htmlFor="fullName">Full Name:</label>
                <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="phone">Phone:</label>
                <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <label htmlFor="location">Location:</label>
                <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="signup-button">Create Account</button>
                {error && <div className="signup-error">{error}</div>} {/* Display error message if exists */}
                <p className="login-prompt">
                    Already a user? <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );
}

export default SignUp;
