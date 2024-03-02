require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/properties');
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));  // Set the limit for JSON payloads
app.use(express.urlencoded({ limit: '50mb', extended: true }));  // Set the limit for URL-encoded payloads

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
