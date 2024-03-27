import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FeaturedProperties.module.css';

function ManageFeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/admin/properties', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      alert('Failed to fetch properties.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeature = async (propertyId) => {
    try {
      await axios.put(`http://localhost:5000/admin/properties/${propertyId}/feature`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchProperties();
    } catch (error) {
      console.error('Error featuring property:', error);
      alert('Failed to feature property.');
    }
  };
  
  const handleUnfeature = async (propertyId) => {
    try {
      await axios.put(`http://localhost:5000/admin/properties/${propertyId}/unfeature`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchProperties();
    } catch (error) {
      console.error('Error unfeaturing property:', error);
      alert('Failed to unfeature property.');
    }
  };
  
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="featured-section">
      <h1 className="featured-title">Manage Featured Properties</h1>
      <div className="featured-properties">
        {properties.map((property) => (
          <div key={property._id} className="property">
            <img 
              src={property.featurePhoto ? `http://localhost:5000/uploads/${property.featurePhoto}` : '/images/default-placeholder.png'} 
              alt="Feature" 
            />
            <div className="property-details">
              <h3>{property.title}</h3>
              <p>State: {property.state}</p>
              <p>Location: {property.location}</p>
              <p>District: {property.district}</p>
              <p>Municipality: {property.municipality}</p>
              <p>Price: {property.price}</p>
              <p>Uploaded by: {property.userFullName}</p>
              <button onClick={() => property.isFeatured ? handleUnfeature(property._id) : handleFeature(property._id)}>
                {property.isFeatured ? 'Unfeature' : 'Feature'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageFeaturedProperties;