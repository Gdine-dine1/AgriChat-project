const express = require('express');
const router = express.Router();
const ShopItem = require('../models/ShopItem');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// --- Shop Item CRUD (Admin) ---
// Get all shop items
router.get('/items', async (req, res) => {
  const items = await ShopItem.find();
  res.json(items);
});

// Add new shop item (admin only)
router.post('/items', auth, async (req, res) => {
  // You may want to check req.user.role === 'admin' here
  try {
    const item = new ShopItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update shop item (admin only)
router.put('/items/:id', auth, async (req, res) => {
  try {
    const item = await ShopItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete shop item (admin only)
router.delete('/items/:id', auth, async (req, res) => {
  try {
    await ShopItem.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Orders (Customer) ---
// Place an order
router.post('/orders', auth, async (req, res) => {
  try {
    const order = new Order({
      user: req.user.id,
      items: req.body.items, // [{ shopItem, quantity }]
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// (Optional) Get orders for logged-in user
router.get('/orders', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate('items.shopItem');
  res.json(orders);
});

// --- Admin: Get all orders ---
router.get('/orders/all', auth, async (req, res) => {
  if (!req.user.role || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const orders = await Order.find().populate('user').populate('items.shopItem');
  res.json(orders);
});

// --- Admin: Update order status ---
router.put('/orders/:id/status', auth, async (req, res) => {
  if (!req.user.role || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(order);
});

module.exports = router; 