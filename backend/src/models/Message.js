const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: { // Reference to a Conversation model
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Conversation' // Reference the Conversation model here
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // References the User model
  },
  content: {
    type: String,
    required: true,
  }
}, { timestamps: true }); // Mongoose uses timestamps to create createdAt and updatedAt fields

module.exports = mongoose.model('Message', messageSchema);
