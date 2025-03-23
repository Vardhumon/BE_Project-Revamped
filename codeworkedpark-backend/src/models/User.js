const mongoose = require("mongoose");

const taskProgressSchema = new mongoose.Schema({
    taskId: mongoose.Schema.Types.ObjectId,
    completed: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    techStack: [{ type: String }],
    experienceLevel: { type: String, default: "" },
    bio: { type: String, default: "" },
    education: { type: String, default: "" },
    hobbies: { type: String, default: "" },
    projects: [
        {
            projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
            repoUrl: { type: String },
            tasks: [taskProgressSchema],
        },
    ],
});

module.exports = mongoose.model("User", userSchema);