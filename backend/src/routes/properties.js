// src/routes/properties.js
const express = require('express');
const upload = require('../utils/upload');
const { createProperty, listProperties, getPropertyDetails } = require('../controllers/propertyController'); 

const router = express.Router();

// Updated POST route to include 'featurePhoto' in upload.fields
router.post('/add', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'image360', maxCount: 5 }, // Example: Adjust maxCount as needed
  { name: 'propertyPapers', maxCount: 5 }, // Example: Adjust maxCount as needed
  { name: 'video', maxCount: 1 },
  { name: 'featurePhoto', maxCount: 1 } 
]), createProperty);

// GET route to list all properties
router.get('/', listProperties);

// GET route to retrieve a single property by ID
router.get('/:id', getPropertyDetails);


module.exports = router;
