const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fornavn: { type: String, required: true },
  etternavn: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefon: { type: String },
  brukernavn: { type: String, required: true, unique: true },
  passord: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
