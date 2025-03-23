const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const fetch = require('node-fetch');  // Add this line
require("dotenv").config();

// Import models
const SubmittedProject = require('./src/models/SubmittedProject');
const Project = require('./src/models/Project');
const User = require('./src/models/User');
const Comment = require('./src/models/Comment');
const Community = require('./src/models/Community');

// Import socket handler
const setupSocket = require('./src/socket/socketHandler');

// Import routes
const authRoutes = require('./src/routes/auth');
const communityRoutes = require('./src/routes/community');
const userRoutes = require('./src/routes/user');
const projectRoutes = require('./src/routes/project');
const commentRoutes = require('./src/routes/comment');
const sharedProjectRoutes = require('./src/routes/sharedProjectRoutes');
// Import DB connection
const connectDB = require('./src/config/db');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/', authRoutes);
app.use('/api/', communityRoutes);
app.use('/api/', userRoutes);
app.use('/api/', projectRoutes);
app.use('/api/', commentRoutes);
app.use('/api', sharedProjectRoutes)
// Socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Initialize socket handlers
setupSocket(io);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});