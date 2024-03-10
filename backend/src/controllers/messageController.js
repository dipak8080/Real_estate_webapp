// controllers/messageController.js
const Message = require('../models/Message');
const User = require('../models/User'); // Make sure User model is imported

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
    // Populate the sender information before sending the response
    await message.populate('senderId', 'fullName');
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
    }).populate('senderId', 'fullName').populate('recipientId', 'fullName').populate('propertyId');
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

    const reply = {
      senderId,
      content,
      date: new Date(),
    };

    originalMessage.replies.push(reply); // This should add the reply to the 'replies' array
    await originalMessage.save();

    // Populate the sender information before sending the response
    await originalMessage.populate('replies.senderId', 'fullName');
    res.status(201).json({ message: "Reply sent successfully", reply: reply });
  } catch (error) {
    res.status(500).json({ message: "Failed to send reply", error: error.message });
  }
};


// Get a list of users who have sent messages to the logged-in user
const getSendersList = async (req, res) => {
  const recipientId = req.user._id; // Assuming you have access to the user's ID from the auth middleware

  try {
    const messages = await Message.find({ recipientId: recipientId });
    const senderIds = [...new Set(messages.map((message) => message.senderId))];
    const senders = await User.find({ _id: { $in: senderIds } }).select('fullName');

    res.status(200).json(senders.map(sender => ({ id: sender._id, fullName: sender.fullName })));
  } catch (error) {
    res.status(500).json({ message: "Failed to get senders list", error: error.message });
  }
};

const getConversationByUsers = async (req, res) => {
  const { recipientId, senderId } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { $and: [{ senderId: recipientId }, { recipientId: senderId }] },
        { $and: [{ senderId: senderId }, { recipientId: recipientId }] }
      ]
    })
    .populate('senderId', 'fullName')
    .populate('recipientId', 'fullName')
    .populate('propertyId'); // Ensure this populates necessary property details

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to get conversation", error: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessagesForUser,
  sendReply,
  getConversationByUsers,
  getSendersList,
};
