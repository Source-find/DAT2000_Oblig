// SELECT* FROM TURER nosql versjon:

const cursor = db.collection('turer').find({}); // Oppretter en cursor for å iterere over alle dokumenter i 'turer' collection
while (await cursor.hasNext()) { // Går gjennom alle dokumentene i cursoren
   console.log(await cursor.next()); // Skriver ut hvert dokument (tur) til konsollen
}

// SELECT* FROM BRUKER nosql versjon:

const cursor = db.collection('brukere').find({});
while (await cursor.hasNext()) {
   console.log(await cursor.next());
}

// Finn alle turer med type 'fjelltur'
const cursor = db.collection('turer').find({ type: 'fjelltur' }); // Legger til filtrering på type 
while (await cursor.hasNext()) {
   console.log(await cursor.next());
}

// Finn alle turledere 
const cursor = db.collection('brukere').find({ rolle: 'turleder' }); // filtrering på rolle
while (await cursor.hasNext()) {
   console.log(await cursor.next());
}

