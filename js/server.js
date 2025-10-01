// Enkel Express-server for brukerregistrering
const express = require('express');
const mongoose = require('mongoose');
const User = require('./userModel');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

// Koble til MongoDB (endre connection string ved behov)
mongoose.connect('mongodb://localhost:27017/dat2000', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Endepunkt for registrering
app.post('/register', async (req, res) => {
  try {
    const { fornavn, etternavn, email, telefon, brukernavn, passord } = req.body;
    // Her kan du legge til ekstra validering og hashing av passord
    const user = new User({ fornavn, etternavn, email, telefon, brukernavn, passord });
    await user.save();
    res.status(201).json({ message: 'Bruker registrert!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET-endepunkt for /register for testformål
app.get('/register', (req, res) => {
  res.send('Serveren kjører! POST til /register for å registrere bruker.');
});

// Start server
app.listen(3000, () => {
  console.log('Server kjører på port 3000');
});
