const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    techStack: [String],
    difficultyLevel: String,
    
    steps: [
        {
            step: String,
            subSteps: [String],
        },
    ],
    testingMetrics: [String],
    tag: String,
    enhancements: [String],
    stars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model("Project", projectSchema);