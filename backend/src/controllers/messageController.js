// controllers/messageController.js
const Message = require('../models/Message');

const sendMessage = async (req, res) => {
  const { recipientId, propertyId, content } = req.body;
  const senderId = req.user._id;

  const message = new Message({
    senderId,
    recipientId,
    propertyId,
    content,
  });

  try {
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: "Failed to send message", error: error.message });
  }
};

const getMessagesForUser = async (req, res) => {
  const userId = req.user._id;

  try {
    const messages = await Message.find({
      $or: [{ senderId: userId }, { recipientId: userId }]
    }).populate('senderId recipientId propertyId');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to get messages", error: error.message });
  }
};

const sendReply = async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const senderId = req.user._id;

  try {
    const originalMessage = await Message.findById(messageId);
    if (!originalMessage) {
      return res.status(404).json({ message: "Original message not found." });
    }

    // Assuming replies are stored in an array within the Message schema
    const reply = {
      senderId,
      content,
      date: new Date(),
    };

    originalMessage.replies.push(reply);
    await originalMessage.save();

    res.status(201).json({ message: "Reply sent successfully", reply: reply });
  } catch (error) {
    res.status(500).json({ message: "Failed to send reply", error: error.message });
  }
};


// Get a list of users who have sent messages to the logged-in user
const getSendersList = async (req, res) => {
    const recipientId = req.user._id; // ID of the logged-in user
  
    try {
      const messages = await Message.find({ recipientId: recipientId });
      // Using a Set to avoid duplicate user IDs
      const senderIds = [...new Set(messages.map(message => message.senderId))];
      // Fetch sender details
      const senders = await User.find({ '_id': { $in: senderIds } }).select('fullName');
      res.status(200).json(senders);
    } catch (error) {
      res.status(500).json({ message: "Failed to get senders list", error: error.message });
    }
  };
  

module.exports = {
  sendMessage,
  getMessagesForUser,
  sendReply,
};
