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
        return; // Early return if content is empty after trimming
      }
      
      const senderId = socket.user._id; // Sender's user id from the socket middleware
      
      try {
        // Retrieve or create a new conversation
        let conversation = await Conversation.findOneAndUpdate(
          { participants: { $all: [senderId, recipientId] } },
          { $setOnInsert: { participants: [senderId, recipientId], messages: [] } },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Create the new message
        const message = new Message({
          conversationId: conversation._id,
          sender: senderId,
          recipient: recipientId,
          content: content,
        });

        // Save the new message
        await message.save();

        // Add the message to the conversation's messages array and populate the sender details
        conversation = await Conversation.findByIdAndUpdate(
          conversation._id,
          { $push: { messages: message._id } },
          { new: true }
        ).populate({
          path: 'messages',
          match: { _id: message._id },
          populate: { path: 'sender', select: 'fullName' },
        });

        // Grab the newly added message from the populated conversation
        const newMessage = conversation.messages.find(msg => msg._id.equals(message._id));

        // Emit the message in real-time to the sender and recipient
        io.to(senderId.toString()).emit('newMessage', newMessage);
        io.to(recipientId.toString()).emit('newMessage', newMessage);
      } catch (error) {
        console.error('Error handling sendMessage:', error);
        // Emit an error event to the sender
        socket.emit('messageError', { message: 'Failed to send message.' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
    });
  });

  return io;
};

module.exports = initializeSocketServer;
