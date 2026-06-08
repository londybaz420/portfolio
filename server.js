const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/tiktok', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tiktok.html'));
});

app.get('/facebook', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'facebook.html'));
});

// TikTok Proxy API
app.get('/api/tiktok', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        return res.status(400).json({ success: false, message: 'URL is required' });
    }

    try {
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/down/tiktok?url=${encodeURIComponent(videoUrl)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('TikTok API Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch TikTok data' });
    }
});

// Facebook Proxy API (Place holder for JerryCoder FB Downloader)
app.get('/api/facebook', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        return res.status(400).json({ success: false, message: 'URL is required' });
    }

    try {
        // Using common pattern for JerryCoder workers
        const apiUrl = `https://jerrycoder.oggyapi.workers.dev/down/facebook?url=${encodeURIComponent(videoUrl)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Facebook API Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Facebook data' });
    }
});

// Contact Route
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID_HERE';
    const text = `🚀 *New Contact Form Submission*\n\n*Name:* ${name}\n*Email:* ${email}\n*Message:* ${message}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: 'Markdown' })
        });
        if (response.ok) {
            res.status(200).json({ success: true, message: 'Message sent successfully!' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to send message.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Team-Bandaheali Server running on http://localhost:${PORT}`);
});
