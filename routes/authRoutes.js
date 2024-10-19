const express = require('express');
const { signup, login, verifyOTP } = require('../controllers/authController');
const { allEvent, addEvent, editEvent,deleteEvent } = require('../controllers/eventController');
const router = express.Router();


router.post('/login', login);


module.exports = router;
