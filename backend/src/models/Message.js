const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Conversation'
  },
  sender: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  recipient: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
