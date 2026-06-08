const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Contact Route - Telegram Integration
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Replace these with your actual Telegram Bot Token and Chat ID
    const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
    const CHAT_ID = 'YOUR_CHAT_ID_HERE';

    const text = `🚀 *New Contact Form Submission*\n\n*Name:* ${name}\n*Email:* ${email}\n*Message:* ${message}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'Markdown'
            })
        });

        if (response.ok) {
            res.status(200).json({ success: true, message: 'Message sent successfully!' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to send message to Telegram.' });
        }
    } catch (error) {
        console.error('Contact Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Team-Bandaheali Server running on http://localhost:${PORT}`);
});
