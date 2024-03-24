const express = require('express');
const {
  sendMessage,
  getMessagesForUser,
  sendReply,
  getMessagesForConversation,

} = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to send a new message
router.post('/', authMiddleware, sendMessage);

// Route to get all messages for the logged-in user
router.get('/', authMiddleware, getMessagesForUser);

// Route to send a reply to a message
router.post('/:messageId/reply', authMiddleware, sendReply);

router.get('/:conversationId', authMiddleware, getMessagesForConversation);

module.exports = router;
