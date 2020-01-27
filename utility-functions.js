const noPlaylistsToProcess = () => !Object.keys(playlistsToProcess).length

const renderSpotifyPlaylists = (playlists) => {
    const playlistsEl = document.getElementById('playlists')
    playlists.forEach((playlist) => {
        const listEl = document.createElement('li')
        const checkBox = document.createElement('input')
        checkBox.setAttribute('type', 'checkbox')
        checkBox.addEventListener('change', (e) => {
            if (e.target.checked) {
                if (!playlistsToProcess.hasOwnProperty(playlist.name)) {
                    playlistsToProcess[playlist.id] = playlist
                }
            } else {
                delete playlistsToProcess[playlist.id]
            }
        })

        const labelEl = document.createElement('label')
        labelEl.appendChild(checkBox)
        labelEl.textContent = playlist.name

        listEl.appendChild(labelEl)
        playlistsEl.appendChild(listEl)
    })
}

const formatTrackArtists = (artists) => artists.length > 1 ? artists[0].name + ' ' + artists[1].name : artists[0].name