const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const contactRoute = require('./routes/contact');
const postRoutes = require('./routes/Post');
const commentRoutes = require('./routes/comments');
const http = require('http'); // for Socket.IO
const { Server } = require('socket.io');
const messageRoutes = require('./routes/messages');


const app = express();
const server = http.createServer(app); // create HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend origin
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoute);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/messages', messageRoutes);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error", err));


  // Socket.IO logic
// 🔁 Keep track of online users
const onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);

  // When user joins, send their username
  socket.on("online", (username) => {
    socket.username = username;
    onlineUsers.add(username);
    console.log("🟢 Online users:", [...onlineUsers]);
    io.emit("usersOnline", onlineUsers.size);
  });

  // Receive message from user and broadcast to others
  socket.on("sendMessage", (msg) => {
    socket.broadcast.emit("receiveMessage", msg); // send to others only
  });

  // Typing event
  socket.on("typing", (username) => {
    socket.broadcast.emit("typing", username);
  });

  // On disconnect, remove user from online list
  socket.on("disconnect", () => {
    if (socket.username) {
      onlineUsers.delete(socket.username);
      console.log("🚫", socket.username, "disconnected");
      io.emit("usersOnline", onlineUsers.size);
    } else {
      console.log("🚫 User disconnected:", socket.id);
    }
  });
});

app.get('/', (req, res) => res.send('API Running'));

server.listen(5000, () => console.log('Server started on port 5000'));
