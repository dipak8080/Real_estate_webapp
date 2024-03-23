import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FeaturedProperties.css';

function FeaturedProperties() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/properties?featured=true', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setFeaturedProperties(response.data);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      }
    };

    fetchFeaturedProperties();
  }, []);

  return (
    <section className="featured-section">
      <h2 className="featured-title">Featured Properties</h2>
      <div className="featured-properties">
        {featuredProperties.length > 0 ? (
          featuredProperties.map((property) => (
            <div key={property._id} className="property">
              <img 
                src={property.featurePhoto ? `http://localhost:5000/uploads/${property.featurePhoto}` : '/images/default-placeholder.png'} 
                alt={property.description} 
              />
              <div className="property-details">
                <h3>{property.propertyType}</h3>
                <p>State: {property.state}</p>
                <p>Location: {property.location}</p>
                <p>District: {property.district}</p>
                <p>Municipality: {property.municipality}</p>
                <p>Price: ${property.price}</p> {/* Assuming price is a number */}
                <p>Description: {property.description}</p>
                <button onClick={() => navigate(`/property/${property._id}`)}>Details</button>
              </div>
            </div>
          ))
        ) : (
          <p>No featured properties found.</p>
        )}
      </div>
    </section>
  );
}

export default FeaturedProperties;
