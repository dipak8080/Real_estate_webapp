import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; 

function Navbar() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
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
        {/* login-button class for green color */}
        <button onClick={handleLoginClick} className="auth-button login-button">Login</button>
        {/*logout-button class for red color */}
        <button className="auth-button logout-button">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
