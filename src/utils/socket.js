// src/utils/socket.js
import io from 'socket.io-client';
const token = localStorage.getItem('token'); 
// Replace this with your server's URL or leave as localhost if running locally
const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

// Initialize socket connection with options to allow for credentials
console.log('Attempting to connect to WebSocket server at:', SERVER_URL);
const socket = io(SERVER_URL, {
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
  query: { token }
});

// Handle any connection errors
socket.on('connect_error', (err) => {
  console.log('Socket Connection Error:', err.message);
});

// Handle successful connection
socket.on('connect', () => {
  console.log(`Connected to WebSocket at ${SERVER_URL}`);
});

export default socket;