(async function () {
    const catalogElement = document.querySelector('.catalog')

    try {
        // Hent turer fra API
        const response = await fetch('/api/turer')
        const turer = await response.json()

        // Tøm eksisterende innhold
        catalogElement.innerHTML = ''

        // Hvis ingen turer finnes, vil det vises 'Ingen turer funnet' på nettsiden
        if (turer.length === 0) {
            catalogElement.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Ingen turer funnet</p>'
            return
        }

        // Generer kort for hver tur
        turer.forEach(tur => {
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
    } catch (error) {
        console.error('Feil ved lasting av turer:', error)
        catalogElement.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Kunne ikke laste turer</p>'
    }
})()