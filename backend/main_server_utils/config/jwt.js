const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || "" ;

const generateToken = (user) => {
  // return jwt.sign({ user }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRY })
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken, JWT_SECRET };