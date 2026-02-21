const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const authController = {
  // POST /api/auth/register
  async register(req, res) {
    try {
      const { firstName, lastName, email, phone, password } = req.body;

      if (!firstName || !lastName || !email || !phone || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      const user = new User({
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        password,
        role: 'customer'
      });

      await user.save();

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, message: 'Error creating account' });
    }
  },

  // POST /api/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Error logging in' });
    }
  },

  // GET /api/auth/me
  async getMe(req, res) {
    try {
      res.json({
        success: true,
        user: {
          id: req.user._id,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
          phone: req.user.phone,
          role: req.user.role
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching user' });
    }
  }
};

module.exports = authController;
