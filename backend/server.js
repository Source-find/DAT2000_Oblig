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

// Turregistrering: 

// opprette ny tur
app.post("/api/turer", async (req, res) => {
     console.log("=== POST REQUEST MOTTATT ==="); // validering log
    console.log("Mottatt data:", req.body); // validering log
    try {
        // Opprette ny tur med data i fra skjemaet
        const nyTur = new Tur({
            navn: req.body.navn,
            datoer: req.body.datoer,
            destinasjon: req.body.destinasjon,
            type: req.body.type,
            turLengde: req.body.turLengde,
            vanskelighetsgrad: req.body.vanskelighetsgrad,
            lederId: req.body.lederId,
            deltakerIds: req.body.deltakerIds || [] // Tom array hvis ingen deltakere, slik at det ikke blir undefined
        });
        // Lagre den nye turen i databasen
        const lagretTur = await nyTur.save(); // pauser koden til lagring er ferdig
        // Send tilbake den lagrede turen 
        res.status(201).json(lagretTur);

        // Feilhåndtering
    } catch (error) {
        console.log("=== FEIL OPPSTOD ===");
        console.error("Feil ved opprettelse av tur:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ message: "Kunne ikke opprette tur" });
    }
    
});
// tester MongoDB connection og se database informasjon
app.get("/test-connection", async (req, res) => {
    try {
        // Hent en liste over alle collections (tabeller) i den tilkoblede databasen
        const collections = await mongoose.connection.db.listCollections().toArray();
        // Hent navnet på databasen vi er koblet til
        const dbName = mongoose.connection.name;
        // Send tilbake database informasjon som JSON
        res.json({ 
            database: dbName,
            collections: collections.map(c => c.name),
            connectionState: mongoose.connection.readyState
        });
    } catch (error) {
        // Hvis det oppstår en feil (f.eks. database ikke tilgjengelig)
        res.json({ error: error.message });
    }
});

// Serveren starter
app.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT} `)
})