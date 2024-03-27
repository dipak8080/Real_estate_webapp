const Message = require('../models/Message');

const getIo = require('../utils/socket').getIo;

// Function to create a new conversation
exports.createConversation = async (req, res) => {
    console.log('createConversation called with participants:', req.body.participants); 
    const { participants } = req.body; // Array of user IDs

    try {
        const newConversation = new Conversation({ participants });
        await newConversation.save();
        res.status(201).json({ message: 'New conversation created', conversation: newConversation });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create conversation', error: error.toString() });
    }
};

// Function to send a message within a conversation
exports.sendMessage = async (req, res) => {
    console.log('sendMessage called with:', req.body);
    const { senderId, conversationId, content } = req.body;

    try {
        const newMessage = new Message({
            conversation: conversationId,
            sender: senderId,
            content: content,
        });
        await newMessage.save();

        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: newMessage._id,
            $currentDate: { updatedAt: true }
        });

        const populatedMessage = await newMessage
            .populate('sender', 'fullName')
            .execPopulate();

        const io = getIo();
        io.to(conversationId.toString()).emit('newMessage', populatedMessage);
        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: 'Failed to send message', error: error.toString() });
    }
};

// Function to list all conversations for a user
exports.getConversations = async (req, res) => {
    console.log('getConversations called for user:', req.user._id);
    const userId = req.user._id; // Assume user id is available from the auth middleware

    try {
        const conversations = await Conversation.find({ participants: userId })
                                                .populate('participants', 'fullName');
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch conversations', error: error.toString() });
    }
};

// Function to get all messages within a conversation
exports.getMessages = async (req, res) => {
    console.log('getMessages called for conversation:', req.params.conversationId);
    const { conversationId } = req.params;

    try {
        const messages = await Message.find({ conversation: conversationId })
                                      .populate('sender', 'fullName location');

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch messages', error: error.toString() });
    }
};

exports.checkOrCreateConversation = async (req, res) => {
    console.log('checkOrCreateConversation called with participants:', req.body.participants); 
    const { participants } = req.body;

    try {
        // Sort participant IDs to ensure consistent order regardless of how they are submitted
        const sortedParticipants = [...participants].sort();

        // Check for an existing conversation with these exact participants
        let conversation = await Conversation.findOne({
            participants: { $all: sortedParticipants, $size: sortedParticipants.length }
        }).populate('participants', 'fullName');

        console.log('Existing conversation:', conversation);

        if (!conversation) {
            console.log('No existing conversation found, creating a new one.');
            conversation = new Conversation({ participants: sortedParticipants });
            await conversation.save();
            conversation = await conversation.populate('participants', 'fullName').execPopulate();
        }

        console.log('Returning conversation:', conversation);
        res.status(200).json(conversation);
    } catch (error) {
        console.error('Error checking or creating conversation:', error);
        res.status(500).json({ message: 'Error checking or creating conversation', error: error.toString() });
    }
};




