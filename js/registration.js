// Registrering JavaScript
(function(){
  const form = document.getElementById('registrationForm');
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

  function validateForm(formData) {
    // Sjekk at alle obligatoriske felt er fylt ut
    if (!formData.fornavn.trim()) return 'Fornavn er påkrevd';
    if (!formData.etternavn.trim()) return 'Etternavn er påkrevd';
    if (!formData.email.trim()) return 'E-post er påkrevd';
    if (!formData.brukernavn.trim()) return 'Brukernavn er påkrevd';
    if (!formData.passord) return 'Passord er påkrevd';
    if (!formData.passordBekreft) return 'Bekreft passord er påkrevd';

    // Valider e-post format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Ugyldig e-postadresse';

    // Valider passord lengde
    if (formData.passord.length < 6) return 'Passord må være minst 6 tegn';

    // Sjekk at passord matcher
    if (formData.passord !== formData.passordBekreft) return 'Passordene matcher ikke';

    // Sjekk brukernavn lengde
    if (formData.brukernavn.length < 3) return 'Brukernavn må være minst 3 tegn';

    return null; // Ingen feil
  }

  function userExists(brukernavn, email) {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    return users.some(user =>
      user.brukernavn.toLowerCase() === brukernavn.toLowerCase() ||
      user.email.toLowerCase() === email.toLowerCase()
    );
  }

  function saveUser(userData) {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    // Legg til bruker med timestamp
    const newUser = {
      ...userData,
      id: Date.now(),
      registrertDato: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    return newUser;
  }

  // Form submit handler
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    clearMessage();

    // Hent form data
    const formData = {
      fornavn: document.getElementById('fornavn').value,
      etternavn: document.getElementById('etternavn').value,
      email: document.getElementById('email').value,
      telefon: document.getElementById('telefon').value,
      brukernavn: document.getElementById('brukernavn').value,
      passord: document.getElementById('passord').value,
      passordBekreft: document.getElementById('passordBekreft').value
    };

    // Valider form
    const validationError = validateForm(formData);
    if (validationError) {
      showMessage(validationError);
      return;
    }

    // Sjekk om bruker allerede eksisterer
    if (userExists(formData.brukernavn, formData.email)) {
      showMessage('Brukernavn eller e-post er allerede i bruk');
      return;
    }

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Oppretter bruker...';

    // Simulate network delay
    setTimeout(() => {
      try {
        // Lagre bruker (uten passordbekreftelse)
        const { passordBekreft, ...userToSave } = formData;
        const savedUser = saveUser(userToSave);

        // Vis suksessmelding
        showMessage(`Bruker "${savedUser.brukernavn}" er opprettet! Du kan nå logge inn.`, false);

        // Reset form
        form.reset();

        // Redirect til login etter 2 sekunder
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);

      } catch (error) {
        showMessage('Det oppstod en feil ved opprettelse av bruker. Prøv igjen.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Opprett bruker';
      }
    }, 1000);
  });

  // Real-time validation feedback
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.hasAttribute('required') && !this.value.trim()) {
        this.style.borderColor = '#b40000';
      } else {
        this.style.borderColor = '#dcdfe6';
      }
    });

    input.addEventListener('input', function() {
      this.style.borderColor = '#dcdfe6';
      clearMessage();
    });
  });

  // Passord matching check
  document.getElementById('passordBekreft').addEventListener('input', function() {
    const passord = document.getElementById('passord').value;
    const passordBekreft = this.value;

    if (passordBekreft && passord !== passordBekreft) {
      this.style.borderColor = '#b40000';
    } else {
      this.style.borderColor = '#dcdfe6';
    }
  });

})();