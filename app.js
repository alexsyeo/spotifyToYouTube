const spotify_client_id = '15eec43e1d384f5eaf6a811a8d0c3e06'
const CLIENT_ID = '5276504902-vqgh3qs5ns4hadnjc691go947qbbcqkf.apps.googleusercontent.com'
const API_KEY = 'AIzaSyDVCNrT1b4C1QlmG598XEop-tHbTyMen9c'
const loginMessage = document.getElementById('login-message')
const playlistsToProcess = {}
var GoogleAuth;
var SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
}

function initClient() {
    // Retrieve the discovery document for version 3 of YouTube Data API.
    // In practice, your app can retrieve one or more discovery documents.
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        'apiKey': API_KEY,
        'discoveryDocs': [discoveryUrl],
        'clientId': CLIENT_ID,
        'scope': SCOPE
    }).then(function () {
        GoogleAuth = gapi.auth2.getAuthInstance();

        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen(updateSigninStatus);

        // Handle initial sign-in state. (Determine if user is already signed in.)
        var user = GoogleAuth.currentUser.get();
        setSigninStatus();

        // Call handleAuthClick function when user clicks on
        //      "Sign In/Authorize" button.
        $('#sign-in-or-out-button').click(function () {
            handleAuthClick();
        });
        $('#revoke-access-button').click(function () {
            revokeAccess();
        });
    });
}

function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
        // User is authorized and has clicked 'Sign out' button.
        GoogleAuth.signOut();
    } else {
        // User is not signed in. Start Google auth flow.
        GoogleAuth.signIn();
    }
}

function revokeAccess() {
    GoogleAuth.disconnect();
}

function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
        $('#sign-in-or-out-button').html('Sign out');
        $('#revoke-access-button').css('display', 'inline-block');
        $('#auth-status').html('You are currently signed in and have granted ' +
            'access to this app.');
    } else {
        $('#sign-in-or-out-button').html('Sign In/Authorize');
        $('#revoke-access-button').css('display', 'none');
        $('#auth-status').html('You have not authorized this app or you are ' +
            'signed out.');
    }
}

function updateSigninStatus(isSignedIn) {
    setSigninStatus();
}

// TODO: Change redirect_uri to www.spotifytoyoutube.com
document.getElementById('spotify-login').addEventListener('click', (e) => {
    const spotify_auth_url = 'https://accounts.spotify.com/authorize'
    // const redirect_uri = 'http://localhost:65346'
    const redirect_uri = 'https://spotifytoyoutube.com'
    // const redirect_uri = 'https://alexsyeo.github.io/spotifyToYouTube'
    const response_type = 'token'
    const scope = 'playlist-read-private'
    location.assign(`${spotify_auth_url}?client_id=${spotify_client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`)
})

document.getElementById('convert-button').addEventListener('click', (e) => {
    if (noPlaylistsToProcess()) {
        alert('No playlists have been selected!')
    } else {
        // TODO: Add converting logic
    }
})

document.getElementById('test-log-playlists-button').addEventListener('click', (e) => {
    getYouTubePlaylists().then((response) => {
        console.log(response)
    }).catch((err) => {
        console.log(`Error: ${err}`)
    })
})

const access_token = getAccessToken()
if (!access_token) {
    loginMessage.textContent = 'Please log in to Spotify by pressing button below.'
} else {
    loginMessage.textContent = 'Currently logged in to Spotify.'
    // TODO: list playlists on user screen
    getUserPlaylists().then((playlists) => {
        console.log(playlists)
    }).catch((err) => {
        console.log(err)
    })
}