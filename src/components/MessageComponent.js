// MessageComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css'; 

function MessageComponent({ token, userId }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/messages', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(response.data || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setError('Failed to fetch conversations. Please try again.');
      }
    };

    fetchConversations();
  }, [token]); // token is now a dependency of useEffect

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleReplyChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendReply = async () => {
    if (!newMessage.trim()) {
      setError("Reply cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/messages/${selectedConversation._id}/reply`, {
        content: newMessage,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201) {
        setNewMessage('');
        // Re-fetch the conversations to get the updated list including the new reply
        setError('');
      } else {
        setError('Failed to send reply. Status code: ' + response.status);
      }
    } catch (error) {
      setError('Failed to send reply.');
      console.error('Error:', error.response || error.message || error);
    }
  };

  return (
    <div className="messages-content">
      <h2>My Messages</h2>
      {error && <p className="error">{error}</p>}
      <div className="conversation-list">
        {conversations.map((conversation) => (
          <div key={conversation._id} className="conversation-item" onClick={() => handleSelectConversation(conversation)}>
            <strong>{conversation.senderId?.fullName || 'Unknown'}</strong>: {conversation.content}
            <div>
              {conversation.propertyId ? `${conversation.propertyId.location} - ${conversation.propertyId.price}` : 'No property details'}
            </div>
          </div>
        ))}
      </div>
      {selectedConversation && (
        <div className="selected-conversation">
          <div className="message-list">
            {selectedConversation?.messages?.map((message) => (
              <div key={message._id} className="message">
                <strong>{message.senderId?.fullName || 'Unknown'}:</strong>
                <span>{message.content}</span>
              </div>
            ))}
          </div>
          <div className="reply-area">
            <textarea
              value={newMessage}
              onChange={handleReplyChange}
              placeholder="Type your reply here..."
            />
            <button onClick={handleSendReply}>Send Reply</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageComponent;