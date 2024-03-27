const jwt = require('jsonwebtoken');

const socketAuthMiddleware = (socket, next) => {
  // The token should be passed in the query string when establishing the socket connection
  const token = socket.handshake.query.token;
  console.log('Token received in socket:', token);  // Log the token received

  if (!token) {
    return next(new Error('Authentication error: Token is missing.'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { _id: decoded.userId };
    next();
  } catch (error) {
    console.error('Socket token verification failed:', error);
    next(new Error('Authentication error: Invalid token.'));
  }
};

module.exports = socketAuthMiddleware;
