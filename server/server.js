const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const contactRoute = require('./routes/contact');
const postRoutes = require('./routes/Post');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoute);
app.use('/api/posts', postRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error", err));

app.get('/', (req, res) => res.send('API Running'));

app.listen(5000, () => console.log('Server started on port 5000'));
