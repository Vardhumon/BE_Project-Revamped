const mongoose = require('mongoose');

const submittedProjectSchema = new mongoose.Schema({
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Project" 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    stars: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    username: String,
    githubLink: String,
    deploymentLink: String,
    summary: String,
    community: String, // Example: "Full Stack", "ML", "AI"
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Comment" 
    }]
}, { 
    timestamps: true 
});

const SubmittedProject = mongoose.model("SubmittedProject", submittedProjectSchema);

module.exports = SubmittedProject;