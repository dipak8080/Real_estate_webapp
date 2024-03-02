import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Ensure useNavigate is imported
import axios from 'axios'; // Import axios for making HTTP requests
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform the logout operation
    axios.get('/api/users/logout')
      .then((response) => {
        console.log(response.data);
        // Clear local storage or any state management data
        localStorage.removeItem('token');
        // Redirect to the login page instead of the home page
        navigate('/login'); // Redirect to the login page after logout
      })
      .catch((error) => {
        console.error('Logout failed', error);
      });
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <img src="/images/logo.png" alt="Estate Logo" className="logo" />
      </Link>
      <div className="nav-links">
        <Link to="/buy">Buy</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/add-property">Add Property</Link>
      </div>
      <div className="auth-buttons">
        <button className="auth-button logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
