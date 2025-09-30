# DAT2000 Tur-applikasjon

En enkel webapplikasjon for registrering og håndtering av brukere i en turapplikasjon.

## Struktur

### Hovedfiler
- `index.html` - Hovedside og navigasjon
- `registrering.html` - Brukerregistrering
- `login.html` - Brukerinnlogging
- `Bruker.html` - Brukerside (krever innlogging)
- `Admin.html` - Admin innlogging
- `Admin-dashboard.html` - Admin dashboard
- `Tur.html` - Turinformasjon
- `css/styles.css` - Hovedstilark for alle sider

## Funksjonalitet

### Brukerregistrering og innlogging
1. **Registrering** (`registrering.html`)
   - Registrer nye brukere med fornavn, etternavn, e-post, telefon, brukernavn og passord
   - Validering av alle felt
   - Sjekker for duplikate brukernavn/e-post
   - Lagrer brukerdata i localStorage

2. **Innlogging** (`login.html`)
   - Logg inn med brukernavn/e-post og passord
   - Sesjonshåndtering via localStorage
   - Automatisk omdirigering til brukerside

3. **Brukerside** (`Bruker.html`)
   - Personalisert velkomst
   - Viser brukerinformasjon
   - Hurtiglenker til funktionalitet
   - Utloggingsfunksjon

### Admin-funksjonalitet
- Separat admin-innlogging med hardkodede legitimasjoner
- Admin dashboard med egen sesjonshåndtering

## Tekniske detaljer

### Arkitektur
- Alle HTML-filer bruker felles CSS-fil: `css/styles.css`
- Organisert med modulære CSS-klasser og responsive design
- Konsistent styling og fargepalett på tvers av alle sider

### Datalagring
- Bruker localStorage for klient-side datalagring
- Brukerdata lagres i `registeredUsers` array
- Sesjonsinformasjon i `currentUser` og `userLoggedIn`

### Sikkerhet
- Enkel klient-side validering
- Sesjonshåndtering via localStorage
- Passordmjuking direkte (ikke produksjonsklart)

### Styling
- Ekstern CSS-fil (`css/styles.css`) for alle sider
- Konsistent design med grønn fargeskjema (#165b03)
- Responsivt design med mobile-first tilnærming
- Card-basert layout med skygger
- Hover-effekter og overgangsanimasjoner
- Utility-klasser for rask utvikling

## Bruk

1. Åpne `index.html` i nettleseren
2. Velg "Opprett bruker" for å registrere ny bruker
3. Fill inn alle obligatoriske felt og opprett bruker
4. Bruk "Logg inn som bruker" for å logge inn
5. Etter innlogging får du tilgang til brukersiden

### Admin-tilgang
- Bruk "Admin innlogging" knappen
- Demo-legitimasjoner:
  - Brukernavn: `admin`
  - Passord: `admin123`

## Utvidelsesmuligheter

- Legg til backend for sikker datalagring
- Implementer riktig passord-hashing
- Legg til "glemt passord" funksjonalitet
- Utvid Tur.html med turregistrering
- Legg til brukerprofil-redigering
- Implementer favoritt-turer funksjonalitet

## Testing

Test følgende brukerflyt:
1. Registrer ny bruker på `registrering.html`
2. Logg inn med de nye legitimasjonene på `login.html`
3. Verifiser at brukersiden viser riktig brukerinformasjon
4. Test utlogging og verifiser omdirigering til innloggingsside
5. Test admin-funksjoner separat

---
*Opprettet som del av DAT2000 obligatorisk oppgave*