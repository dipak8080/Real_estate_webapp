// src/components/ActionSection.js
import React from 'react';
import { Link } from 'react-router-dom';
import './SearchArea.css';
import buysellImage from '../images/buysell.jpg';

function ActionSection() {
  return (
    <div className="action-section">
      <Link to="/buy" className="buy-property" style={{ backgroundImage: `url(${buysellImage})` }}>
        <p>Buy</p>
      </Link>
      
      <Link to="/add-property" className="sell-property" style={{ backgroundImage: `url(${buysellImage})` }}>
        <p>Sell</p>
      </Link>
    </div>
  );
}

export default ActionSection;
