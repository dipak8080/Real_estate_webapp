// MessagePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../utils/socket';
import styles from './MessagePage.module.css'; // Import your CSS module here

function MessagePage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchConversations = async () => {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token); 
      if (!token) {
        console.error('No token found');
        return;
      }
    
      try {
        const response = await axios.get('http://localhost:5000/api/messages/conversations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Conversations fetched:', response.data); 
        setConversations(response.data);
      } catch (error) {
        console.error('Error fetching conversations:', error.response.data);
      }
    };

    fetchConversations();
  }, [token]);

  useEffect(() => {
    socket.on('newMessage', message => {
      if (selectedConversation && message.conversationId === selectedConversation._id) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, [selectedConversation]);

  const handleSelectConversation = async conversation => {
    setSelectedConversation(conversation);
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/conversations/${conversation._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async e => {
    e.preventDefault();
    if (!newMessage.trim()) return;
  
    if (!selectedConversation) {
      console.error('No conversation selected');
      return;
    }
  
    // Assuming selectedConversation.participants contains the other user's ID
    const recipientId = selectedConversation.participants.find(p => p._id !== parseJwt(token).userId)._id;
  
    console.log('Sending message to recipient ID:', recipientId);
  
    try {
      const { data: sentMessage } = await axios.post(
        'http://localhost:5000/api/messages/send',
        {
          recipientId: recipientId, // Adding recipientId to the request body
          content: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Message sent:', sentMessage);
      setMessages([...messages, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error.response.data);
    }
  };
  

  // Helper function to determine if the logged-in user is the sender of a message
  const isMessageFromLoggedInUser = message => {
    const userIdFromToken = parseJwt(token).userId; // Implement parseJwt to extract userId from token
    return message.sender === userIdFromToken;
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.header}>
          <h2>Conversations</h2>
        </div>
        {conversations.map(conversation => (
          <div
            key={conversation._id}
            className={`${styles.conversationItem} ${
              selectedConversation?._id === conversation._id ? styles.activeConversation : ''
            }`}
            onClick={() => handleSelectConversation(conversation)}
          >
            {conversation.participants
              .filter(p => p._id !== parseJwt(token).userId) // Exclude the logged-in user's ID
              .map(p => p.fullName)
              .join(', ')}
          </div>
        ))}
      </aside>
      <main className={styles.chatArea}>
        <div className={styles.messagesList}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                isMessageFromLoggedInUser(message) ? styles.sender : styles.recipient
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>
        <form className={styles.messageForm} onSubmit={handleSendMessage}>
          <input
            className={styles.messageInput}
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
          />
          <button className={styles.sendButton} type="submit">
            Send
          </button>
        </form>
      </main>
    </div>
  );
}


// Function to parse JWT token and extract user information
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing JWT', e);
    return null;
  }
}

export default MessagePage;
