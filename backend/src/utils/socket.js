const socketIO = require('socket.io');
const socketAuthMiddleware = require('../middleware/socketAuthMiddleware');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation'); // Import the Conversation model

const initializeSocketServer = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
      methods: ["GET", "POST"]
    }
  });

  // Use the socketAuthMiddleware for all incoming socket connections
  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    console.log('New client connected with id:', socket.id);

    // Setup the listener for new messages
    socket.on('sendMessage', async ({ recipientId, content }) => {
      if (!content.trim()) {
        return;
      }
      
      // The sender's user id is attached to the socket from the middleware
      const senderId = socket.user._id;

      // Retrieve or create a new conversation
      let conversation = await Conversation.findOneAndUpdate(
        { participants: { $all: [senderId, recipientId] } },
        { $setOnInsert: { participants: [senderId, recipientId] } },
        { new: true, upsert: true }
      );

      // Create and save the new message
      const message = new Message({
        conversationId: conversation._id, // Reference the conversation
        sender: senderId,
        recipient: recipientId,
        content: content,
      });

      await message.save();

      // Optionally, add the message to the conversation's messages array
      conversation.messages.push(message._id);
      await conversation.save();

      // Emit the message in real-time to the sender and recipient
      io.to(senderId.toString()).emit('newMessage', message);
      io.to(recipientId.toString()).emit('newMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
    });
  });

  return io;
};

module.exports = initializeSocketServer;
