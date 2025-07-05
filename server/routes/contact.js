const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Replace these with your actual Gmail credentials or use environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.CONTACT_EMAIL, // your email
        pass: process.env.CONTACT_PASSWORD, // app password
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.CONTACT_EMAIL, // receive in same inbox
      subject: `New message from ${name} (${email})`,
      text: message,
    });

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Failed to send message. Try again later.' });
  }
});

module.exports = router;
