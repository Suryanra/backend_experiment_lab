// routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// Signup route
router.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: err.message });

    // Insert user into the database
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    pool.execute(query, [username, hash], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({ message: 'User created successfully' });
    });
  });
});

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists
  const query = 'SELECT * FROM users WHERE username = ?';
  pool.execute(query, [username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0];

    // Compare passwords
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Create and sign JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.json({ token });
    });
  });
});

module.exports = router
