const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get all messages (most recent last)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Post a new message
router.post('/', async (req, res) => {
  try {
    const { sender, content, replyTo } = req.body;
    const newMessage = new Message({ sender, content, replyTo });
    const saved = await newMessage.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Update a message
router.put('/:id', async (req, res) => {
  try {
    const { content } = req.body;
    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Delete a message
router.delete('/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;
