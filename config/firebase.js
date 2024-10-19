// config/firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your-firebase-admin-sdk-key.json'); // Replace with your actual path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
