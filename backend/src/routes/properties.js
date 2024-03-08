const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const authMiddleware = require('../middleware/authMiddleware');

// Destructure your imported functions for clarity and to avoid potential naming conflicts.
const { 
  createProperty, 
  listProperties, 
  getPropertyDetails, 
  archiveProperty, 
  unarchiveProperty, 
  deleteProperty, 
  listAllPropertiesForOwner 
} = require('../controllers/propertyController');

// POST route to create a new property. Protected by authMiddleware.
router.post('/add', authMiddleware, upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'image360', maxCount: 5 },
  { name: 'propertyPapers', maxCount: 5 },
  { name: 'video', maxCount: 1 },
  { name: 'featurePhoto', maxCount: 1 }
]), createProperty);

// GET route to list all properties for the owner. Protected by authMiddleware.
// This should be above the '/:id' route to avoid conflicts.
router.get('/my-properties', authMiddleware, listAllPropertiesForOwner);

// GET route to list all active (non-archived) properties.
router.get('/', authMiddleware, listProperties);

// GET route to retrieve details for a single property by ID. Protected by authMiddleware.
router.get('/:id', authMiddleware, getPropertyDetails);

// PUT route to archive a property. Protected by authMiddleware.
router.put('/:id/archive', authMiddleware, archiveProperty);

// PUT route to unarchive a property. Protected by authMiddleware.
router.put('/:id/unarchive', authMiddleware, unarchiveProperty);

// DELETE route to remove a property. Protected by authMiddleware.
router.delete('/:id', authMiddleware, deleteProperty);

module.exports = router;
