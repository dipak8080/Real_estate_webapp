import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [properties, setProperties] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchProperties();
    fetchConversations();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
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

  const fetchProperties = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/properties/my-properties', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(response.data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchConversations = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assuming the response contains the full name of the sender and property details
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const selectConversation = async (otherUserId) => {
    const token = localStorage.getItem('token');
    try {
      const messagesResponse = await axios.get(`http://localhost:5000/api/messages/conversation`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { recipientId: otherUserId, senderId: localStorage.getItem('userId') }
      });
  
      const messagesWithDetails = await Promise.all(messagesResponse.data.map(async (message) => {
        try {
          // Fetch each property detail for the message
          const propertyResponse = await axios.get(`http://localhost:5000/api/properties/${message.propertyId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return {
            ...message,
            propertyDetails: propertyResponse.data,
            senderName: message.senderId === localStorage.getItem('userId') ? 'You' : message.senderFullName,
          };
        } catch (error) {
          console.error('Error fetching property details for message:', error);
          return {
            ...message,
            propertyDetails: null,
          };
        }
      }));
  
      setSelectedConversationId(otherUserId);
      setMessages(messagesWithDetails);
      setIsReplying(false);
    } catch (error) {
      console.error('Error fetching messages for conversation:', error);
    }
  };
  
  

  const handleReply = (conversationId) => {
    setSelectedConversationId(conversationId);
    setIsReplying(true);
    // Scroll to the reply area if necessary
    setTimeout(() => {
      document.querySelector('.reply-area textarea')?.focus();
    }, 0);
  };
  
  const sendMessage = async (selectedConversationId) => {
    if (!newMessage.trim()) {
      setError("Message cannot be empty.");
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to send messages.');
      return;
    }
  
    // The recipientId should be the ID of the user who sent the message, not your own ID.
    const conversation = conversations.find(convo => convo._id === selectedConversationId);
    if (!conversation) {
      setError('No conversation selected.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/messages', {
        recipientId: conversation.senderId,
        propertyId: conversation.propertyId,
        content: newMessage,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.status === 201) {
        setNewMessage('');
        setIsReplying(false);
        // Fetch or reload the conversation messages to show the new message.
        selectConversation(selectedConversationId);
        setError('');
      } else {
        setError('Failed to send message. Status code: ' + response.status);
      }
    } catch (error) {
      setError('Failed to send message.');
      console.error('Error:', error.response || error.message || error);
    }
  };
  
  
  

  const updateProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:5000/api/users/profile', {
        fullName, location, phone,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setError('Profile updated successfully.');
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    }
  };

  const archiveProperty = async (propertyId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/properties/${propertyId}/archive`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProperties(); // Refresh the list of properties
    } catch (error) {
      console.error('Error archiving property:', error);
    }
  };

  const unarchiveProperty = async (propertyId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/properties/${propertyId}/unarchive`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProperties(); // Refresh the list of properties
    } catch (error) {
      console.error('Error unarchiving property:', error);
    }
  };

  const deleteProperty = async (propertyId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProperties(); // Refresh the list of properties
    } catch (error) {
      console.error('Error deleting property:', error);
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

  const renderMessagesTab = () => (
    <div className="messages-content">
      <h2>My Messages</h2>
      {conversations.length > 0 ? (
        conversations.map((conversation) => (
          <div key={conversation._id} className="message-item">
            {/* Display the conversation's sender full name */}
            <div className="message-details">
              <strong>{conversation.senderId.fullName}</strong>: regarding property at {conversation.propertyId?.location}
            </div>
            <div className="message-actions">
              {/* Reply button opens the textarea to send a new message */}
              <button onClick={() => handleReply(conversation._id)}>Reply</button>
            </div>
            {selectedConversationId === conversation._id && (
              <>
                {messages.length > 0 && messages.map((message) => (
                  <div key={message._id} className="message">
                    <div className="message-header">
                      <span className="message-sender">{message.senderName}:</span>
                      <span className="message-content">{message.content}</span>
                    </div>
                    {/* Display the details of the property related to the message */}
                    <div className="message-property-details">
                      <p><strong>Property Type:</strong> {message.propertyDetails.propertyType}</p>
                      <p><strong>Location:</strong> {message.propertyDetails.location}</p>
                      <p><strong>Price:</strong> {message.propertyDetails.price}</p>
                    </div>
                    {message.replies?.length > 0 && (
                      <div className="message-replies">
                        {message.replies.map((reply) => (
                          <div key={reply._id} className="reply">
                            <span className="reply-sender">{reply.senderId.fullName}:</span>
                            <span className="reply-content">{reply.content}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isReplying && selectedConversationId === conversation._id && (
                  <div className="reply-area">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your reply here..."
                    />
                    <button onClick={() => sendMessage(selectedConversationId)}>Send</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <p>No messages found.</p>
      )}
    </div>
  );
  
  
  
  
  
  
  

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
