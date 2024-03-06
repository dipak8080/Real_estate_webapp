const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Make sure the path is correct

router.post('/signup', userController.register); 
router.post('/login', userController.login); 
router.get('/logout', userController.logout); 

// Add this line to include the profile update functionality
router.get('/profile', authMiddleware, userController.getUserProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;
