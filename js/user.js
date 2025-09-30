// Bruker JavaScript
(function(){
  // Sjekk om bruker er logget inn
  if(localStorage.getItem('userLoggedIn') !== '1'){
    // Not logged in -> redirect to login
    window.location.href = 'login.html';
    return;
  }

  // Hent brukerinfo
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  if (!currentUser.brukernavn) {
    // Manglende brukerdata -> redirect to login
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
    return;
  }

  // Oppdater velkomstmelding
  const welcomeEl = document.getElementById('welcomeMessage');
  welcomeEl.textContent = `Velkommen, ${currentUser.fornavn || currentUser.brukernavn}!`;

  // Vis brukerinfo
  const profileDetailsEl = document.getElementById('profileDetails');
  profileDetailsEl.innerHTML = `
    <p><strong>Navn:</strong> ${currentUser.fornavn} ${currentUser.etternavn}</p>
    <p><strong>Brukernavn:</strong> ${currentUser.brukernavn}</p>
    <p><strong>E-post:</strong> ${currentUser.email}</p>
    <p><strong>Logget inn:</strong> ${new Date(currentUser.loginTime).toLocaleString('nb-NO')}</p>
  `;

  // Logout handler
  document.getElementById('logout').addEventListener('click', function(){
    if (confirm('Er du sikker på at du vil logge ut?')) {
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('currentUser');
      window.location.href = 'login.html';
    }
  });
})();