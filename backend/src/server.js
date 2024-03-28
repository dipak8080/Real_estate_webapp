require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('Server URL:', process.env.REACT_APP_SERVER_URL);


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const initializeSocketServer = require('./utils/socket'); 

const userRoutes = require('./routes/userRoutes');
const propertiesRoutes = require('./routes/properties');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app); 

// Detailed CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware with the specified options
app.use(cors(corsOptions));

// Middleware for parsing JSON and urlencoded data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    
  .then(() => {
    console.log('Connected to MongoDB');
    // Initialize WebSocket after MongoDB is connected and before the server starts listening
    initializeSocketServer(server); // Corrected function call
  })
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Use routes from the routes files
app.use('/api/users', userRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/messages', messageRoutes);
app.use('/admin', adminRoutes);

// Define a simple route for testing
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Listen on a port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
