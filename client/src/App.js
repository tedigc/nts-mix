/* global gapi */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Track from './Track';
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
function searchForTrack(track) {
  const parameters = {
    part: 'snippet',
    maxResults: 5,
    order: 'relevance',
    q: track,
  };
  const request = gapi.client.youtube.search.list(parameters);
  return new Promise((resolve) => {
    request.execute((res) => {
      resolve(res);
    });
  });
}

// Log in or out.
function handleAuthClick() {
  if (GoogleAuth.isSignedIn.get()) {
    GoogleAuth.signOut();
  } else {
    GoogleAuth.signIn();
  }
}

// Given an array of YouTube video IDs, add those videos to the playlist with the specified ID.
function addAllSongs(playlistId, trackIds) {
  let sequence = Promise.resolve();
  trackIds.forEach((id) => {
    sequence = sequence.then(() =>
      new Promise((resolve) => {
        const parameters = {
          part: 'snippet',
          snippet: {
            playlistId,
            resourceId: {
              kind: 'youtube#video',
              videoId: id,
            },
          },
        };

        const request = gapi.client.youtube.playlistItems.insert(parameters);
        request.execute((res) => {
          console.log(res);
          console.log(`Added song successfully : ${res.snippet.title}`);
          resolve();
        });
      }));
  });
}

class App extends Component {
  state = {
    gapiReady: false,
    isAuthorized: false,
    searching: false,
    mix: {
      dj: '',
      description: '',
      location: '',
      date: '',
      tracklist: [],
    },
    url: 'https://www.nts.live/shows/sun-cut/episodes/sun-cut-27th-november-2017',
    playlistId: '',
  };

  constructor(props) {
    super(props);
    this.initClient = this.initClient.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.findTracklist = this.findTracklist.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
  }

  componentWillMount() {
    this.loadYoutubeAPI();
  }

  loadYoutubeAPI() {
    console.log('Loading YouTube API');
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      this.setState({ gapiReady: true });
      gapi.load('client:auth2', this.initClient);
    };
    document.body.appendChild(script);
  }

  // Initialise GAPI client and check the user's sign in status.
  initClient() {
    console.log('Initialising');
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/youtube',
      discoveryDocs: DISCOVERY_DOCS,
    })
      .then(() => {
        console.log(gapi.auth2.getAuthInstance());
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

  // Update the search text field.
  handleChange(e) {
    e.preventDefault();
    if (e.target.name === 'nts-link') {
      this.setState({ url: e.target.value });
    }
  }

  // Search NTS for a tracklist, and create a playlist from that.
  findTracklist(e) {
    this.setState({ searching: true });

    e.preventDefault();
    const { url } = this.state;
    axios.post('/api/nts/tracklist', { url })
      .then((result) => {
        const { dj, description, location, date, tracklist } = result.data;
        this.setState({ mix: { dj, description, location, date, tracklist }, searching: false });

        // Promise.all(tracklist.map((track) => {
        //     return searchForTrack(track);
        //   }))
        //   .then((response) => {
        //     console.log(response);
        //     let trackIds = [];
        //     for(let result of response) {
        //       console.log(result);
        //       if(result.pageInfo.totalResults > 0) {
        //         trackIds.push(result.items[0].id.videoId);
        //       }
        //     }
        //     this.createPlaylist(dj, description, location, date, trackIds);
        //   });
      })
      .catch(() => {
        this.setState({ mix: { tracklist: [] } });
      });
  }

  // Create a brand new playlist, and fill it with a collection of tracks based on IDs.
  createPlaylist(dj, description, location, date, trackIds) {
    this.setState({ status: 'CREATING PLAYLIST' });
    const title = `${dj} - ${location} ${date} | NTS mix`;

    // Define parameters.
    const parameters = {
      part: 'snippet, status',
      resource: {
        snippet: {
          title,
          description,
        },
        status: { privacyStatus: 'private' },
      },
    };

    // Execute request.
    const request = gapi.client.youtube.playlists.insert(parameters);
    request.execute((res) => {
      const playlistId = res.id;
      console.log(`Playlist Created with ID ${playlistId}`);
      this.setState({ status: 'ADDING SONGS' });
      addAllSongs(playlistId, trackIds);
    });
  }

  // Returns a list of track components.
  tracklist() {
    const { dj, description, tracklist } = this.state.mix;
    const tracklistComponent = tracklist.map((track, key) => {
      return <Track key={key} artist={track.artist} title={track.title}/>;
    });
    if (tracklist.length > 0) {
      return (
        <div>
          <h1>{dj.toUpperCase()}</h1>
          <p>{description}</p>
          <hr/>
          {tracklistComponent}
        </div>
      );
    }
    return (<div></div>);
  }

  searchButton() {
    const { isAuthorized, gapiReady } = this.state;
    if (this.state.searching) {
      return (
        <button value={this.state.url} disabled={!gapiReady || !isAuthorized}>
          <i class="fas fa-spinner spinner"></i>
        </button>
      );
    }
    return (
      <button value={this.state.url} disabled={!gapiReady || !isAuthorized}>
        <i className="fas fa-search"></i>
      </button>
    );
  }

  render() {
    const { isAuthorized, gapiReady } = this.state;

    let loginText;
    if (gapiReady) loginText = (isAuthorized) ? 'LOG OUT' : 'LOG IN';
    else loginText = 'WAIT';

    const tracklist = this.tracklist();

    return (
      <div className="overlay">
        <div className="content">
          <h1>WELCOME TO NTS MIX</h1>

          {/* NTS Search Form */}
          <form onSubmit={this.findTracklist}>
            <button className="search-button" value={this.state.url} disabled={!gapiReady || !isAuthorized}>
              <i className="fas fa-search"></i>
            </button>
            <div className="search-wrapper">
              <input type="text" name="nts-link" value={this.state.url} disabled={!gapiReady || !isAuthorized} onChange={this.handleChange}/>
            </div>
          </form>

          <br/>
          <br/>

          {tracklist}

        </div>

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
          <Link to="/tracklist"><button className="outline" style={{ marginLeft: 10 }}>TRACKLIST PAGE</button></Link>
        </div>

      </div>
    );
  }
}

export default App;
