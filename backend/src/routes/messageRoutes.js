const express = require('express');
const router = express.Router();
const { checkOrCreateConversation, getConversations, sendMessage, getMessages } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// Endpoint to check or create a conversation
router.post('/conversations/checkOrCreate', authMiddleware, checkOrCreateConversation);

// Endpoint to get all conversations for a user
router.get('/conversations', authMiddleware, getConversations);

// Endpoint to get all messages within a conversation
router.get('/conversations/:conversationId/messages', authMiddleware, getMessages);

// Endpoint to send a message within a conversation
router.post('/conversations/:conversationId/messages', authMiddleware, sendMessage);

module.exports = router;
