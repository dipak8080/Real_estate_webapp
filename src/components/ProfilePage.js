// src/Pages/ProfilePage.js
import React, { useState } from 'react';
import './ProfilePage.css';

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');

  const getTabClassName = (tabName) => {
    return activeTab === tabName ? 'tab active' : 'tab';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
            <div className="profile-content">
              <h2>My Profile</h2>
              <input type="text" placeholder="Name" />
              <input type="text" placeholder="Location" />
              <input type="tel" placeholder="Phone Number" />
              <button>Update Profile</button>
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
