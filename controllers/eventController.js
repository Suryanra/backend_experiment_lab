const db = require('../config/db');

// Get all events for a user
exports.allEvent = (req, res) => {
  // res.send({hello:"hello everybof"})
  console.log("me cakked");
  // const { userId } = req.body; // Get userId from the request body
  const userId=req.params.userId;
    console.log(userId);
  db.query('SELECT * FROM events WHERE userId = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Add a new event
exports.addEvent = (req, res) => {
  console.log("hello");

  const { userId, date, event } = req.body; // Get userId from the request body
    console.log({userId, date, event });
  db.query(
    'INSERT INTO events (userId, date, event) VALUES (?, ?, ?)',
    [userId, date, event],
    (err, results) => {
      if (err) {
        return res.status(500).send({ error: err.message });
      }
      res.status(201).send({ id: results.insertId, userId, date, event });
    }
  );
};

// Edit an event
exports.editEvent = (req, res) => {
  const eventId = req.params.id;
  const { userId, date, event } = req.body; // Get userId from the request body
  db.query(
    'UPDATE events SET date = ?, event = ? WHERE id = ? AND userId = ?',
    [date, event, eventId, userId], // Include userId in the query to ensure the event belongs to the user
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Event updated successfully' });
    }
  );
};

// Delete an event
exports.deleteEvent = (req, res) => {
  const eventId = req.params.id;
  const { userId } = req.body; // Get userId from the request body
  db.query('DELETE FROM events WHERE id = ? AND userId = ?', [eventId, userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Event deleted successfully' });
  });
};
