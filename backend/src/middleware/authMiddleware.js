const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader);  // Log the header to check it's received correctly

  if (!authHeader) {
    return res.status(401).send({ message: 'Authorization header is missing.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer' && parts[1].trim() !== '') {
    const token = parts[1].trim();
    console.log('Token:', token);  // Confirm the token is there

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { _id: decoded.userId };
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).send({ message: 'Invalid token.' });
    }
  } else {
    return res.status(401).send({ message: 'Token is not in proper format.' });
  }
};

module.exports = authMiddleware;