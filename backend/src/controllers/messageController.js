const Message = require('../models/Message');
const User = require('../models/User'); 
const Property = require('../models/Property');

// Sends a new message
const sendMessage = async (req, res) => {
  const { recipientId, propertyId, content } = req.body;
  const senderId = req.user._id;

  const message = new Message({
    senderId,
    recipientId,
    propertyId,
    content,
    date: new Date(),
  });

  try {
    const savedMessage = await message.save();
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('senderId', 'fullName')
      .populate('propertyId', 'location');
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ message: "Failed to send message", error: error.message });
  }
};

// Retrieves all messages for the user, both sent and received
const getMessagesForUser = async (req, res) => {
  const userId = req.user._id;

  try {
    const messages = await Message.find({
      $or: [{ senderId: userId }, { recipientId: userId }]
    })
    .populate('senderId', 'fullName')
    .populate('recipientId', 'fullName')
    .populate({ path: 'propertyId', select: 'price location district' });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to get messages", error: error.message });
  }
};

// Replies to an existing message
const sendReply = async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const senderId = req.user._id;

  try {
    const messageToUpdate = await Message.findById(messageId);

    if (!messageToUpdate) {
      return res.status(404).json({ message: "Original message not found." });
    }

    const reply = {
      senderId,
      content,
      date: new Date(),
    };

    messageToUpdate.replies.push(reply);
    await messageToUpdate.save();

    const updatedMessage = await Message.findById(messageId)
      .populate('senderId', 'fullName')
      .populate('recipientId', 'fullName')
      .populate({ path: 'propertyId', select: 'price location district' })
      .populate('replies.senderId', 'fullName');

    res.status(201).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to send reply", error: error.message });
  }
};

const getMessagesForConversation = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId: conversationId })
      .populate('senderId', 'fullName')
      .populate('recipientId', 'fullName')
      .populate('propertyId', 'location price district');
    
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to get messages for the conversation", error: error.message });
  }
};

// Export the functions
module.exports = {
  sendMessage,
  getMessagesForUser,
  sendReply,
  getMessagesForConversation,
};
