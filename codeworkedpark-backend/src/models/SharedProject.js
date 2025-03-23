const mongoose = require('mongoose');

const sharedProjectSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    githubLink: String,
    community: {
        type: String,
        required: true
    },
    collaborators: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['open', 'in-progress', 'completed'],
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SharedProject', sharedProjectSchema);