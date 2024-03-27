const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to fetch all conversations for a user
router.get('/conversations', authMiddleware, messageController.getUserConversations);

// Route to send a new message
router.post('/send', authMiddleware, messageController.sendMessage);

// Route to get messages from a specific conversation
router.get('/conversations/:conversationId', authMiddleware, messageController.getConversationMessages);

module.exports = router;
