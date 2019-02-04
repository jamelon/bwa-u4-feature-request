let accessToken;
const clientID = 'dfac998c694444db86337a616716475e';
const redirectURI = 'http://localhost:3000/'

const Spotify = {
    getAccessToken() {
        if(accessToken) {
            return accessToken;
        } else if (window.location.href.match(/access_token=([^&]*)/)){
          accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
          let expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
          window.setTimeout(() => accessToken = '', expiresIn * 1000);
          window.history.pushState('Access Token', null, '/');
          return accessToken;
        } else {
          let url = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
          window.location = url;
        }
    },
    search(term) {
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }).then(response => {
              return response.json();
          }).then(jsonResponse => {
              if (jsonResponse) {
                  return jsonResponse.tracks.items.map(track =>({
                      id: track.id,
                      name: track.name,
                      artist: track.artists[0].name,
                      album: track.album.name,
                      uri: track.uri,
                      preview_url: track.preview_url
                  }));
              }
          });
    },
    savePlaylist(playlistName, trackURIs){
        let headers = {Authorization: `Bearer ${accessToken}`};
        let userId;
        let playlistId;
        let userEndpoint = 'https://api.spotify.com/v1/me';

        return fetch(userEndpoint, {
            headers: headers
        }).then(response => response.json()).then(jsonResponse =>{
            console.log(jsonResponse.id);
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                method: 'POST',
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/jsonResponse'
                },
                body: JSON.stringify({
                    name: playlistName
                })
            }).then(response => response.json()).then(jsonResponse => {
                playlistId = jsonResponse.id
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                    method: 'POST',
                    headers:{
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/jsonResponse'
                    },
                    body: JSON.stringify({
                        uris: trackURIs
                    })
                });
            });
        });
    }
};

export default Spotify;
