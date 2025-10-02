let map;
let tripMarkers = [];

document.addEventListener('DOMContentLoaded', () => {
  initializeMap();
  updateUserInterface();
  seedDemoTrips();
  initializeAuth(); // Ny auth-funksjonalitet

  // Location filter handler
  document.getElementById('locationSelect').addEventListener('change', (e) => {
    const selectedLocation = e.target.value;
    fetchTrips(selectedLocation);
  });

  // Ny auth-initialisering
  function initializeAuth() {
    const loginToggle = document.getElementById('loginToggle');
    const loginDropdown = document.getElementById('loginDropdown');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Toggle dropdown
    loginToggle.addEventListener('click', () => {
      loginDropdown.classList.toggle('active');
    });

    // Lukk dropdown når man klikker utenfor
    document.addEventListener('click', (e) => {
      if (!loginDropdown.contains(e.target)) {
        loginDropdown.classList.remove('active');
      }
    });

    // Bytt mellom login og registrering
    showRegister.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      clearAuthMessage();
    });

    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';
      clearAuthMessage();
    });

    // Login form submission
    document.getElementById('loginSubmitForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('userEmail', data.email);
          localStorage.setItem('userName', data.name);
          showAuthMessage('Innlogget!', 'success');
          loginDropdown.classList.remove('active');
          clearAuthForms();
          updateUserInterface();
        } else {
          const data = await res.json();
          showAuthMessage(data.error || 'Innlogging feilet', 'error');
        }
      } catch (err) {
        showAuthMessage('Serverfeil ved innlogging', 'error');
      }
    });

    // Register form submission
    document.getElementById('registerSubmitForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('registerEmail').value;
      const name = document.getElementById('registerName').value;
      const password = document.getElementById('registerPassword').value;

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, password })
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('userEmail', data.email);
          localStorage.setItem('userName', data.name);
          showAuthMessage('Registrert og logget inn!', 'success');
          loginDropdown.classList.remove('active');
          clearAuthForms();
          updateUserInterface();
        } else {
          const data = await res.json();
          showAuthMessage(data.error || 'Registrering feilet', 'error');
        }
      } catch (err) {
        showAuthMessage('Serverfeil ved registrering', 'error');
      }
    });

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      updateUserInterface();
    });
  }

  function showAuthMessage(message, type) {
    const authMessage = document.getElementById('authMessage');
    authMessage.textContent = message;
    authMessage.className = type;

    setTimeout(() => {
      clearAuthMessage();
    }, 3000);
  }

  function clearAuthMessage() {
    const authMessage = document.getElementById('authMessage');
    authMessage.textContent = '';
    authMessage.className = '';
  }

  function clearAuthForms() {
    document.getElementById('loginSubmitForm').reset();
    document.getElementById('registerSubmitForm').reset();
  }

  // Oppdatert updateUserInterface for bedre navigasjon
  function updateUserInterface() {
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');

    const loginDropdown = document.getElementById('loginDropdown');
    const userNavInfo = document.getElementById('userNavInfo');
    const nyTurLink = document.getElementById('nyTurLink');
    const nyTurSection = document.getElementById('ny-tur');

    if (userEmail && userName) {
      // User is logged in
      loginDropdown.style.display = 'none';
      userNavInfo.style.display = 'flex';
      document.getElementById('userNameDisplay').textContent = userName;

      if (nyTurLink) nyTurLink.style.display = 'inline';
      // IKKE vis ny-tur seksjonen automatisk - kun når bruker klikker
      if (nyTurSection) nyTurSection.style.display = 'none';

      document.getElementById('userInfo').innerHTML = `<p>Velkommen, ${userName}! Du er logget inn.</p>`;
    } else {
      // User is not logged in
      loginDropdown.style.display = 'inline-block';
      userNavInfo.style.display = 'none';

      if (nyTurLink) nyTurLink.style.display = 'none';
      if (nyTurSection) nyTurSection.style.display = 'none';

      document.getElementById('userInfo').innerHTML = '<p>Velkommen! Logg inn for å opprette egne turer.</p>';
    }
  }

  // Initialize Leaflet map
  function initializeMap() {
    map = L.map('map').setView([60.472, 8.4689], 6); // Norge senter

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add click handler for selecting trip location
    let selectedCoordinates = null;
    let selectedMarker = null;

    map.on('click', function(e) {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) { // Only allow selection if logged in
        selectedCoordinates = [e.latlng.lat, e.latlng.lng];

        // Remove previous selection marker
        if (selectedMarker) {
          map.removeLayer(selectedMarker);
        }

        // Add new selection marker
        selectedMarker = L.marker([e.latlng.lat, e.latlng.lng])
          .addTo(map)
          .bindPopup('Valgt sted for ny tur')
          .openPopup();

        // Store coordinates for form submission
        window.selectedTripCoordinates = selectedCoordinates;

        // Show message
        const nyTurSection = document.getElementById('ny-tur');
        if (nyTurSection && nyTurSection.style.display === 'block') {
          let coordMsg = document.getElementById('coordinateMessage');
          if (!coordMsg) {
            coordMsg = document.createElement('div');
            coordMsg.id = 'coordinateMessage';
            coordMsg.style.cssText = 'background: #e8f5e8; padding: 10px; border-radius: 4px; margin: 10px 0; color: #2e7d32;';
            nyTurSection.insertBefore(coordMsg, document.getElementById('tripForm'));
          }
          coordMsg.innerHTML = `📍 Sted valgt på kart: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
        }
      }
    });

    // Store references for other functions
    window.clearSelectedLocation = function() {
      if (selectedMarker) {
        map.removeLayer(selectedMarker);
        selectedMarker = null;
      }
      selectedCoordinates = null;
      window.selectedTripCoordinates = null;
      const coordMsg = document.getElementById('coordinateMessage');
      if (coordMsg) coordMsg.remove();
    };
  }

  // Add demo trips to database - Load from JSON file
  async function seedDemoTrips() {
    console.log('Starting to seed demo trips from JSON file...');

    // ALWAYS clear all existing trips first - force reset with verification
    try {
      console.log('Force clearing ALL existing trips...');

      const existingResponse = await fetch('/api/trips');
      if (existingResponse.ok) {
        const existingTrips = await existingResponse.json();
        console.log('Found', existingTrips.length, 'existing trips - will clear all');

        if (existingTrips.length > 0) {
          console.log('Clearing all trips to start fresh...');

          // Try the clear endpoint first
          let clearSuccess = false;
          try {
            const clearResponse = await fetch('/api/trips/clear', { method: 'DELETE' });
            if (clearResponse.ok) {
              console.log('Database cleared successfully via clear endpoint');
              clearSuccess = true;
            } else {
              throw new Error('Clear endpoint failed');
            }
          } catch (clearError) {
            console.log('Clear endpoint not available, clearing trips manually...');

            // If clear endpoint doesn't work, delete trips individually
            let deleteCount = 0;
            for (const trip of existingTrips) {
              try {
                const deleteResponse = await fetch(`/api/trips/${trip._id}`, { method: 'DELETE' });
                if (deleteResponse.ok) {
                  deleteCount++;
                  if (deleteCount % 50 === 0) {
                    console.log(`Deleted ${deleteCount}/${existingTrips.length} trips...`);
                  }
                }
              } catch (deleteError) {
                console.warn('Failed to delete trip:', trip.title);
              }
            }
            console.log(`Manual clearing completed - deleted ${deleteCount} trips`);
            clearSuccess = deleteCount > 0;
          }

          // Wait longer to ensure clearing is complete
          await new Promise(resolve => setTimeout(resolve, 3000));

          // Verify clearing worked - CRUCIAL STEP
          const verifyResponse = await fetch('/api/trips');
          if (verifyResponse.ok) {
            const remainingTrips = await verifyResponse.json();
            console.log('After clearing, remaining trips:', remainingTrips.length);

            // If trips still exist, DO NOT proceed with adding new ones
            if (remainingTrips.length > 0) {
              console.error('FAILED TO CLEAR ALL TRIPS! Still have', remainingTrips.length, 'trips. Aborting seeding to prevent more duplicates.');
              return; // EXIT - don't add any new trips
            }
          }
        }
      }
    } catch (err) {
      console.error('Error during clearing process:', err);
      return; // EXIT - don't add new trips if clearing failed
    }

    // Only proceed if we successfully cleared all trips
    console.log('All trips successfully cleared. Now loading demo trips from JSON...');

    // Load demo trips from JSON file
    let demoTrips = [];
    try {
      const response = await fetch('/data/demo-trips.json');
      if (!response.ok) {
        throw new Error(`Failed to load demo trips: ${response.status}`);
      }
      const data = await response.json();
      demoTrips = data.trips;
      console.log(`Loaded ${demoTrips.length} demo trips from JSON file`);
    } catch (err) {
      console.error('Could not load demo trips from JSON file:', err);
      return; // EXIT if we can't load the data
    }

    // Add all demo trips from JSON
    try {
      console.log(`Adding ${demoTrips.length} demo trips from JSON...`);

      for (const trip of demoTrips) {
        const response = await fetch('/api/trips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trip)
        });

        if (!response.ok) {
          console.error('Failed to add trip:', trip.title);
        }
      }
      console.log(`${demoTrips.length} demo trips added successfully`);

      // Wait a bit before fetching to ensure all trips are saved
      setTimeout(() => {
        console.log(`Now fetching all ${demoTrips.length} trips...`);
        fetchTrips(); // Last inn alle turer
      }, 1500);

    } catch (err) {
      console.error('Could not add demo trips:', err);
      fetchTrips();
    }
  }

  // Fetch and display trips
  async function fetchTrips(location = '') {
    console.log('Fetching trips for location:', location);

    try {
      let url = '/api/trips';
      if (location) {
        url += `?location=${encodeURIComponent(location)}`;
      }

      console.log('Fetching from URL:', url);
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const trips = await res.json();
      console.log('Fetched trips:', trips.length, 'trips');

      displayTrips(trips);
      updateMapMarkers(trips);

      // Automatisk hent værmelding for alle tursteder
      fetchWeatherForAllTrips(trips);
    } catch (err) {
      console.error('Error fetching trips:', err);
      const tripList = document.getElementById('tripList');
      if (tripList) {
        tripList.innerHTML = `<li style="color: red;">Feil ved henting av turer: ${err.message}</li>`;
      }
    }
  }

  // Display trips in list
  function displayTrips(trips) {
    const tripList = document.getElementById('tripList');
    tripList.innerHTML = '';

    if (trips.length === 0) {
      tripList.innerHTML = '<li>Ingen turer funnet for valgt område.</li>';
      return;
    }

    trips.forEach(trip => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="trip-title">${trip.title}</div>
        <div class="trip-location">📍 ${trip.location}</div>
        <div class="trip-date">📅 ${new Date(trip.date).toLocaleDateString('no-NO')}</div>
        <div class="trip-description">${trip.description}</div>
      `;
      li.addEventListener('click', () => {
        // fetchWeather(trip.location);
        if (trip.coordinates) {
          map.setView(trip.coordinates, 10);
        }
      });
      tripList.appendChild(li);
    });
  }

  // Update markers on map
  function updateMapMarkers(trips) {
    // Fjern eksisterende markører
    tripMarkers.forEach(marker => map.removeLayer(marker));
    tripMarkers = [];

    // Legg til nye markører
    trips.forEach(trip => {
      // Check if coordinates exist and are valid before creating marker
      if (trip.coordinates && Array.isArray(trip.coordinates) &&
          trip.coordinates.length === 2 &&
          typeof trip.coordinates[0] === 'number' &&
          typeof trip.coordinates[1] === 'number') {

        const marker = L.marker(trip.coordinates)
          .addTo(map)
          .bindPopup(`
            <strong>${trip.title}</strong><br>
            📍 ${trip.location}<br>
            📅 ${new Date(trip.date).toLocaleDateString('no-NO')}<br>
            <em>${trip.description.substring(0, 100)}...</em>
          `);

        marker.on('click', () => {
          // fetchWeather(trip.location);
        });

        tripMarkers.push(marker);
      } else {
        console.warn('Skipping trip with invalid coordinates:', trip.title, trip.coordinates);
      }
    });
  }

  // Create trip form handler
  const tripForm = document.getElementById('tripForm');
  if (tripForm) {
    tripForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const userEmail = localStorage.getItem('userEmail');

      if (!userEmail) {
        document.getElementById('tripMessage').textContent = 'Du må være logget inn for å opprette turer';
        return;
      }

      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const location = document.getElementById('location').value;
      const date = document.getElementById('date').value;

      // Get coordinates from map selection
      const coordinates = window.selectedTripCoordinates;

      if (!coordinates) {
        document.getElementById('tripMessage').innerHTML = '<span style="color: #c62828;">Klikk på kartet for å velge hvor turen skal gå!</span>';
        return;
      }

      try {
        const res = await fetch('/api/trips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, location, date, createdBy: userEmail, coordinates })
        });

        if (res.ok) {
          document.getElementById('tripMessage').innerHTML = '<span style="color: #2e7d32;">Tur opprettet! Vises nå på kartet og i turlisten.</span>';
          tripForm.reset();

          // Clear selected location
          if (window.clearSelectedLocation) {
            window.clearSelectedLocation();
          }

          // Refresh trips and automatically switch to turer section
          fetchTrips();

          // Automatically switch to trip list after 2 seconds
          setTimeout(() => {
            window.showSection('turer');
          }, 2000);

        } else {
          const data = await res.json();
          document.getElementById('tripMessage').innerHTML = `<span style="color: #c62828;">${data.error || 'Feil ved oppretting av tur'}</span>`;
        }
      } catch (err) {
        document.getElementById('tripMessage').innerHTML = '<span style="color: #c62828;">Serverfeil ved oppretting av tur</span>';
      }
    });
  }

  // Fetch and display weather for all trips
  async function fetchWeatherForAllTrips(trips) {
    const weatherContainer = document.getElementById('weatherDisplay');
    weatherContainer.innerHTML = '<h3>Værmelding for tursteder</h3><div class="weather-loading">Henter værmelding...</div>';

    // Få unike lokasjoner
    const uniqueLocations = [...new Set(trips.map(trip => trip.location))];

    let weatherHtml = '<h3>Værmelding for tursteder</h3><div class="weather-grid">';

    for (const location of uniqueLocations) {
      try {
        const res = await fetch(`/api/weather/${encodeURIComponent(location)}`);

        if (res.ok) {
          const data = await res.json();
          const forecast = data.forecast;
          const currentWeather = forecast.properties.timeseries[0];
          const todayWeather = forecast.properties.timeseries.slice(0, 8); // 8 første timer

          const temp = currentWeather.data.instant.details.air_temperature;
          const symbol = currentWeather.data.next_1_hours?.summary?.symbol_code || 'clearsky_day';
          const humidity = currentWeather.data.instant.details.relative_humidity;
          const windSpeed = currentWeather.data.instant.details.wind_speed;

          weatherHtml += `
            <div class="location-weather-card">
              <div class="weather-header">
                <h4>📍 ${location}</h4>
                <div class="current-temp">${temp}°C</div>
              </div>
              <div class="weather-details">
                <div class="weather-icon">🌤️</div>
                <div class="weather-info">
                  <div>💧 Luftfuktighet: ${humidity}%</div>
                  <div>💨 Vind: ${windSpeed} m/s</div>
                </div>
              </div>
              <div class="hourly-forecast">
                <h5>I dag (timer):</h5>
                <div class="hourly-items">
          `;

          // Legg til timesvis værmelding for i dag
          todayWeather.slice(0, 6).forEach(period => {
            const time = new Date(period.time);
            const hourTemp = period.data.instant.details.air_temperature;

            weatherHtml += `
              <div class="hourly-item">
                <div class="hour">${time.getHours()}:00</div>
                <div class="hour-temp">${hourTemp}°C</div>
              </div>
            `;
          });

          weatherHtml += `
                </div>
              </div>
            </div>
          `;
        } else {
          weatherHtml += `
            <div class="location-weather-card error">
              <h4>📍 ${location}</h4>
              <p>Kunne ikke hente værmelding</p>
            </div>
          `;
        }
      } catch (err) {
        weatherHtml += `
          <div class="location-weather-card error">
            <h4>📍 ${location}</h4>
            <p>Feil ved henting av vær</p>
          </div>
        `;
      }
    }

    weatherHtml += '</div>';
    weatherContainer.innerHTML = weatherHtml;
  }

  // Section navigation function
  window.showSection = function(sectionId) {
    // Hide all sections first
    const sections = ['turer', 'ny-tur'];
    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        section.style.display = 'none';
      }
    });

    // Show the requested section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.style.display = 'block';
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Clear any selected coordinates when switching sections
    if (sectionId !== 'ny-tur' && window.clearSelectedLocation) {
      window.clearSelectedLocation();
    }
  };

  // Show turer section by default
  window.showSection('turer');

  // Weather fetching - simplified version (no detailed weather popup)
  async function fetchWeather(location) {
    // Bare zoom til lokasjon på kartet, ingen detaljert værmelding
    console.log(`Showing weather for ${location} in bottom section`);
  }
});
