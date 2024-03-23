// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const isAdmin = require('../middleware/isAdmin'); // Make sure this path is correct to where your isAdmin middleware is located.

// Route to list all users
router.get('/users', isAdmin, adminController.adminListUsers);

// Route to get a single user's details for editing
router.get('/user/:userId', isAdmin, adminController.getUserDetails);

// Route to edit a user profile
router.put('/user/:userId', isAdmin, adminController.adminEditUser);

// Route to delete a user
router.delete('/user/:userId', isAdmin, adminController.adminDeleteUser);

// Route to list all properties
router.get('/properties', isAdmin, adminController.adminListProperties); // This is the added route

// Route to archive a property
router.put('/property/archive/:propertyId', isAdmin, adminController.adminArchiveProperty);

// Route to unarchive a property
router.put('/property/unarchive/:propertyId', isAdmin, adminController.adminUnarchiveProperty);

// Route to delete a property
router.delete('/property/:propertyId', isAdmin, adminController.adminDeleteProperty);

// Admin route to feature a property
router.put('/properties/:propertyId/feature', isAdmin, adminController.adminFeatureProperty);

// Admin route to unfeature a property
router.put('/properties/:propertyId/unfeature', isAdmin, adminController.adminUnfeatureProperty);

module.exports = router;