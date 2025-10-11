// Import for .env
require("dotenv").config();

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

// Oppkobling til MongoDB!
// Utilizer oppkoblingsstringen i /.env
// then/catch er feilhåndtering
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Oppkobling suksess!"))
    .catch((error) => console.error("Feil ved oppkobling:", error))

// app.get lager et endepunkt (på en måte index for backend)
// Når noen sender en request, res er svaret: "backend fungerer"
// res sender json data tilbake til spørrer.
app.get("/", (req, res) => {
    res.json({ message: "Backend fungerer!"})
})

// Serveren starter
app.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT} `)
})