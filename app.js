const CLIENT_ID = '5276504902-vqgh3qs5ns4hadnjc691go947qbbcqkf.apps.googleusercontent.com'
const API_KEY = 'AIzaSyDVCNrT1b4C1QlmG598XEop-tHbTyMen9c'
const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl'
const displayMessage = document.getElementById('display-message')
const convertButton = document.getElementById('convert-button')
const spotifyLogin = document.getElementById('spotify-login')
const youtubeLogin = document.getElementById('youtube-login')
const playlistsMessage = document.getElementById('playlists-message')
const playlistsToProcess = {}
let access_token
let GoogleAuth

function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient)
}

function initClient() {
    // Retrieve the discovery document for version 3 of YouTube Data API.
    // In practice, your app can retrieve one or more discovery documents.
    const discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        'apiKey': API_KEY,
        'discoveryDocs': [discoveryUrl],
        'clientId': CLIENT_ID,
        'scope': SCOPE
    }).then(() => {
        GoogleAuth = gapi.auth2.getAuthInstance()

        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen(setSigninStatus)

        // Handle initial sign-in state. (Determine if user is already signed in.)
        const user = GoogleAuth.currentUser.get()
        setSigninStatus()

        // Call handleAuthClick function when user clicks on
        // "YouTube Login" button.
        $('#youtube-login').click(function () {
            handleAuthClick()
        })
    })
}

function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
        // User is authorized and has clicked 'Sign out' button.
        GoogleAuth.signOut()
    } else {
        // User is not signed in. Start Google auth flow.
        GoogleAuth.signIn()
    }
}

function setSigninStatus() {
    const user = GoogleAuth.currentUser.get();
    const isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
        youtubeLogin.style.display = 'none'
        if (access_token) {
            convertButton.style.display = 'inline-block'
            playlistsMessage.style.display = 'inline-block'
            getSpotifyPlaylists().then((playlists) => {
                renderSpotifyPlaylists(playlists)
            }).catch((err) => {
                console.log(err)
            })
        }
    } else {
        youtubeLogin.style.display = 'inline-block'
        playlistsMessage.style.display = 'none'
    }
}

spotifyLogin.addEventListener('click', (e) => {
    redirectToSpotifyLogin()
})

convertButton.addEventListener('click', () => {
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
})

access_token = getAccessToken()
if (access_token) {
    spotifyLogin.style.display = 'none'
} else {
    spotifyLogin.style.display = 'inline-block'
    youtubeLogin.style.display = 'none'
    playlistsMessage.style.display = 'none'
}