// Vi lager et mongoose objekt
const mongoose = require("mongoose")

// Vi lager et brukerschema med mongoose
// "BrukerSchema" er en valgfri variabel
const BrukerSchema = new mongoose.Schema({
    navn: {
        type: String,
        required: true,
        // Trim fjerner eventuelle mellomrom
        // på starten og slutten av en string
        trim: true
    },
    epost: {
        type: String,
        required: true,
        // Det kan kun finnes EN av denne eposten
        unique: true,
        // Eventuelle store bokstaver gjøres små
        lowercase: true,
        trim: true
    },
    rolle: {
        type: String,
        required: true,
        // Kun disse rollene tillates/ eksisterer
        enum: ["deltaker", "turleder", "admin"],
        default: "deltaker"
    }
})

// Eksporterer modellen slik at den kan brukes senere
// Tredje parameter (Brukere i dette tilfelle) spesifiserer collection-navnet i databasen
module.exports = mongoose.model('Bruker', BrukerSchema, 'brukere');