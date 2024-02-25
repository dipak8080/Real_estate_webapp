// SearchArea.js
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import './SearchArea.css';

function SearchArea() {
  return (
    <div className="search-area-container">
      
      <div 
        className="background-image" 
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/main.jpg)` }} 
      />
      <div className="search-area">
        <input type="text" placeholder="Enter Location" />
        <input type="text" placeholder="Property Type" />
        <input type="text" placeholder="Budget" />
        <button type="button"><SearchIcon />Search</button>
      </div>
    </div>
  );
}

export default SearchArea;
