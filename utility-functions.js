const noPlaylistsToProcess = () => !Object.keys(playlistsToProcess).length

const renderSpotifyPlaylists = (playlists) => {
    const playlistsEl = document.getElementById('playlists')
    playlists.forEach((playlist) => {
        const listEl = document.createElement('li')
        listEl.textContent = playlist.name
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

        playlistsEl.appendChild(listEl)
        playlistsEl.appendChild(checkBox)
    })
}