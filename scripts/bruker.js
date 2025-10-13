(function () {
    // Hent elementer
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');

    // Toggle til registrering
    showRegisterLink.addEventListener('click', function (e) {
        e.preventDefault();
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
        loginError.textContent = '';
    });

    // Toggle til innlogging
    showLoginLink.addEventListener('click', function (e) {
        e.preventDefault();
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
        registerError.textContent = '';
    });

// Håndter innlogging
loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    loginError.textContent = '';

    const epost = document.getElementById('loginEpost').value.trim();

    // Validering
    if (!epost) {
        loginError.textContent = 'Vennligst fyll inn e-post';
        return;
    }

    try {
        // Send API-kall til backend
        const response = await fetch('/api/brukere/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ epost: epost })
        });

        const data = await response.json();

        // Hvis innlogging mislyktes
        if (!response.ok) {
            loginError.textContent = data.message || 'Innlogging feilet';
            return;
        }

        // Innlogging vellykket!
        // Lagre brukerinfo i localStorage
        localStorage.setItem('bruker', JSON.stringify(data.bruker));

        // Vis suksessmelding kort
        loginError.textContent = 'Logger inn...';
        loginError.style.color = 'green';

        // Redirect til riktig side (backend bestemmer!)
        setTimeout(() => {
            window.location.href = data.redirectUrl;
        }, 500);

    } catch (error) {
        console.error('Feil ved innlogging:', error);
        loginError.textContent = 'Noe gikk galt. Prøv igjen.';
    }
});

    // Håndter registrering
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        registerError.textContent = '';

        const navn = document.getElementById('registerNavn').value.trim();
        const epost = document.getElementById('registerEpost').value.trim();
        // Rolle settes automatisk til "deltaker"
        const rolle = 'deltaker';

        // Validering
        if (!navn || !epost) {
            registerError.textContent = 'Vennligst fyll inn alle felt';
            return;
        }

        // TODO: Her skal vi senere gjøre API-kall til backend
        console.log('Registrering:', { navn, epost, rolle });
        registerError.textContent = 'Registrering fungerer! Rolle: deltaker (API kommer senere)';
        registerError.style.color = 'green';
    });
})();
