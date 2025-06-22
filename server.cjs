const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });
const app = express();
const PORT = 5001;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

app.use(cors());

app.get('/google-places', async (req, res) => {
  const { input, type = 'textquery', fields = 'place_id,name,geometry' } = req.query;
  if (!input) return res.status(400).json({ error: 'Missing input param' });
  if (!GOOGLE_API_KEY) return res.status(500).json({ error: 'Google API Key not set in server' });
  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(input)}&inputtype=${type}&fields=${fields}&key=${GOOGLE_API_KEY}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`)); 