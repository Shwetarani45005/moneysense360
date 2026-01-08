const User = require('../models/user.model.js');
const { generateToken } = require('../config/jwt.js');

class AuthController {
  static async signup(req, res) {
    try {
      const { first_name, last_name, email, password, username } = req.body;

      if (!first_name || !last_name || !email || !password || !username) {
        return res.status(400).json({ 
          error: { message: 'All fields are required', status: 400 } 
        });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          error: { message: 'User already exists', status: 409 } 
        });
      }

      const user = await User.create({ first_name, last_name, email, password, username });
      const token = generateToken({
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      });

      res.status(201).json({
        message: 'User created successfully',
        data: {
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            username: user.username
          },
          token
        }
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ 
        error: { message: 'Error creating user', status: 500 } 
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          error: { message: 'Email and password are required', status: 400 } 
        });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          error: { message: 'Invalid credentials', status: 401 } 
        });
      }

      const isValidPassword = await User.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: { message: 'Invalid credentials', status: 401 } 
        });
      }

      const token = generateToken({
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      });

      res.json({
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            username: user.username
          },
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: { message: 'Error during login', status: 500 } 
      });
    }
  }

  static async logout(req, res) {
    // With JWT, logout is handled client-side by removing the token
    // This endpoint can be used for logging or token blacklisting if needed
    res.json({ message: 'Logout successful' });
  }
}

module.exports = AuthController;
