const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

// Route imports
const authRoutes = require('./routes/auth');
const contactRoute = require('./routes/contact');
const postRoutes = require('./routes/Post');
const commentRoutes = require('./routes/comments');
const messageRoutes = require('./routes/messages');
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');

// App and Server setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoute);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Socket.IO Logic
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on('online', (username) => {
    onlineUsers.set(socket.id, username);
    console.log(`🟢 ${username} is online`);
    io.emit('usersOnline', onlineUsers.size);
  });

  socket.on('sendMessage', (msg) => {
    io.emit('receiveMessage', msg);
  });

  socket.on('editMessage', (msg) => {
    io.emit('messageUpdated', msg);
  });

  socket.on('deleteMessage', (id) => {
    io.emit('messageDeleted', id);
  });

  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  });

  socket.on('reactMessage', ({ messageId, emoji, username }) => {
    io.emit('messageReacted', { messageId, emoji, username });
  });

  socket.on('disconnect', () => {
    const username = onlineUsers.get(socket.id);
    if (username) {
      console.log(`🔴 ${username} disconnected`);
      onlineUsers.delete(socket.id);
      io.emit('usersOnline', onlineUsers.size);
    }
  });
});

// Root route
app.get('/', (req, res) => res.send('🌐 API Running'));

// Start server
server.listen(5000, () => {
  console.log('🚀 Server listening on port 5000');
});
