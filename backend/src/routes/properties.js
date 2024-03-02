// src/routes/properties.js
const express = require('express');
const upload = require('../utils/upload');
const { createProperty, listProperties } = require('../controllers/propertyController'); // Ensure these are correctly imported
const router = express.Router();

// Updated POST route to include 'featurePhoto' in upload.fields
router.post('/add', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'image360', maxCount: 1 },
  { name: 'propertyPapers', maxCount: 1 },
  { name: 'featurePhoto', maxCount: 1 } // Added line for handling featurePhoto
]), createProperty);

// GET route to list all properties
router.get('/', listProperties);

// ... other routes if any ...

module.exports = router;
