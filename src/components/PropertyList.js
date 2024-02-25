import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PropertyList.css';

function PropertyList() {
  const navigate = useNavigate();
  const properties = [
    {
      id: 1,
      imageUrl: 'path/to/image1.jpg',
      description: 'Charming Bungalow in the city outskirts',
      location: 'Springfield',
      price: '500,000',
    },
    {
      id: 2,
      imageUrl: 'path/to/image2.jpg',
      description: 'Modern Apartment with a view of the skyline',
      location: 'Downtown',
      price: '300,000',
    },
   
  ];

  function handlePropertyClick(propertyId) {
    navigate(`/property/${propertyId}`);
  }

  return (
    <div className="property-list">
      {properties.map((property) => (
        <div key={property.id} className="property-item">
          {/* Property Image */}
          <div className="property-image-wrapper">
            <img src={property.imageUrl} alt="Property" className="property-image" />
          </div>
          {/* Property Details */}
          <div className="property-details">
            <h3>{property.description}</h3>
            <p>{property.location}</p>
            <p>Price: {property.price}</p>
            {/* Details Button */}
            <button className="details-button" onClick={() => handlePropertyClick(property.id)}>
              Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PropertyList;
