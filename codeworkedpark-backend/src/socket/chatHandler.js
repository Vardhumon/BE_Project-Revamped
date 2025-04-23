const ChatMessage = require('../models/ChatMessage');
const chatController = require('../controllers/chatController');
const mongoose = require('mongoose');

const setupChatHandlers = (io) => {
    const activeCommunityUsers = new Map();

    io.on('connection', (socket) => {

        // Join a community chat
        socket.on('join_community', ({ communityName, userId }) => {
            try {
                if (!activeCommunityUsers.has(communityName)) {
                    activeCommunityUsers.set(communityName, new Set());
                }
                activeCommunityUsers.get(communityName).add(userId);

                socket.join(communityName.toString());
                console.log(`User ${userId} joined community ${communityName}`);
                socket.communityName = communityName;
                socket.userId = userId;

                socket.to(communityName.toString()).emit('user_joined_community', { userId });

                socket.emit('active_community_users', {
                    users: Array.from(activeCommunityUsers.get(communityName))
                });
            } catch (error) {
                console.error('Error joining community chat:', error);
                socket.emit('error', { message: 'Failed to join community chat' });
            }
        });

        // Handle community messages
        socket.on('send_community_message', async ({ communityName, userId, username, content }) => {
            try {
                const message = new ChatMessage({
                    community: communityName,
                    senderId: new mongoose.Types.ObjectId(userId),
                    username,
                    content,
                    timestamp: new Date()
                });

                await message.save();
                io.to(communityName.toString()).emit('new_message', message);
            } catch (error) {
                console.error('Error sending community message:', error);
                socket.emit('error', { message: 'Failed to send community message' });
            }
        });

        // Leave
        socket.on('leave_community', ({ communityName }) => {
            if (activeCommunityUsers.has(communityName)) {
                activeCommunityUsers.get(communityName).delete(socket.userId);
                if (activeCommunityUsers.get(communityName).size === 0) {
                    activeCommunityUsers.delete(communityName);
                }
            }

            socket.leave(communityName.toString());
            socket.to(communityName.toString()).emit('user_left_community', { userId: socket.userId });
        });

        // Cleanup 
        socket.on('disconnect', () => {
            if (socket.communityName) {
                const users = activeCommunityUsers.get(socket.communityName);
                if (users) {
                    users.delete(socket.userId);
                    if (users.size === 0) {
                        activeCommunityUsers.delete(socket.communityName);
                    }
                    socket.to(socket.communityName.toString()).emit('user_left_community', { userId: socket.userId });
                }
            }
        });
    });
};

module.exports = setupChatHandlers;
