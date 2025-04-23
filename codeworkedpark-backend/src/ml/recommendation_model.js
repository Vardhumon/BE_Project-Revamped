const tf = require('@tensorflow/tfjs');
const Project = require('../models/Project');
const User = require('../models/User');

class ProjectRecommender {
    constructor() {
        this.model = null;
        this.userFeatures = [];
        this.projectFeatures = [];
    }

    async preprocessData(users, projects) {
        // Extract user features (tech stack, experience level)
        this.userFeatures = users.map(user => {
            const techStackEncoding = this.encodeTechStack(user.techStack);
            const experienceLevel = this.encodeExperienceLevel(user.experienceLevel);
            return [...techStackEncoding, experienceLevel];
        });

        // Extract project features
        this.projectFeatures = projects.map(project => {
            const techStackEncoding = this.encodeTechStack(project.techStack);
            const difficulty = this.encodeDifficulty(project.difficultyLevel);
            return [...techStackEncoding, difficulty];
        });
    }

    encodeTechStack(techStack) {
        const allTechnologies = [
            'javascript', 'python', 'java', 'react', 'node',
            'mongodb', 'sql', 'aws', 'docker', 'kubernetes'
        ];
        return allTechnologies.map(tech => 
            techStack.includes(tech.toLowerCase()) ? 1 : 0
        );
    }

    encodeExperienceLevel(level) {
        const levels = { 'beginner': 0, 'intermediate': 1, 'advanced': 2 };
        return levels[level.toLowerCase()] || 0;
    }

    encodeDifficulty(level) {
        const levels = { 'easy': 0, 'medium': 1, 'hard': 2 };
        return levels[level.toLowerCase()] || 0;
    }

    async buildModel() {
        this.model = tf.sequential();
        
        // Add layers
        this.model.add(tf.layers.dense({
            units: 32,
            activation: 'relu',
            inputShape: [11] // 10 tech stack + 1 experience/difficulty level
        }));
        
        this.model.add(tf.layers.dense({
            units: 16,
            activation: 'relu'
        }));
        
        this.model.add(tf.layers.dense({
            units: 1,
            activation: 'sigmoid'
        }));

        // Compile model
        this.model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'binaryCrossentropy',
            metrics: ['accuracy']
        });
    }

    async trainModel(userProjectInteractions) {
        const trainXs = [];
        const trainYs = [];

        userProjectInteractions.forEach(interaction => {
            const userFeature = this.userFeatures[interaction.userIndex];
            const projectFeature = this.projectFeatures[interaction.projectIndex];
            const label = interaction.completed ? 1 : 0;

            trainXs.push([...userFeature, ...projectFeature]);
            trainYs.push([label]);
        });

        const xs = tf.tensor2d(trainXs);
        const ys = tf.tensor2d(trainYs);

        await this.model.fit(xs, ys, {
            epochs: 10,
            batchSize: 32,
            validationSplit: 0.2
        });

        xs.dispose();
        ys.dispose();
    }

    async predictProjectMatch(user, project) {
        const userFeature = [
            ...this.encodeTechStack(user.techStack),
            this.encodeExperienceLevel(user.experienceLevel)
        ];
        
        const projectFeature = [
            ...this.encodeTechStack(project.techStack),
            this.encodeDifficulty(project.difficultyLevel)
        ];

        const input = tf.tensor2d([[...userFeature, ...projectFeature]]);
        const prediction = this.model.predict(input);
        const score = await prediction.data();

        input.dispose();
        prediction.dispose();

        return score[0];
    }

    async getTopRecommendations(user, projects, topK = 5) {
        const scores = await Promise.all(
            projects.map(project => 
                this.predictProjectMatch(user, project)
            )
        );

        return projects
            .map((project, index) => ({
                project,
                score: scores[index]
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, topK)
            .map(item => item.project);
    }
}

module.exports = new ProjectRecommender();