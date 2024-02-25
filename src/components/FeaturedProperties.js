// FeaturedProperties.js
import React from 'react';
import './SearchArea.css';

function FeaturedProperties() {
  // Placeholder data can be represented by an array. ill use in backend later
  const placeholders = [1, 2, 3, 4, 5];

  return (
    <section className="featured-section">
      <h2 className="featured-title">Featured Properties</h2> 
      <div className="featured-properties">
        {placeholders.map((placeholder, index) => (
          <div key={index} className="property">
           
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProperties;
