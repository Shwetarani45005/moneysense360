const { verifyToken } = require('../config/jwt.js');
const User = require('../models/user.model.js')

/**
 * Authentication middleware that verifies JWT token and attaches user object to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("\n\n", authHeader, "\n\n")
    if (!authHeader) {
      return res.status(401).json({ 
        error: { 
          message: 'Authorization header missing', 
          status: 401 
        } 
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: { 
          message: 'Invalid authorization format. Use: Bearer <token>', 
          status: 401 
        } 
      });
    }

    const token = authHeader.substring(7);

    if (!token || token.trim() === '') {
      return res.status(401).json({ 
        error: { 
          message: 'No token provided', 
          status: 401 
        } 
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (verifyError) {
      if (verifyError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: { 
            message: 'Token has expired. Please login again', 
            status: 401,
            code: 'TOKEN_EXPIRED'
          } 
        });
      }
      
      if (verifyError.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          error: { 
            message: 'Invalid token. Authentication failed', 
            status: 401,
            code: 'INVALID_TOKEN'
          } 
        });
      }

      throw verifyError;
    }

    // if (!decoded.user.id) {
    if (!decoded || !decoded.id) {
      return res.status(401).json({ 
        error: { 
          message: 'Invalid token payload', 
          status: 401 
        } 
      });
    }

    // Fetch the user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ 
        error: { 
          message: 'User not found. Invalid token', 
          status: 401,
          code: 'USER_NOT_FOUND'
        } 
      });
    }

    // Attach user data to request object (excluding password)
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    // Token is valid, proceed to next middleware
    next();

  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      error: { 
        message: 'Internal server error during authentication', 
        status: 500 
      } 
    });
  }
};

module.exports = authenticate;