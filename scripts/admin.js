(function () {
    const VALID_USER = 'admin';
    const VALID_PASS = 'admin123';
    const form = document.getElementById('loginForm');
    const errEl = document.getElementById('error');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        errEl.textContent = '';
        const user = document.getElementById('username').value.trim();
        const pass = document.getElementById('password').value;

        if (!user || !pass) {
            errEl.textContent = 'Vennligst fyll inn både brukernavn og passord.';
            return;
        }

        if (user === VALID_USER && pass === VALID_PASS) {
            // mark as logged in and redirect
            localStorage.setItem('adminLoggedIn', '1');
            // small timeout so user sees the click
            setTimeout(function () {
                window.location.href = 'dashboard.html';
            }, 150);
        } else {
            errEl.textContent = 'Ugyldig brukernavn eller passord.';
        }
    });
})();