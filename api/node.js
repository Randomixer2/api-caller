// server.js
const express = require('express');
const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;  // Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN;    // Twilio Auth Token
const client = twilio(accountSid, authToken);

// Serve the static HTML file for the frontend
app.use(express.static('public'));

// Endpoint to handle the call request
app.get('/call', (req, res) => {
    const toPhoneNumber = req.query.to; // Phone number the user wants to call
    const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Your Twilio phone number

    // Check if the phone number starts with +63 (Philippines)
    if (!toPhoneNumber || !toPhoneNumber.match(/^\+63\d{9}$/)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid Philippines phone number (e.g., +63 912 345 6789)' });
    }

    // Make the call via Twilio API
    client.calls
        .create({
            to: toPhoneNumber,
            from: fromPhoneNumber,
            url: 'http://demo.twilio.com/docs/voice.xml', // A simple TwiML response URL
        })
        .then(call => {
            console.log('Call initiated:', call.sid);
            res.json({ success: true, message: 'Call initiated successfully!' });
        })
        .catch(error => {
            console.error('Error initiating call:', error);
            res.status(500).json({ success: false, message: 'Error initiating call: ' + error.message });
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
