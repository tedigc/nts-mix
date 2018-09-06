/* global gapi */
import React, { Component } from 'react';
import SearchForm from './components/SearchForm';
import Mix from './components/Mix';
import './style/index.css';

const API_KEY = 'AIzaSyBkgrN0HMZWQzMxgkXMGw2F_ysxFUdDe9o'; // API key is restricted, so can be public.
const CLIENT_ID = '859070380405-1fr4q5kqkkk460ccjianpi78kk14tqig.apps.googleusercontent.com';
const SCOPE = 'https://www.googleapis.com/auth/youtube';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];
const DO_NOT_DELETE = 'PLQ3YpXF4Wmw85ntSyGtW3_b8Up02Yw66V'; // Playlist ID. doesn't really matter if this goes public.

let GoogleAuth;

// Delete the YouTube playlist with the given ID.
function deletePlaylist(playlistId) {
  const request = gapi.client.youtube.playlists.delete({ id: playlistId });
  request.execute((res) => {
    console.log(res);
  });
}

// Removes all playlists, except for my own "lectures and talks" playlist.
function deleteAllPlaylists() {
  const parameters = {
    part: 'snippet',
    mine: true,
    maxResults: 25,
  };

  const request = gapi.client.youtube.playlists.list(parameters);
  request.execute((res) => {
    res.items.forEach((item) => {
      if (item.id !== DO_NOT_DELETE) {
        deletePlaylist(item.id);
      }
    });
  });
}

// Search for a track using the YouTube API.
// function searchForTrack(track) {
//   const parameters = {
//     part: 'snippet',
//     maxResults: 5,
//     order: 'relevance',
//     q: track,
//   };
//   const request = gapi.client.youtube.search.list(parameters);
//   return new Promise((resolve) => {
//     request.execute((res) => {
//       resolve(res);
//     });
//   });
// }

// Log in or out.
function handleAuthClick() {
  if (GoogleAuth.isSignedIn.get()) {
    GoogleAuth.signOut();
  } else {
    GoogleAuth.signIn();
  }
}

// Given an array of YouTube video IDs, add those videos to the playlist with the specified ID.
// function addAllSongs(playlistId, trackIds) {
//   let sequence = Promise.resolve();
//   trackIds.forEach((id) => {
//     sequence = sequence.then(() =>
//       new Promise((resolve) => {
//         const parameters = {
//           part: 'snippet',
//           snippet: {
//             playlistId,
//             resourceId: {
//               kind: 'youtube#video',
//               videoId: id,
//             },
//           },
//         };

//         const request = gapi.client.youtube.playlistItems.insert(parameters);
//         request.execute((res) => {
//           console.log(res);
//           console.log(`Added song successfully : ${res.snippet.title}`);
//           resolve();
//         });
//       }));
//   });
// }

// Create a brand new playlist, and fill it with a collection of tracks based on IDs.
// function createPlaylist (dj, description, location, date, trackIds) {
//   const title = `${dj} - ${location} ${date} | NTS mix`;

//   // Define parameters.
//   const parameters = {
//     part: 'snippet, status',
//     resource: {
//       snippet: {
//         title,
//         description,
//       },
//       status: { privacyStatus: 'private' },
//     },
//   };

//   // Execute request.
//   const request = gapi.client.youtube.playlists.insert(parameters);
//   request.execute((res) => {
//     const playlistId = res.id;
//     addAllSongs(playlistId, trackIds);
//   });
// }

class App extends Component {
  state = {
    gapiReady: false,
    isAuthorized: false,
    error: '',
    mix: {
      dj: '',
      description: '',
      locationDate: '',
      tracklist: [],
    },
    playlistId: '',
  };

  componentWillMount = () => {
    this.loadYoutubeAPI();
  }

  loadYoutubeAPI = () => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      this.setState({ gapiReady: true });
      gapi.load('client:auth2', this.initClient);
    };
    document.body.appendChild(script);
  }

  // Initialise GAPI client and check the user's sign in status.
  initClient = () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/youtube',
      discoveryDocs: DISCOVERY_DOCS,
    })
      .then(() => {
        GoogleAuth = gapi.auth2.getAuthInstance();
        GoogleAuth.isSignedIn.listen((isAuthorized) => { this.setState({ isAuthorized }); });

        const user = GoogleAuth.currentUser.get();
        const isAuthorized = user.hasGrantedScopes(SCOPE);
        this.setState({ isAuthorized });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateMix = (mix) => {
    this.setState({ mix });
  }

  updateError = (error) => {
    this.setState({ error });
  }

  content = () => {
    const { error, mix } = this.state;
    if (error) {
      return <div className="mix-box">{error}</div>;
    } else if (mix.dj.length === 0) {
      return '';
    }
    return <Mix {...mix}/>;
  }

  render = () => {
    const { isAuthorized, gapiReady } = this.state;
    let loginText;
    if (gapiReady) loginText = (isAuthorized) ? 'LOG OUT' : 'LOG IN';
    else loginText = 'WAIT';

    return (
      <div className="overlay">

        {/* NTS Search Form */}
        <div className="content">
          <h1>WELCOME TO NTS MIX</h1>
          <SearchForm gapiReady isAuthorized updateMix={this.updateMix} updateError={this.updateError}/>
          <br/>
        </div>

        {/* Tracklist or error message */}
        {this.content()}

        {/* Control panel */}
        <div className="control-panel">
          <button className="outline" onClick={() => handleAuthClick() } disabled={!gapiReady}>{loginText}</button>
          <button
            className="outline"
            onClick={() => deleteAllPlaylists() }
            disabled={!gapiReady || !isAuthorized}
            style={{ marginLeft: 10 }}>
            DELETE ALL PLAYLISTS
          </button>
        </div>

      </div>
    );
  }
}

export default App;
