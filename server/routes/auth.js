const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure your User model includes the `role` field

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(422).json({ error: 'username, email and password are required' });
    }

    const emailRegex = /.+@.+\..+/;
    if (!emailRegex.test(email)) {
      return res.status(422).json({ error: 'Invalid email format' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashed,
      role: role || 'user',
    });

    await user.save();

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server misconfiguration: JWT_SECRET missing' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    const isMongoNotConnected = /MongooseError|buffering timed out|Topology/.test(err.message || '');
    if (isMongoNotConnected) {
      return res.status(503).json({ error: 'Database unavailable. Please try again later.' });
    }
    res.status(400).json({ error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role }, // 🛠 role included
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
