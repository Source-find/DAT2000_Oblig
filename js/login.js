// Login JavaScript
(function(){
  const form = document.getElementById('loginForm');
  const messageEl = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');

  // Hjelpefunksjoner
  function showMessage(text, isError = true) {
    messageEl.textContent = text;
    messageEl.className = isError ? 'error' : 'success';
  }

  function clearMessage() {
    messageEl.textContent = '';
  }

  function findUser(usernameOrEmail, password) {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    return users.find(user => {
      const matchesUsername = user.brukernavn.toLowerCase() === usernameOrEmail.toLowerCase();
      const matchesEmail = user.email.toLowerCase() === usernameOrEmail.toLowerCase();
      const matchesPassword = user.passord === password;

      return (matchesUsername || matchesEmail) && matchesPassword;
    });
  }

  function loginUser(user) {
    // Lagre brukerinfo i localStorage for sesjonshåndtering
    const userSession = {
      id: user.id,
      brukernavn: user.brukernavn,
      fornavn: user.fornavn,
      etternavn: user.etternavn,
      email: user.email,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem('currentUser', JSON.stringify(userSession));
    localStorage.setItem('userLoggedIn', '1');
  }

  // Form submit handler
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    clearMessage();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Valider input
    if (!username) {
      showMessage('Brukernavn eller e-post er påkrevd');
      return;
    }

    if (!password) {
      showMessage('Passord er påkrevd');
      return;
    }

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logger inn...';

    // Simulate network delay
    setTimeout(() => {
      try {
        const user = findUser(username, password);

        if (user) {
          // Successful login
          loginUser(user);
          showMessage('Innlogging vellykket! Omdirigerer...', false);

          // Redirect to user page after short delay
          setTimeout(() => {
            window.location.href = 'Bruker.html';
          }, 1500);
        } else {
          showMessage('Ugyldig brukernavn/e-post eller passord');
        }
      } catch (error) {
        showMessage('Det oppstod en feil ved innlogging. Prøv igjen.');
      } finally {
        if (!messageEl.classList.contains('success')) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Logg inn';
        }
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
  if (localStorage.getItem('userLoggedIn') === '1') {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.brukernavn) {
      showMessage(`Du er allerede logget inn som ${currentUser.brukernavn}`, false);
      setTimeout(() => {
        window.location.href = 'Bruker.html';
      }, 2000);
    }
  }

  // Auto-focus on username field
  document.getElementById('username').focus();

})();