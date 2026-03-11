const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET || 'electronics-repair-secret-key',
    { expiresIn: '7d' }
  );
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide both username and password' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = generateToken(user);

    res.json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        businessName: user.businessName,
        ownerName: user.ownerName,
        email: user.email,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const register = async (req, res) => {
  try {
    const { username, password, businessName, ownerName, email, phone, address, businessType } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide both username and password' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = new User({
      username,
      password,
      role: 'admin', // First user becomes admin
      businessName: businessName || '',
      ownerName: ownerName || '',
      email: email || '',
      phone: phone || '',
      address: address || '',
      businessType: businessType || '',
    });

    await user.save();

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        businessName: user.businessName,
        ownerName: user.ownerName,
        email: user.email,
        phone: user.phone,
      },
      token: generateToken(user),
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = new User({
      username,
      password,
      role: 'admin',
    });

    await user.save();

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      token: generateToken(user),
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, register, createAdmin };