document.addEventListener('DOMContentLoaded', () => {
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  document.getElementById('userInfo').textContent = userName ? `Logget inn som ${userName} (${userEmail})` : 'Ikke logget inn';

  // Hent og vis turer
  async function fetchTrips() {
    const res = await fetch('/api/trips');
    const trips = await res.json();
    const tripList = document.getElementById('tripList');
    tripList.innerHTML = '';
    trips.forEach(trip => {
      const li = document.createElement('li');
      li.textContent = `${trip.title} (${trip.location}) - ${new Date(trip.date).toLocaleDateString()}`;
      li.addEventListener('click', () => fetchWeather(trip.location));
      tripList.appendChild(li);
    });
  }
<!DOCTYPE html>
  fetchTrips();

  // Opprett ny tur
  document.getElementById('tripForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const location = document.getElementById('location').value;
    const date = document.getElementById('date').value;
    const createdBy = userEmail;
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, location, date, createdBy })
      });
      if (res.ok) {
        document.getElementById('tripMessage').textContent = 'Tur opprettet!';
        fetchTrips();
      } else {
        const data = await res.json();
        document.getElementById('tripMessage').textContent = data.error || 'Feil ved oppretting av tur';
      }
    } catch (err) {
      document.getElementById('tripMessage').textContent = 'Serverfeil';
    }
  });

  // Hent vær fra YR.no
  async function fetchWeather(location) {
    document.getElementById('weather').textContent = 'Henter vær...';
    try {
      const res = await fetch(`/api/weather/${encodeURIComponent(location)}`);
      if (res.ok) {
        const data = await res.json();
        // Enkel visning av værdata (tilpass etter YR.no API)
        document.getElementById('weather').textContent = JSON.stringify(data, null, 2);
      } else {
        document.getElementById('weather').textContent = 'Kunne ikke hente vær.';
      }
    } catch (err) {
      document.getElementById('weather').textContent = 'Serverfeil ved henting av vær.';
    }
  }
});
<html lang="no">
<head>
  <meta charset="UTF-8">
  <title>UT.no-klone</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <h1>Velkommen til UT.no-klone</h1>
  <div id="userInfo"></div>
  <h2>Turer</h2>
  <ul id="tripList"></ul>
  <h2>Opprett ny tur</h2>
  <form id="tripForm">
    <label for="title">Tittel:</label>
    <input type="text" id="title" name="title" required>
    <label for="description">Beskrivelse:</label>
    <input type="text" id="description" name="description" required>
    <label for="location">Sted:</label>
    <input type="text" id="location" name="location" required>
    <label for="date">Dato:</label>
    <input type="date" id="date" name="date" required>
    <button type="submit">Opprett tur</button>
  </form>
  <div id="tripMessage"></div>
  <h2>Værmelding</h2>
  <div id="weather"></div>
  <script src="js/index.js"></script>
</body>
</html>

