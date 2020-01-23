const SPOTIFY_LOGIN_URL = 'https://accounts.spotify.com/authorize'
const SPOTIFY_CLIENT_ID = '15eec43e1d384f5eaf6a811a8d0c3e06'
// const REDIRECT_URI = 'http://localhost:56257'
const REDIRECT_URI = 'https://spotifytoyoutube.com'
// const redirect_uri = 'https://alexsyeo.github.io/spotifyToYouTube'
const RESPONSE_TYPE = 'token'
const SPOTIFY_SCOPE = 'playlist-read-private'

// Checks for access_token in url and returns it. If no access_token, returns null.
function getAccessToken() {
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

// TODO: allow for more than 50 playlists by calling this function multiple times and appending the results together
// Gets up to 50 of the user's playlists and returns as a promise
async function getSpotifyPlaylists() {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        }
    })

    if (response.status === 200) {
        const data = await response.json()
        return data.items
    } else {
        throw new Error('An error has taken place.')
    }
}

// Takes in a Spotify playlist's id and returns an array of playlist track objects (or error)
async function getSpotifyPlaylistTracks(playlist_id) {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    })

    if (response.status === 200) {
        const data = await response.json()
        return data
    } else {
        throw new Error('An error has taken place.')
    }
}

async function getYouTubeVideo(artist, trackName) {
    const response = await gapi.client.youtube.search.list({
        'part': 'snippet',
        'maxResults': 1,
        'q': artist + ' ' + trackName,
        'type': 'video'
    })
    if (response.status === 200) {
        return response.items
    } else {
        throw new Error('Unable to fetch YouTube video')
    }
}

async function insertVideoIntoPlaylist(playlistId, resourceId) {
    const response = await gapi.client.youtube.playlistItems.insert({
        'part': 'snippet',
        'resource': {
            'snippet': {
                'playlistId': playlistId,
                'resourceId': resourceId
            }
        }
    })

    if (response.status === 200) {
        return response
    } else {
        throw new Error('Unable to insert video into playlist')
    }
}

async function getYouTubePlaylists() {
    const response = await gapi.client.youtube.playlists.list({
        "part": "snippet",
        "mine": true
    })
    if (response.status === 200) {
        return response
    } else {
        throw new Error('Unable to fetch YouTube playlists')
    }
}

// TODO: add description from spotify playlist to youtube playlist
async function createNewPlaylist(playlist) {
    const response = await gapi.client.youtube.playlists.insert({
        "part": "snippet,status",
        "resource": {
            "snippet": {
                "title": playlist.name,
                "description": playlist.description
            },
            "status": {
                "privacyStatus": playlist.public ? "public" : "private"
            }
        }
    })
    if (response.status === 200) {
        return response
    } else {
        throw new Error('Unable to create new playlist')
    }
}

function redirectToSpotifyLogin() {
    location.assign(`${SPOTIFY_LOGIN_URL}?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SPOTIFY_SCOPE}`)
}
