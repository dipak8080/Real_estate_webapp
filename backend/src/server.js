require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/properties'); // Ensure this is the correct path to your property routes file

const app = express();
// Detailed CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Adjust if your frontend is served from a different origin
  credentials: true, // This is important if you're sending requests with credentials (such as cookies or authorization headers)
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
   .then(() => console.log('Connected to MongoDB'))
   .catch(err => console.error('Could not connect to MongoDB', err));

// Use routes from the routes files
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);

// Define a simple route for testing
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));