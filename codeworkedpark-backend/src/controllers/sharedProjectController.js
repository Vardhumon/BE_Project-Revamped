const SharedProject = require('../models/SharedProject');
const User = require('../models/User');

exports.createSharedProject = async (req, res) => {
    try {
      const { userId, projectId, description, githubLink, community } = req.body;
      console.log(userId, projectId, description, githubLink, community);
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the user has already accepted/shared this project in this community
      const existingSharedProject = await SharedProject.findOne({
        owner: userId,
        projectId,
        community,
      });
  
      if (existingSharedProject) {
        return res.status(400).json({ message: "You have already accepted/shared this project." });
      }
  
      const sharedProject = new SharedProject({
        projectId,
        owner: userId,
        ownerName: user.name,
        description,
        githubLink,
        community,
        collaborators: [{
          userId: userId,
          name: user.name
        }]
      });
  
      await sharedProject.save();
      res.status(201).json(sharedProject);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating shared project" });
    }
  };
  

exports.getSharedProjects = async (req, res) => {
    try {
      const { community } = req.params;
      const projects = await SharedProject.find({ community })
        .populate('projectId')
        .sort({ createdAt: -1 });
  
      res.json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching shared projects" });
    }
  };


exports.joinProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const project = await SharedProject.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check if user is already a collaborator
        if (project.collaborators.some(c => c.userId.toString() === userId)) {
            return res.status(400).json({ message: "Already a collaborator" });
        }

        project.collaborators.push({
            userId,
            name: user.name
        });

        await project.save();
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error joining project" });
    }
};

exports.updateProjectStatus = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { status } = req.body;

        const project = await SharedProject.findByIdAndUpdate(
            projectId,
            { status },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating project status" });
    }
};

exports.askQuestion = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { userId, text, userName } = req.body;
  console.log(projectId, userId, text, userName);
      const project = await SharedProject.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      project.questions.push({
        text,
        userId,
        userName
      });
  
      await project.save();
      res.status(201).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error posting question" });
    }
  };

  exports.answerQuestion = async (req, res) => {
    try {
      const { projectId, questionId } = req.params;
      const { userId, text, userName } = req.body;
  
      const project = await SharedProject.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      const question = project.questions.id(questionId);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
  
      question.answers.push({
        text,
        userId,
        userName
      });
  
      await project.save();
      res.status(201).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error posting answer" });
    }
  };
  
  