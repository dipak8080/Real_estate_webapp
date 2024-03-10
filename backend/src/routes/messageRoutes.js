// routes/messageRoutes.js
const express = require('express');
const {
  sendMessage,
  getMessagesForUser,
  sendReply,
  getConversationByUsers,
  getSendersList, // Import the getSendersList controller function
} = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to send a new message
router.post('/', authMiddleware, sendMessage);

// Route to get all messages for the logged-in user
router.get('/', authMiddleware, getMessagesForUser);

// Route to get the senders list for the logged-in user
router.get('/senders', authMiddleware, getSendersList); // Add this route for the senders list

// Route to send a reply to a message
router.post('/:messageId/reply', authMiddleware, sendReply);

// Route to get a conversation between two users
router.get('/conversation', authMiddleware, getConversationByUsers);

module.exports = router;
