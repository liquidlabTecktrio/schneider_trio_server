const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from 'Authorization' header

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    const verified = jwt.verify(token, secretKey); // Verify token
    req.user = verified; // Attach the decoded payload to the request object
    next(); // Pass control to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;