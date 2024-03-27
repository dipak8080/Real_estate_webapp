const socketIo = require('socket.io');
const Message = require('../models/Message');
const User = require('../models/User');
const Property = require('../models/Property');
let io;

const setUpWebSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New WebSocket connection:', socket.id);

    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    socket.on('sendMessage', async ({ conversationId, senderId, content }) => {
      console.log("Sender ID:", senderId);
      console.log("Conversation (Property) ID:", conversationId);

      try {
        const newMessage = new Message({
          conversationId,
          senderId,
          content,
        });

        await newMessage.save();

        const populatedMessage = await Message.findById(newMessage._id)
          .populate('senderId', 'fullName'); // Ensure 'fullName' exists in your User model

        // Emit the message to the conversation room with populated sender details
        io.to(conversationId.toString()).emit('newMessage', {
          _id: populatedMessage._id,
          conversationId: populatedMessage.conversationId,
          senderId: populatedMessage.senderId._id,
          senderName: populatedMessage.senderId.fullName,
          content: populatedMessage.content,
          createdAt: populatedMessage.createdAt,
          updatedAt: populatedMessage.updatedAt,
        });
      } catch (error) {
        console.error('Error sending message:', error);
        // Emit an error message back to the sender's socket
        socket.emit('errorMessage', { error: 'Error sending message.' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { setUpWebSocket, getIo };
