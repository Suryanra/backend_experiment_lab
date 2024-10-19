const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/authRoutes");

const app = express();

app.use(bodyParser.json());
app.use(cors());


app.get('/check',(req,res)=>{
  res.send({message:"okay okay"});
})

// fetch all the event
app.get("/getevents/:userId", (req, res) => {
  const userId = req.params.userId;
  console.log("me clicked");
  console.log(userId);
  db.query(
    "SELECT * FROM events WHERE userId = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.log(err.message)
        return res.status(500).json({ error: err.message });
      }
      console.log("getevent called",results);
      res.json(results);
    }
  );
});

// post the event
app.post("/addevent", (req, res) => {
  console.log("hello");
  const { userId, date, event } = req.body; // Get userId from the request body
  console.log({ userId, date, event });
  db.query(
    "INSERT INTO events (userId, date, event) VALUES (?, ?, ?)",
    [userId, date, event],
    (err, results) => {

      if (err) {

      console.log(err.message);
        return res.status(500).send({ error: err.message });
      }
      console.log("=> ", results);
      res.status(201).send({ id: results.insertId, userId, date, event });
    }
  );
});

// edit the event
app.put('/editevent/:id',(req,res)=>{
  console.log("edit event called");
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

})

// delete the event
app.delete("/deleteevent/:eventId", (req, res) => {
  const eventId = req.params.eventId;
  const { userId } = req.body; // Get userId from the request body

  db.query('DELETE FROM events WHERE id = ? AND userId = ?', [eventId, userId], (err, results) => {
    if (err) {
      console.log("error: err.message ",err.message )
      return res.status(500).json({ error: err.message });
    }
    console.log("result=> Event deleted successfully")
    res.json({ message: 'Event deleted successfully' });
  });
  
});


app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
