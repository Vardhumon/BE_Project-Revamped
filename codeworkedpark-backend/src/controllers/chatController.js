const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const Project = require('../models/Project');
const mongoose = require('mongoose');

// Get chat history for a project
// exports.getChatHistory = async (req, res) => {
//     try {
//         const { projectId } = req.params;
//         const { limit = 50, before } = req.query;

//         // Verify project access
//         const project = await Project.findById(projectId);
//         if (!project) {
//             return res.status(404).json({ error: 'Project not found' });
//         }

//         // Build query
//         const query = { projectId };
//         if (before) {
//             query.timestamp = { $lt: new Date(before) };
//         }

//         // Fetch messages
//         const messages = await ChatMessage.find(query)
//             .sort({ timestamp: -1 })
//             .limit(parseInt(limit))
//             .populate('senderId', 'name avatar');

//         res.json(messages.reverse());
//     } catch (error) {
//         console.error('Error fetching chat history:', error);
//         res.status(500).json({ error: 'Failed to fetch chat history' });
//     }
// };

// Get chat history for a community
exports.getCommunityMessages = async (req, res) => {
    try {
        const { communityName } = req.params;
        const messages = await ChatMessage.find({ community: communityName })
            .sort({ timestamp: -1 })
            .limit(100)
            .populate('senderId', 'name avatar'); // Added populate to get user details
        res.json(messages.reverse());
    } catch (error) {
        console.error('Error fetching community chat history:', error);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
};

// Mark messages as read
exports.markMessagesAsRead = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user._id;

        await ChatMessage.updateMany(
            {
                projectId,
                readBy: { $ne: userId }
            },
            {
                $addToSet: { readBy: userId }
            }
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ error: 'Failed to mark messages as read' });
    }
};

// Handle real-time messaging for communities
// exports.handleCommunityMessage = async (io, socket, messageData) => {
//     try {
//         const { communityName, userId, username, content } = messageData;
        
//         // Save message to database
//         const message = new ChatMessage({
//             community: communityName,
//             senderId: new mongoose.Types.ObjectId(userId),
//             username,
//             content,
//             timestamp: new Date()
//         });
//         await message.save();
//         await message.populate('senderId', 'name avatar');

//         // Broadcast message to all users in the community
//         io.to(communityName).emit('new_message', message);
//     } catch (error) {
//         console.error('Error handling community message:', error);
//         socket.emit('error', { message: 'Failed to send message' });
//     }
// };
