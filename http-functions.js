// Checks for access_token in url and returns it. If no access_token, returns null.
const getAccessToken = () => {
    let hash = window.location.hash
    if (!hash) {
        return null
    }
    hash = hash.substring(1)

    const params = {}
    hash.split('&').forEach(elem => {
        const pair = elem.split('=')
        params[pair[0]] = pair[1]
    })

    if (params.hasOwnProperty('access_token')) {
        return params['access_token']
    }

    return null
}

const getUserPlaylists = () => {
    const request = new XMLHttpRequest()

    request.open('GET', 'https://api.spotify.com/v1/me/playlists')
    request.setRequestHeader('Accept', 'application/json')
    request.setRequestHeader('Content-Type', 'application/json')
    request.setRequestHeader('Authorization', `Bearer ${access_token}`)

    request.send()
    request.addEventListener('readystatechange', (e) => {
        if (e.target.readyState === 4 && e.target.status === 200) {
            const data = JSON.parse(e.target.responseText)
            // For each playlist in data.items, display the playlist and include a button next to the item.
            // If a playlist is selected, then it will be queried in the YouTube API.
            const playlistsEl = document.getElementById('playlists')
            data.items.forEach((playlist) => {
                const listEl = document.createElement('li')
                listEl.textContent = playlist.name
                const checkBox = document.createElement('input')
                checkBox.setAttribute('type', 'checkbox')
                checkBox.addEventListener('change', (e) => {
                    console.log(playlist)
                })

                playlistsEl.appendChild(listEl)
                playlistsEl.appendChild(checkBox)
            })
        } else if (e.target.status === 400) {
            console.log('An error has taken place')
        }
    })
}