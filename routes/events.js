// routes/events.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// Create a new event (Protected Route)
router.post('/', protect, (req, res) => {
  const { title, description, date_time } = req.body;

  const query = 'INSERT INTO events (title, description, date_time, user_id) VALUES (?, ?, ?, ?)';
  pool.execute(query, [title, description, date_time, req.user.uid], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({ message: 'Event created successfully', eventId: results.insertId });
  });
});

// Get all events for the logged-in user (Protected Route)
router.get('/', protect, (req, res) => {
  const query = 'SELECT * FROM events WHERE user_id = ?';
  pool.query(query, [req.user.uid], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
});

// Get a single event by ID (Protected Route)
router.get('/:id', protect, (req, res) => {
  const eventId = req.params.id;

  const query = 'SELECT * FROM events WHERE id = ? AND user_id = ?';
  pool.query(query, [eventId, req.user.uid], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(results[0]);
  });
});

// Update an event (Protected Route)
router.put('/:id', protect, (req, res) => {
  const eventId = req.params.id;
  const { title, description, date_time } = req.body;

  const query = 'UPDATE events SET title = ?, description = ?, date_time = ? WHERE id = ? AND user_id = ?';
  pool.execute(query, [title, description, date_time, eventId, req.user.uid], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: 'Event updated successfully' });
  });
});

// Delete an event (Protected Route)
router.delete('/:id', protect, (req, res) => {
  const eventId = req.params.id;

  const query = 'DELETE FROM events WHERE id = ? AND user_id = ?';
  pool.execute(query, [eventId, req.user.uid], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: 'Event deleted successfully' });
  });
});

module.exports = router;
