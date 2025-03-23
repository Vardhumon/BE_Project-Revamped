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
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);