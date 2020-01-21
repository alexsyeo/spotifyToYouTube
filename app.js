const client_id = '15eec43e1d384f5eaf6a811a8d0c3e06'
const loginMessage = document.getElementById('login-message')

document.getElementById('spotify-login').addEventListener('click', (e) => {
    const spotify_auth_url = 'https://accounts.spotify.com/authorize'
    // const redirect_uri = 'http://localhost:58249'
    const redirect_uri = 'https://alexsyeo.github.io/spotifyToYouTube'
    const response_type = 'token'
    const scope = 'playlist-read-private'
    location.assign(`${spotify_auth_url}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`)
})

const access_token = getAccessToken()
if (!access_token) {
    loginMessage.textContent = 'Please log in to Spotify by pressing button below.'
} else {
    loginMessage.textContent = 'Currently logged in to Spotify.'
}

getUserPlaylists()