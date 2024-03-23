import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MessageComponent from './MessageComponent';
import './ProfilePage.css';

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [properties, setProperties] = useState([]);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // Define fetchProperties outside of useEffect
  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/properties/my-properties', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(response.data || []);
    } catch (error) {
      setError('Failed to fetch properties. Please try again.');
      console.error('Error fetching properties:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { fullName, location, phone } = response.data;
        setFullName(fullName || '');
        setLocation(location || '');
        setPhone(phone || '');
      } catch (error) {
        setError('Failed to fetch user data. Please try again.');
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
    fetchProperties();
    // The linter warning is disabled here as the dependencies are the fetch functions themselves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Now 'token' is a dependency of useEffect
  const archiveProperty = async (propertyId) => {
    try {
      await axios.put(`http://localhost:5000/api/properties/${propertyId}/archive`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProperties(); // Refresh the list of properties
    } catch (error) {
      console.error('Error archiving property:', error);
    }
  };

  const unarchiveProperty = async (propertyId) => {
    try {
      await axios.put(`http://localhost:5000/api/properties/${propertyId}/unarchive`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProperties(); // Refresh the list of properties
    } catch (error) {
      console.error('Error unarchiving property:', error);
    }
  };

  const deleteProperty = async (propertyId) => {
    try {
      await axios.delete(`http://localhost:5000/api/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProperties(); // Refresh the list of properties
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const updateProfile = async () => {
    try {
      await axios.put('http://localhost:5000/api/users/profile', {
        fullName, location, phone,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError('Profile updated successfully.');
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    }
  };

  const renderProfileTab = () => (
    <div className="profile-content">
      <h2>My Profile</h2>
      <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button onClick={updateProfile}>Update Profile</button>
      {error && <p className="error">{error}</p>}
    </div>
  );

  const renderPropertiesTab = () => (
    <div className="properties-content">
      <h2>My Properties</h2>
      {properties.length > 0 ? properties.map((property) => (
        <div key={property._id} className="property-item">
          <div className="property-details">
            {property.propertyType} - {property.location}
            {property.isArchived && <span> (Archived)</span>}
          </div>
          <div className="property-actions">
            {property.isArchived ? (
              <button onClick={() => unarchiveProperty(property._id)}>Unarchive</button>
            ) : (
              <button onClick={() => archiveProperty(property._id)}>Archive</button>
            )}
            <button onClick={() => deleteProperty(property._id)}>Delete</button>
          </div>
        </div>
      )) : (
        <p>No properties found. Have you added properties to your profile?</p>
      )}
    </div>
  );

  const renderMessagesTab = () => {
    return <MessageComponent token={token} userId={userId} />;
  };

  return (
    <div className="profile-page">
      <aside className="sidebar">
        <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>My Profile</button>
        <button onClick={() => setActiveTab('properties')} className={activeTab === 'properties' ? 'active' : ''}>My Properties</button>
        <button onClick={() => setActiveTab('messages')} className={activeTab === 'messages' ? 'active' : ''}>My Messages</button>
      </aside>
      <section className="content">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'properties' && renderPropertiesTab()}
        {activeTab === 'messages' && renderMessagesTab()} 
      </section>
    </div>
  );
  
}

export default ProfilePage;

