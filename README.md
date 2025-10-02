# UT.no Klon - Turplanlegging Applikasjon

En moderne web-applikasjon for turplanlegging inspirert av UT.no, bygget med Node.js, Express, MongoDB og vanilla JavaScript.

## 🚀 Hurtigstart

### Forutsetninger
- **Node.js** (versjon 14 eller nyere)
- **MongoDB** (lokal installasjon eller MongoDB Atlas)
- **Git**

### 1. Klon og installer
```bash
# Klon repository
git clone <repository-url>
cd DAT2000_Oblig

# Installer dependencies
npm install
```

### 2. Start MongoDB
```bash
# Windows (hvis MongoDB er installert lokalt)
mongod

# Eller bruk MongoDB Compass/Atlas
```

### 3. Start serveren
```bash
node server.js
```

### 4. Åpne applikasjonen
Naviger til: **http://localhost:3000/home.html**

## 📁 Prosjektstruktur

```
DAT2000_Oblig/
├── server.js              # Hovedserver med Express og MongoDB
├── package.json            # NPM dependencies
├── .gitignore             # Git ignore regler
├── css/
│   └── styles.css         # Hovedstyling
├── js/
│   ├── main.js            # Kart, turer og værdata
│   ├── login.js           # Autentisering
│   └── index.js           # Generell funksjonalitet
├── data/
│   ├── demo-trips.json    # 50 demo-turer fra hele Norge
│   └── trip-schema.json   # JSON schema for validering
├── index.html             # Landingsside
├── home.html              # Hovedapplikasjon
└── login.html             # Innloggingsside
```

## 🛠 Teknologi Stack

- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Frontend**: Vanilla JavaScript + HTML5 + CSS3
- **Kart**: Leaflet.js + OpenStreetMap
- **Værdata**: MET Norway API
- **Autentisering**: Enkel email/passord
- **Data**: JSON-baserte demo-data

## 📋 Funksjoner

### ✅ Implementert
- **Interaktivt kart** med Leaflet.js
- **50 demo-turer** fra hele Norge (Oslo, Bergen, Stavanger, etc.)
- **Værmelding** for alle tursteder (MET Norway API)
- **Brukerautentisering** (registrering/innlogging)
- **Opprett nye turer** (kun innloggede brukere)
- **Filtrer turer** etter lokasjon
- **Responsive design**
- **JSON-basert datastruktur**

### 🔄 Automatisk funksjonalitet
- **Database-rensing** ved oppstart (fjerner duplikater)
- **Demo-data seeding** (legger til 50 unike turer)
- **Værdata oppdatering** for alle lokasjoner

## 🗄 Database Schema

### Trip Model
```javascript
{
  title: String,           // "Holmenkollen"
  description: String,     // "Klassisk tur til..."
  location: String,        // "Oslo"
  date: Date,             // "2025-05-01"
  createdBy: String,      // "demo@utno.no"
  coordinates: [Number]   // [59.9639, 10.6681]
}
```

### User Model
```javascript
{
  email: String,          // "bruker@example.com"
  name: String,           // "Ola Nordmann"
  password: String        // "passord123"
}
```

## 🌐 API Endepunkter

### Turer
- `GET /api/trips` - Hent alle turer (med valgfri location filter)
- `POST /api/trips` - Opprett ny tur
- `DELETE /api/trips/:id` - Slett spesifikk tur
- `DELETE /api/trips/clear` - Slett alle turer

### Autentisering
- `POST /api/auth/register` - Registrer ny bruker
- `POST /api/auth/login` - Logg inn bruker

### Vær
- `GET /api/weather/:location` - Hent værdata for lokasjon

## 🔧 Utvikling

### Start i utviklingsmodus
```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start server med auto-restart
npx nodemon server.js

# Åpne browser: http://localhost:3000/home.html
```

### Database management
```bash
# Se alle turer i MongoDB
mongo
use utno
db.trips.find()

# Tøm database
db.trips.deleteMany({})
```

### Git workflow
```bash
# Sjekk hvilken branch du er på
git branch

# Bytt til feature branch
git checkout feature/json-data-refactor

# Legg til endringer
git add .
git commit -m "Din commit melding"
```

## 📊 Demo Data

Applikasjonen kommer med **50 forhåndsdefinerte turer** fordelt slik:
- **Oslo**: 8 turer (Holmenkollen, Frognerseteren, osv.)
- **Bergen**: 8 turer (Trolltunga, Fløyen, Ulriken, osv.)
- **Stavanger**: 7 turer (Preikestolen, Kjeragbolten, osv.)
- **Trondheim**: 6 turer (Bymarka, Gråkallen, osv.)
- **Tromsø**: 6 turer (Nordkapp, Lofoten, osv.)
- **Lillehammer**: 5 turer (Besseggen, Galdhøpiggen, osv.)
- **Andre regioner**: 10 turer

## 🐛 Vanlige problemer og løsninger

### Server starter ikke
```bash
# Sjekk om MongoDB kjører
mongod --version

# Sjekk om port 3000 er ledig
netstat -an | findstr :3000

# Restart alt
taskkill /F /IM node.exe
mongod
node server.js
```

### 404-feil på API-kall
- Kontroller at serveren kjører på port 3000
- Sjekk at MongoDB er startet
- Refresh nettleseren

### Duplikate turer
- Systemet renser automatisk duplikater ved oppstart
- Hvis problemet vedvarer, tøm databasen manuelt

### Værdata laster ikke
- MET Norway API kan være treg
- Sjekk nettverkstilkobling
- API-kall logges i browser console

## 📱 Browser Support

- **Chrome** 80+
- **Firefox** 75+
- **Safari** 13+
- **Edge** 80+

## 🚀 Produksjon

### Environment variabler
```bash
# Opprett .env fil
PORT=3000
MONGODB_URI=mongodb://localhost:27017/utno
NODE_ENV=production
```

### Build og deploy
```bash
# Installer bare produksjon dependencies
npm install --production

# Start i produksjon
NODE_ENV=production node server.js
```

## 🤝 Bidrag

1. Fork repository
2. Opprett feature branch (`git checkout -b feature/ny-funksjon`)
3. Commit endringer (`git commit -m 'Legg til ny funksjon'`)
4. Push til branch (`git push origin feature/ny-funksjon`)
5. Opprett Pull Request

## 📝 Changelog

### v1.0.0 (Aktuell)
- ✅ Refaktorert til JSON-baserte demo-data
- ✅ Lagt til 50 unike turer fra hele Norge
- ✅ Implementert værdata integrasjon
- ✅ Forbedret database-rensing
- ✅ Responsive design
- ✅ Brukerautentisering

## 📄 Lisens

Dette prosjektet er laget for utdanningsformål som del av DAT2000 kurset.

---

**Laget med ❤️ for DAT2000 - Webutvikling**
