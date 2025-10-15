const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

// Route imports (conditionally load to avoid crashes if some files are absent in deploy)
const routesDir = path.join(__dirname, 'routes');
function loadRoute(filename) {
  const fullPath = path.join(routesDir, filename);
  if (fs.existsSync(fullPath)) {
    return require(fullPath);
  }
  console.warn(`⚠️  Route file missing: ${fullPath} — skipping mount`);
  return null;
}

const authRoutes = loadRoute('auth.js');
const contactRoute = loadRoute('contact.js');
const postRoutes = loadRoute('post.js');
const commentRoutes = loadRoute('comments.js');
const messageRoutes = loadRoute('messages.js');
const profileRoutes = loadRoute('profile.js');
const userRoutes = loadRoute('user.js');
const productRoutes = loadRoute('product.js');
const adminRoutes = loadRoute('admin.js');
const shopRoutes = loadRoute('shop.js');

const app = express();

// ✅ Define allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://agri-chat-project.vercel.app'
];

// ✅ Log incoming origins (optional for debugging)
app.use((req, res, next) => {
  console.log("Incoming request from:", req.headers.origin);
  next();
});

// ✅ Apply CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ You can remove this — unnecessary and could conflict
// app.options('*', cors()); 

app.use(express.json());

// ✅ Setup HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ✅ API Routes (mount only if present)
if (authRoutes) app.use('/api/auth', authRoutes);
if (contactRoute) app.use('/api/contact', contactRoute);
if (postRoutes) app.use('/api/posts', postRoutes);
if (commentRoutes) app.use('/api/comments', commentRoutes);
if (messageRoutes) app.use('/api/messages', messageRoutes);
if (profileRoutes) app.use('/api/profile', profileRoutes);
if (userRoutes) app.use('/api/users', userRoutes);
if (productRoutes) app.use('/api/products', productRoutes);
if (shopRoutes) app.use('/api/shop', shopRoutes);
if (adminRoutes) app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static('uploads'));

// ✅ MongoDB connection and boot sequence
// Disable buffering so queries fail fast if not connected
mongoose.set('bufferCommands', false);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not set');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });
    console.log("✅ MongoDB connected");

    // Start HTTP server only after DB connection
    server.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
})();

// ✅ Socket.IO logic
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

// ✅ Root route
app.get('/', (req, res) => res.send('🌐 API Running'));

// ✅ Health endpoint to verify readiness
app.get('/api/health', (req, res) => {
  const mongoState = mongoose.connection.readyState; // 1 = connected
  res.json({
    status: 'ok',
    mongoConnected: mongoState === 1,
    env: {
      hasMongoUri: Boolean(process.env.MONGO_URI),
      hasJwtSecret: Boolean(process.env.JWT_SECRET)
    }
  });
});
