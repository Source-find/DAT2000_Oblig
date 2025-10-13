(function () {
    // Simple protection: check localStorage flag set by login page.
    if (localStorage.getItem('adminLoggedIn') !== '1') {
        // not logged in -> redirect to login
        window.location.href = 'admin.html';
    }

    document.getElementById('logout').addEventListener('click', function () {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'Admin.html';
    });

    document.getElementById('turSkjema').addEventListener('submit', async function (event) {
        event.preventDefault(); // forhindre sending av tomt skjema

        // hente ut data fra tur-skjema
        const turData = {
        navn: document.getElementById('turNavn').value,
        datoer: [document.getElementById('turDato').value], // tabell med en dato
        destinasjon: document.getElementById('turDestinasjon').value,
        type: document.getElementById('turType').value,
        turLengde: document.getElementById('turLengde').value,
        vanskelighetsgrad: document.getElementById('turVanskelighetsgrad').value,
        lederId: document.getElementById('turLederId').value
    };
        // sende data til backend
    try {
        const response = await fetch('/api/turer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(turData)
        });
        
        if (response.ok) {
            alert('Tur opprettet!');
            document.getElementById('turSkjema').reset();
        } else {
            alert('Feil ved opprettelse');
        }
    } catch (error) {
        alert('Nettverksfeil');
    }
});  


})();


