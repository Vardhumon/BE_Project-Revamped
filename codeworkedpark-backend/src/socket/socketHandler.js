const SubmittedProject = require('../models/SubmittedProject');

const setupSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("project_submitted", async (newProject) => {
            try {
                const subproject = await SubmittedProject.findById(newProject.project._id)
                    .populate("projectId")
                    .populate("comments");
                io.emit("new_project", subproject);
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
};

module.exports = setupSocket;