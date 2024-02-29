import React from 'react';
import { Link } from 'react-router-dom'; // Corrected import for Link
import './Navbar.css';

function Navbar() {
  // No need to import useNavigate since it's not being used anymore

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
        {/* Removed the button element for Login */}
        {/* Logout button class for red color */}
        <button className="auth-button logout-button">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
