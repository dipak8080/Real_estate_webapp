import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(''); // Added state for storing any error messages

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFullName(response.data.fullName || '');
        setLocation(response.data.location || '');
        setPhone(response.data.phone || '');
      } catch (error) {
        setError('Failed to fetch user data. Please try again.');
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const updateProfile = async () => {
    const token = localStorage.getItem('token');
    console.log(token);
    try {
      const response = await axios.put('http://localhost:5000/api/users/profile', {
        fullName,
        location,
        phone,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Profile updated successfully:', response.data);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    }
  };

  const getTabClassName = (tabName) => {
    return activeTab === tabName ? 'tab active' : 'tab';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="profile-content">
            <h2>My Profile</h2>
            <input type="text" placeholder="Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <button onClick={updateProfile}>Update Profile</button>
            {error && <p className="error">{error}</p>} {/* Display error message if there's an error */}
          </div>
        );
      case 'properties':
        return (
          <div className="properties-content">
            <h2>My Properties</h2>
            <div className="property-item">
              <div className="property-details">Property Details...</div>
              <div className="property-actions">
                <button className="property-action view">View Details</button>
                <button className="property-action edit">Edit</button>
                <button className="property-action remove">Remove</button>
                <button className="property-action status">Mark as Sold</button>
              </div>
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="messages-content">
            <h2>My Messages</h2>
            <div className="message-item">
              <div className="message-details">Message Content...</div>
              <div className="message-actions">
                <button className="message-action reply">Reply</button>
                <button className="message-action delete">Delete</button>
                <button className="message-action archive">Archive</button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <aside>
        <ul>
          <li onClick={() => setActiveTab('profile')} className={getTabClassName('profile')}>My Profile</li>
          <li onClick={() => setActiveTab('properties')} className={getTabClassName('properties')}>My Properties</li>
          <li onClick={() => setActiveTab('messages')} className={getTabClassName('messages')}>My Messages</li>
        </ul>
      </aside>
      <section>
        {renderContent()}
      </section>
    </div>
  );
}

export default ProfilePage;
