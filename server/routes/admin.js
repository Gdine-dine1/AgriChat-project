const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Product = require('../models/Product');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Middleware that verifies token and ensures admin role

router.use(auth);
router.use((req, res, next) => {
  if (!req.user?.role || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
});

// GET all posts
router.get('/posts', async (req, res) => {
  const posts = await Post.find().populate('userId', 'username');
  res.json(posts);
});

// DELETE post
router.delete('/posts/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// CREATE post
router.post('/posts', async (req, res) => {
  try {
    const { content, userId, username } = req.body;
    const newPost = new Post({ content, userId, username });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE post
router.put('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all products
router.get('/products', async (req, res) => {
  const prods = await Product.find().populate('farmer', 'username email');
  res.json(prods);
});

// DELETE product
router.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// CREATE product
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, imageUrl, farmer } = req.body;
    const newProduct = new Product({ name, description, price, imageUrl, farmer });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE product
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all chat messages
router.get('/messages', async (req, res) => {
  const msgs = await Message.find().sort({ createdAt: -1 });
  res.json(msgs);
});

// DELETE a chat message
router.delete('/messages/:id', async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// CREATE message
router.post('/messages', async (req, res) => {
  try {
    const { sender, content, replyTo } = req.body;
    const newMessage = new Message({ sender, content, replyTo });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE message
router.put('/messages/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
