const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

let io = null; // This will be set by setSocketInstance

const messageController = {
  setSocketInstance: function (ioInstance) {
    io = ioInstance; // Setting the io instance passed from the server setup
  },

  // Fetch conversations for a user
  getUserConversations: async (req, res) => {
    try {
      const userId = req.user._id;
      const conversations = await Conversation.find({
        participants: { $in: [userId] }
      })
      .populate('participants', 'fullName')
      .populate({
        path: 'messages',
        populate: { path: 'sender', select: 'fullName' },
        options: { sort: { 'createdAt': -1 } },
        perDocumentLimit: 1 // Only get the most recent message for preview
      });

      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching conversations', error });
    }
  },

  // Send a new message
  sendMessage: async (req, res) => {
    try {
      const { recipientId, content } = req.body;
      const senderId = req.user._id; // Get sender ID from user object attached by auth middleware
  
    
          // Retrieve or create a new conversation
          let conversation = await Conversation.findOneAndUpdate(
            { participants: { $all: [mongoose.Types.ObjectId(senderId), mongoose.Types.ObjectId(recipientId)] } },
            { $setOnInsert: { messages: [] } }, // Don't set participants on insert, just ensure messages array is empty
            { new: true, upsert: true }
          );
  
      // Create and save the message
      const message = new Message({
        conversationId: conversation._id,
        sender: senderId,
        recipient: recipientId,
        content: content,
      });
      await message.save();
  
      // Add message ID to conversation's messages array
      conversation.messages.push(message._id);
      await conversation.save();
  
      // Populate the message's sender information
      await message.populate('sender', 'fullName').execPopulate();
  
      // Emit the message to both the sender and recipient using sockets
      if (io) {
        io.to(senderId.toString()).emit('newMessage', message);
        io.to(recipientId.toString()).emit('newMessage', message);
      } else {
        console.error('Socket.io instance is not initialized.');
      }
  
      res.status(201).json(message);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Error sending message', error });
    }
  },

  // Fetch messages from a specific conversation
  getConversationMessages: async (req, res) => {
    try {
      const { conversationId } = req.params;

      // Validate if the user is part of the conversation
      const conversation = await Conversation.findOne({ _id: conversationId, participants: req.user._id });
      if (!conversation) {
        return res.status(403).json({ message: "You're not a participant of this conversation." });
      }

      const messages = await Message.find({ conversationId })
        .populate('sender', 'fullName')
        .sort('createdAt');

      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching messages', error });
    }
  },

  // Real-time message handling
  handleRealTimeMessage: async ({ senderId, recipientId, content }, socket) => {
    try {
      // Retrieve or create a conversation between sender and recipient
      let conversation = await Conversation.findOneAndUpdate(
        { participants: { $all: [senderId, recipientId] } },
        { $setOnInsert: { participants: [senderId, recipientId] } },
        { new: true, upsert: true }
      );

      // Create and save the message
      const message = new Message({
        conversationId: conversation._id,
        sender: senderId,
        recipient: recipientId,
        content: content,
      });
      await message.save();

      // Add message to conversation's messages array
      conversation.messages.push(message);
      await conversation.save();

      // Emit the message to the sender and recipient
      socket.to(senderId.toString()).emit('newMessage', message);
      socket.to(recipientId.toString()).emit('newMessage', message);
    } catch (error) {
      console.error('Real-time message handling error:', error);
    }
  },
};


module.exports = messageController;