const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const app = express();
app.use(express.json());

// Serve static frontend files from project root
app.use(express.static(__dirname));

// MongoDB connection with error handling
mongoose.connect('mongodb://127.0.0.1:27017/utno', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => {
  console.warn('MongoDB connection failed:', err.message);
  console.log('Server will continue without database functionality');
});

// User model with password
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

// Trip model
const TripSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String, // free text place name
  date: Date,
  createdBy: String, // user email
  coordinates: [Number] // [lat, lon] for map display
});
const Trip = mongoose.model('Trip', TripSchema);

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Email, navn og passord er påkrevd' });
    }

    // Sjekk om bruker allerede eksisterer
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Bruker med denne e-posten eksisterer allerede' });
    }

    const user = new User({ email, name, password });
    await user.save();
    res.status(201).json({ email: user.email, name: user.name });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email og passord er påkrevd' });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Ugyldig e-post eller passord' });
    }

    res.json({ email: user.email, name: user.name });
  } catch (err) {
    res.status(500).json({ error: 'Serverfeil ved innlogging' });
  }
});

// Legacy endpoint for old registration (keep for compatibility)
app.post('/api/users', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) return res.status(400).json({ error: 'Email og navn er påkrevd' });

    const user = await User.findOneAndUpdate(
      { email },
      { $setOnInsert: { email, name, password: 'legacy' } },
      { new: true, upsert: true }
    );
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all trips with optional location filter - FIXED
app.get('/api/trips', async (req, res) => {
  try {
    const { location } = req.query;
    let query = {};

    // Only filter if location is provided AND not empty
    if (location && location.trim() !== '') {
      // Case-insensitive search for location
      query.location = new RegExp(location.trim(), 'i');
    }
    // If location is empty or not provided, return ALL trips

    const trips = await Trip.find(query).sort({ date: 1, _id: 1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Kunne ikke hente turer' });
  }
});

// Clear all trips (for demo purposes)
app.delete('/api/trips/clear', async (req, res) => {
  try {
    await Trip.deleteMany({});
    res.json({ message: 'All trips cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Could not clear trips' });
  }
});

// Delete individual trip by ID
app.delete('/api/trips/:id', async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete trip' });
  }
});

// Create trip
app.post('/api/trips', async (req, res) => {
  try {
    const { title, description, location, date, createdBy, coordinates } = req.body;
    if (!title || !description || !location || !date || !createdBy) {
      return res.status(400).json({ error: 'Alle felter er påkrevd' });
    }
    const trip = new Trip({ title, description, location, date, createdBy, coordinates });
    await trip.save();
    res.status(201).json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Helper: geocode a free-text place to lat/lon using Nominatim
async function geocodePlace(place) {
  const url = 'https://nominatim.openstreetmap.org/search';
  const params = { format: 'json', q: place, limit: 1 };
  const headers = { 'User-Agent': 'UTnoClone/1.0 (student@example.com)' };
  const { data } = await axios.get(url, { params, headers });
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Fant ikke koordinater for stedet');
  }
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

// Get weather for a place using MET Norway (YR) Locationforecast 2.0
app.get('/api/weather/:location', async (req, res) => {
  try {
    const location = req.params.location;
    // 1) Geocode to lat/lon
    const { lat, lon } = await geocodePlace(location);
    // 2) Call MET Locationforecast
    const url = 'https://api.met.no/weatherapi/locationforecast/2.0/compact';
    const headers = { 'User-Agent': 'UTnoClone/1.0 (student@example.com)', 'Accept': 'application/json' };
    const { data } = await axios.get(url, { params: { lat, lon }, headers });
    res.json({ location, lat, lon, forecast: data });
  } catch (err) {
    console.error('Weather error:', err.message);
    res.status(500).json({ error: 'Kunne ikke hente vær for oppgitt sted' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
