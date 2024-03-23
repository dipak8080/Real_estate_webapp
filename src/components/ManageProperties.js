import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/properties', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProperties(response.data);
    } catch (error) {
      setError('Failed to fetch properties');
      console.error('Error fetching properties:', error);
    }
  };

  const handleArchiveToggle = async (propertyId, isArchived) => {
    try {
      await axios.put(
        `http://localhost:5000/admin/property/${isArchived ? 'unarchive' : 'archive'}/${propertyId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
      );
      fetchProperties(); // Re-fetch properties to update the list
    } catch (error) {
      setError(`Failed to ${isArchived ? 'unarchive' : 'archive'} property`);
      console.error('Error updating property:', error);
    }
  };
  

  const handleDelete = async (propertyId) => {
    try {
      await axios.delete(`http://localhost:5000/admin/property/${propertyId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProperties(properties.filter(property => property._id !== propertyId)); // Update the list without the deleted property
    } catch (error) {
      setError('Failed to delete property');
      console.error('Error deleting property:', error);
    }
  };

  return (
    <div>
      <h2>Manage Properties</h2>
      {error && <p>{error}</p>}
      <ul>
        {properties.map(property => (
          <li key={property._id}>
            {property.title} - {property.location}
            <button onClick={() => handleArchiveToggle(property._id, property.isArchived)}>
              {property.isArchived ? 'Unarchive' : 'Archive'}
            </button>
            <button onClick={() => handleDelete(property._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageProperties;
