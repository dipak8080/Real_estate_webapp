const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get the token from the header
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (user && user.isAdmin) {
      req.user = user; // Add user data to request object
      next();
    } else {
      res.status(403).json({ message: 'Not authorized as an admin' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Failed to authenticate token', error: error.message });
  }
};

module.exports = isAdmin;
