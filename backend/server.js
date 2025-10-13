// Import for path (for å håndtere filstier)
const path = require("path")

// Last .env fra backend-mappen eksplisitt
require('dotenv').config({ path: path.join(__dirname, '.env') })

// Import for express
const express = require("express")

// Import for mongoose
const mongoose = require("mongoose")

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
if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI mangler. Sjekk at backend/.env finnes og at serveren leser riktig fil.")
    process.exit(1)
}
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

// API-endepunkt for å registrere påmelding til en eksisterende tur
app.post("/api/registrations", async (req, res) => {
    try {
        const { tripId, name, email } = req.body || {}
        if (!tripId || !name || !email) {
            return res.status(400).json({ message: "Mangler tripId, name eller email" })
        }

        // Finn turen
        const tur = await Tur.findById(tripId)
        if (!tur) {
            return res.status(404).json({ message: "Tur ikke funnet" })
        }

        // Finn eller opprett bruker basert på epost
        let bruker = await Bruker.findOne({ epost: email.toLowerCase().trim() })
        if (!bruker) {
            bruker = await Bruker.create({ navn: name.trim(), epost: email.toLowerCase().trim(), rolle: "deltaker" })
        }

        // Sjekk om bruker allerede er påmeldt denne turen
        const alreadyJoined = (tur.deltakerIds || []).some(id => id.toString() === bruker._id.toString())
        if (alreadyJoined) {
            return res.status(409).json({ message: "Du er allerede påmeldt denne turen med denne e-posten." })
        }

        // Legg bruker til deltakerlisten og lagre
        tur.deltakerIds = [...(tur.deltakerIds || []), bruker._id]
        await tur.save()

        return res.status(201).json({
            message: "Påmelding registrert",
            registration: {
                tripId: tur._id,
                userId: bruker._id
            }
        })
    } catch (error) {
        console.error("Feil ved registrering:", error)
        return res.status(500).json({ message: "Kunne ikke registrere påmelding" })
    }
})

// Serveren starter
app.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT} `)
})