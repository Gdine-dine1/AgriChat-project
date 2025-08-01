const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      shopItem: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem', required: true },
      quantity: { type: Number, required: true, min: 1 },
    }
  ],
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema); 