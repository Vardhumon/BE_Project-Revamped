const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    community: { type: String, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true }, // Added username field
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replyTo: {
        messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' },
        content: String,
        username: String
    }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
