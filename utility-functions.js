const noPlaylistsToProcess = () => !Object.keys(playlistsToProcess).length

const renderSpotifyPlaylists = (playlists) => {
    const playlistsEl = document.getElementById('playlists')
    playlists.forEach((playlist) => {
        const listEl = document.createElement('li')
        // listEl.textContent = playlist.name
        const checkBox = document.createElement('input')
        
        checkBox.setAttribute('type', 'checkbox')
        checkBox.setAttribute('id', playlist.name)
        checkBox.addEventListener('change', (e) => {
            if (e.target.checked) {
                if (!playlistsToProcess.hasOwnProperty(playlist.name)) {
                    playlistsToProcess[playlist.id] = playlist
                }
            } else {
                delete playlistsToProcess[playlist.id]
            }
        })

        const label = document.createElement('label')
        label.textContent = playlist.name
        label.setAttribute('for', playlist.name)

        playlistsEl.appendChild(listEl)
        listEl.appendChild(checkBox)
        listEl.appendChild(label)
    })
}

const formatTrackArtists = (artists) => artists.length > 1 ? artists[0].name + ' ' + artists[1].name : artists[0].name