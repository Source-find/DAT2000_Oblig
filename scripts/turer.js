(async function () {
    const catalogElement = document.querySelector('.catalog')
    const searchInput = document.getElementById('search-input')
    let allTurer = [] // Lagre alle turer for søkefunksjonalitet

    // Funksjon for å vise turer
    function displayTurer(turerToDisplay) {
        // Tøm eksisterende innhold
        catalogElement.innerHTML = ''

        // Hvis ingen turer finnes, vil det vises 'Ingen turer funnet' på nettsiden
        if (turerToDisplay.length === 0) {
            catalogElement.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Ingen turer funnet</p>'
            return
        }

        // Generer kort for hver tur
        turerToDisplay.forEach(tur => {
            const card = document.createElement('div')
            card.className = 'card'

            // Formater datoer
            const datoerFormatert = tur.datoer
                .map(dato => new Date(dato).toLocaleDateString('no-NO'))
                .join(', ')

            // Norske oversettelser
            const typeNorsk = tur.type === 'fjelltur' ? 'Fjelltur' : 'Skogstur'
            const lengdeNorsk = {
                'kort': 'Kort',
                'middels': 'Middels',
                'lang': 'Lang'
            }[tur.turLengde]
            const vanskelighetNorsk = {
                'lett': 'Lett',
                'middels': 'Middels',
                'vanskelig': 'Vanskelig'
            }[tur.vanskelighetsgrad]

            card.innerHTML = `
                <h2>${tur.navn}</h2>
                <p><strong>Destinasjon:</strong> ${tur.destinasjon}</p>
                <p><strong>Type:</strong> ${typeNorsk}</p>
                <p><strong>Lengde:</strong> ${lengdeNorsk}</p>
                <p><strong>Vanskelighetsgrad:</strong> ${vanskelighetNorsk}</p>
                <p><strong>Datoer:</strong> ${datoerFormatert}</p>
                ${tur.lederId ? `<p><strong>Turleder:</strong> ${tur.lederId.navn}</p>` : ''}
                ${tur.deltakerIds && tur.deltakerIds.length > 0 ? `<p><strong>Antall deltakere:</strong> ${tur.deltakerIds.length}</p>` : ''}
            `

            catalogElement.appendChild(card)
        })
    }

    // Søkefunksjon
    function searchTurer(searchTerm) {
        const term = searchTerm.toLowerCase().trim()

        if (term === '') {
            displayTurer(allTurer)
            return
        }

        const filteredTurer = allTurer.filter(tur => {
            // Søk i navn, destinasjon, type, lengde og vanskelighetsgrad
            const typeNorsk = tur.type === 'fjelltur' ? 'fjelltur' : 'skogstur'
            const lengdeNorsk = {
                'kort': 'kort',
                'middels': 'middels',
                'lang': 'lang'
            }[tur.turLengde]
            const vanskelighetNorsk = {
                'lett': 'lett',
                'middels': 'middels',
                'vanskelig': 'vanskelig'
            }[tur.vanskelighetsgrad]
            const lederNavn = tur.lederId ? tur.lederId.navn.toLowerCase() : ''

            return tur.navn.toLowerCase().includes(term) ||
                   tur.destinasjon.toLowerCase().includes(term) ||
                   typeNorsk.includes(term) ||
                   lengdeNorsk.includes(term) ||
                   vanskelighetNorsk.includes(term) ||
                   lederNavn.includes(term)
        })

        displayTurer(filteredTurer)
    }

    // Legg til event listener for søkeinput
    searchInput.addEventListener('input', (e) => {
        searchTurer(e.target.value)
    })

    try {
        // Hent turer fra API
        const response = await fetch('/api/turer')
        const turer = await response.json()

        allTurer = turer
        displayTurer(allTurer)
    } catch (error) {
        console.error('Feil ved lasting av turer:', error)
        catalogElement.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Kunne ikke laste turer</p>'
    }
})()