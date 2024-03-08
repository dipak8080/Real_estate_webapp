import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [properties, setProperties] = useState([]);

  // Assuming users data for message functionality
  const users = ['User1', 'User2', 'User3'];

  useEffect(() => {
    fetchUserData();
    fetchProperties();
  }, []);

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

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      // Replace '/properties' with '/my-properties' to fetch only the user's properties
      const response = await axios.get('http://localhost:5000/api/properties/my-properties', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProperties(response.data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };
  

  const archiveProperty = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/properties/${propertyId}/archive`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        fetchProperties(); // Refresh the properties list
      }
    } catch (error) {
      console.error('Error archiving property:', error);
    }
  };
  
  const unarchiveProperty = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/properties/${propertyId}/unarchive`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        fetchProperties(); // Refresh the properties list
      }
    } catch (error) {
      console.error('Error unarchiving property:', error);
    }
  };
  
  

  const deleteProperty = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/properties/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProperties(); // Refresh properties list after deleting
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const updateProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:5000/api/users/profile', { fullName, location, phone }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setError('Profile updated successfully.');
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() !== '' && selectedUser) {
      const userMessages = messages[selectedUser] || [];
      setMessages({
        ...messages,
        [selectedUser]: [...userMessages, newMessage.trim()],
      });
      setNewMessage('');
    }
  };

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const getTabClassName = (tabName) => activeTab === tabName ? 'tab active' : 'tab';

  const renderMessagesTab = () => (
    <div className="messages-content">
      <h2>My Messages</h2>
      <div className="user-list">
        {users.map(user => (
          <div key={user} className={`user ${selectedUser === user ? 'selected-user' : ''}`} onClick={() => setSelectedUser(user)}>
            {user}
          </div>
        ))}
      </div>
      <div className="chat-window">
        <div className="messages-list">
          {messages[selectedUser]?.map((message, index) => <div key={index} className="message">{message}</div>)}
        </div>
        <div className="message-input">
          <input type="text" value={newMessage} onChange={handleMessageChange} placeholder="Type message here" />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );

  const renderPropertiesTab = () => (
    <div className="properties-content">
      <h2>My Properties</h2>
      {properties.length > 0 ? (
        properties.map((property) => (
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
        ))
      ) : (
        <p>No properties found. Have you added properties to your profile?</p>
      )}
    </div>
  );
  

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
            {error && <p className="error">{error}</p>}
          </div>
        );
      case 'properties':
        return renderPropertiesTab();
      case 'messages':
        return renderMessagesTab();
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
