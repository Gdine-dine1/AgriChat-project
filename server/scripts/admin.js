const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust path if needed

dotenv.config(); // Load env variables

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  const email = 'geradineadmin@gmail.com'; // Change to your admin's email
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    existingUser.role = 'admin';
    await existingUser.save();
    console.log('✅ User updated to admin:', existingUser.username);
  } else {
    const hashedPassword = await bcrypt.hash('admin9490', 10); // Set desired password
    const newUser = await User.create({
      username: 'Admin',
      email,
      password: hashedPassword,
      role: 'admin'
    });
    console.log('✅ Admin created:', newUser.username);
  }

  mongoose.disconnect();
})
.catch((err) => {
  console.error('❌ DB connection error:', err);
  mongoose.disconnect();
});
