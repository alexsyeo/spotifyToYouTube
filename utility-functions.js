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

const formatTrackArtists = (artists) => artists.length > 1 ? artists[0].name + ' ' + artists[1].name : artists[0].name

const convertButtonHandler = () => {
    if (noPlaylistsToProcess()) {
        alert('No playlists have been selected!')
    } else {
        displayMessage.textContent = 'Processing...'
        for (let playlistId of Object.keys(playlistsToProcess)) {
            createNewPlaylist(playlistsToProcess[playlistId]).then((response) => {
                const newPlaylistId = response.result.id
                getSpotifyPlaylistTracks(playlistId).then((playlist_track_objs) => {
                    return insertVideosIntoPlaylist(newPlaylistId, playlist_track_objs)
                }).then(() => {
                    displayMessage.textContent = 'Success!'
                })
            }).catch((err) => {
                alert(`Error: ${err}`)
            })
        }
    }
}