// Admin Login JavaScript
(function(){
  const VALID_USER = 'admin';
  const VALID_PASS = 'admin123';
  const form = document.getElementById('loginForm');
  const errEl = document.getElementById('error');
  const submitBtn = document.getElementById('submitBtn');

  // Hjelpefunksjoner
  function showMessage(text) {
    errEl.textContent = text;
  }

  function clearMessage() {
    errEl.textContent = '';
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    clearMessage();

    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;

    if(!user || !pass){
      showMessage('Vennligst fyll inn både brukernavn og passord.');
      return;
    }

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logger inn...';

    // Simulate network delay for better UX
    setTimeout(function(){
      if(user === VALID_USER && pass === VALID_PASS){
        // Mark as logged in and redirect
        localStorage.setItem('adminLoggedIn', '1');
        showMessage('Innlogging vellykket! Omdirigerer...');
        errEl.className = 'success';

        setTimeout(function(){
          window.location.href = 'Admin-dashboard.html';
        }, 1500);
      } else {
        showMessage('Ugyldig brukernavn eller passord.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Logg inn';
      }
    }, 800);
  });

  // Real-time validation feedback
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      clearMessage();
      this.style.borderColor = '#dcdfe6';
    });
  });

  // Check if already logged in
  if (localStorage.getItem('adminLoggedIn') === '1') {
    showMessage('Du er allerede logget inn som admin');
    errEl.className = 'success';
    setTimeout(() => {
      window.location.href = 'Admin-dashboard.html';
    }, 2000);
  }

  // Auto-focus on username field
  document.getElementById('username').focus();
})();