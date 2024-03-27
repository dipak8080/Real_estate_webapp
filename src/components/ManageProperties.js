import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ManageProperties.module.css';

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
    <div className={styles.managePropertiesContainer}>
      <h2 className={styles.managePropertiesTitle}>Manage Properties</h2>
      {error && <p className={styles.managePropertiesError}>{error}</p>}
      <ul className={styles.managePropertiesList}>
        {properties.map(property => (
          <li key={property._id} className={styles.managePropertiesItem}>
            {property.title} - {property.location} - Posted by: {property.userId.fullName}
            <div>
              <button
                onClick={() => handleArchiveToggle(property._id, property.isArchived)}
                className={`${styles.managePropertiesButton} ${property.isArchived ? styles.managePropertiesButton.unarchive : styles.managePropertiesButton.archive}`}
              >
                {property.isArchived ? 'Unarchive' : 'Archive'}
              </button>
              <button
                onClick={() => handleDelete(property._id)}
                className={styles.managePropertiesButton.delete}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageProperties; 