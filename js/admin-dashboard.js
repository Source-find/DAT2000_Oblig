// Admin Dashboard JavaScript
(function(){
  // Simple protection: check localStorage flag set by login page.
  if(localStorage.getItem('adminLoggedIn') !== '1'){
    // not logged in -> redirect to login
    window.location.href = 'Admin.html';
    return;
  }

  // Load admin statistics
  function loadStats() {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    document.getElementById('userCount').textContent = users.length;
    document.getElementById('lastLogin').textContent = new Date().toLocaleDateString('nb-NO');
  }

  // Admin functions
  window.viewUsers = function() {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (users.length === 0) {
      alert('Ingen registrerte brukere funnet.');
      return;
    }

    let userList = 'Registrerte brukere:\n\n';
    users.forEach((user, index) => {
      userList += `${index + 1}. ${user.fornavn} ${user.etternavn}\n`;
      userList += `   Brukernavn: ${user.brukernavn}\n`;
      userList += `   E-post: ${user.email}\n`;
      userList += `   Registrert: ${new Date(user.registrertDato).toLocaleDateString('nb-NO')}\n\n`;
    });

    alert(userList);
  };

  window.manageContent = function() {
    alert('Innholdsadministrasjon kommer snart!');
  };

  window.viewReports = function() {
    alert('Rapporter kommer snart!');
  };

  // Logout handler
  document.getElementById('logout').addEventListener('click', function(){
    if (confirm('Er du sikker på at du vil logge ut?')) {
      localStorage.removeItem('adminLoggedIn');
      window.location.href = 'Admin.html';
    }
  });

  // Initialize
  loadStats();
})();