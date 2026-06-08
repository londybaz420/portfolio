const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/tiktok', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tiktok.html'));
});

app.get('/facebook', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'facebook.html'));
});

// TikTok API Proxy
app.get('/api/tiktok', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ status: 'error', message: 'URL is required' });

  try {
    const response = await axios.get(`https://jerrycoder.oggyapi.workers.dev/down/tiktok?url=${encodeURIComponent(videoUrl)}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch video' });
  }
});

// Facebook API Proxy
app.get('/api/facebook', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ status: 'error', message: 'URL is required' });

  try {
    const response = await axios.get(`https://jerrycoder.oggyapi.workers.dev/down/fb?url=${encodeURIComponent(videoUrl)}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch video' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
