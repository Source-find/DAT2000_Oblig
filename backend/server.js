// Import for .env
require('dotenv').config()

// Import for express
const express = require("express")

// Import for mongoose
const mongoose = require("mongoose")

// Import for path (for å håndtere filstier)
const path = require("path")

// Vi lager en express applikasjon
const app = express()

// Porten som serveren skal kjøres på
const PORT = 3000

// Vi bruker express som middleware. Har med POST/PUT å gjøre
// express.json eksisterer fra før av
app.use(express.json())

// Serve statiske filer (HTML, CSS, JS) fra parent-mappen
app.use(express.static(path.join(__dirname, "..")))

// Oppkobling til MongoDB!
// Utilizer oppkoblingsstringen i /.env
// then/catch er feilhåndtering
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Oppkobling suksess!"))
    .catch((error) => console.error("Feil ved oppkobling:", error))

// Import Tur-modellen
const Tur = require("./models/Tur")
const Bruker = require("./models/Bruker")

// Routes for HTML-sidene
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"))
})

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "admin.html"))
})

app.get("/turer", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "turer.html"))
})

app.get("/brukere", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "brukere.html"))
})

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "dashboard.html"))
})

// app.get lager et endepunkt (på en måte index for backend)
// Når noen sender en request, res er svaret: "backend fungerer"
// res sender json data tilbake til spørrer.
app.get("/", (req, res) => {
    res.json({ message: "Backend fungerer!"})
})

// API-endepunkt for å hente alle turer
app.get("/api/turer", async (req, res) => {
    try {
        // Hent alle turer og populer leder-informasjon
        const turer = await Tur.find().populate("lederId", "navn epost")
        res.json(turer)
    } catch (error) {
        console.error("Feil ved henting av turer:", error)
        res.status(500).json({ message: "Kunne ikke hente turer" })
    }
})

// Serveren starter
app.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT} `)
})