require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
   .then(() => console.log('Connected to MongoDB'))
   .catch(err => console.error('Could not connect to MongoDB', err));

// Define a simple route for testing
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
