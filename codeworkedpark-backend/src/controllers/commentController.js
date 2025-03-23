const Comment = require('../models/Comment');

exports.getComments = async (req, res) => {
    const projectId = req.params.projectId;
    // console.log(projectId)
    try {
        const comments = await Comment.find({ projectId});
        // console.log(comments);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments" });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { projectId, userId, username, text } = req.body;
        const newComment = new Comment({ projectId, userId, username, text });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: "Error adding comment" });
    }
};