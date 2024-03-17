import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './PropertyList.css';

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); // Get access to the location object
  

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Check if there's search data passed in location state
        if (location.state && location.state.properties) {
          // If there are search results, set the properties with them
          setProperties(location.state.properties);
        } else {
          // If there's no search data, fetch all properties as before
          const response = await axios.get('http://localhost:5000/api/properties', config);
          setProperties(response.data);
        }
      } catch (error) {
        const message = error.response?.data.message || error.message;
        console.error('Error fetching properties:', message);
        alert(`Error fetching properties: ${message}`);
      }
    };

    fetchProperties();
  }, [location.state]); // Add location.state as a dependency so this effect runs when it changes

  function handlePropertyClick(propertyId) {
    navigate(`/property/${propertyId}`);
  }

  return (
    <div className="property-list">
      {properties.length > 0 ? (
        properties.map((property) => (
          <div key={property._id} className="property-item" onClick={() => handlePropertyClick(property._id)}>
            <div className="property-image-wrapper">
              <img src={property.featurePhoto ? `http://localhost:5000/uploads/${property.featurePhoto}` : '/images/default-placeholder.png'} alt="Property" />
            </div>
            <div className="property-details">
              <h3 className="property-type">{property.propertyType}</h3>
              <p>State: {property.state}</p>
              <p>Location: {property.location}</p>
              <p>District: {property.district}</p>
              <p>Municipality: {property.municipality}</p>
              <p>Price: {property.price}</p>
              <h3>{property.description}</h3>
              <button className="details-button">Details</button>
            </div>
          </div>
        ))
      ) : (
        <p>No properties found.</p> // Display a message if no properties are found
      )}
    </div>
  );
}

export default PropertyList;
