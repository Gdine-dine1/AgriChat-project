// routes/profile.js
const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch {
    res.status(404).json({ error: "User not found" });
  }
});

// Update profile (bio only for now)
// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { bio },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
