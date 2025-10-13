// Vi lager et mongoose objekt
const mongoose = require("mongoose")

// Vi lager et TurSchema med mongoose
const TurSchema = new mongoose.Schema({
    navn: {
        type: String,
        required: true,
        trim: true
    },
    datoer: {
        // Date-array
        type: [Date],
        required: true
    },
    destinasjon: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ["fjelltur", "skogstur"]
    },
    turLengde: {
        type: String,
        required: true,
        enum: ["kort", "middels", "lang"]
    },
    vanskelighetsgrad: {
        type: String,
        required: true,
        enum: ["lett", "middels", "vanskelig"]
    },
    lederId: {
        // type må være en ObjectID tilhørende
        // en bruker i "bruker"-modellen
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bruker",
        required: true
    },
    deltakerIds: {
        // type må være en ObjectID tilhørende
        // bruker/e i "bruker"-modellen. Hence arraybrackets.
        //
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Bruker"
    }
})

// Eksporterer modellen slik at den kan brukes senere
// Tredje parameter (turer i dette tilfelle) spesifiserer collection-navnet i databasen
module.exports = mongoose.model('Tur', TurSchema, 'turer');