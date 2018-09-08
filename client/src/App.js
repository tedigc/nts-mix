/* global gapi */
import React, { Component } from 'react';
import SearchForm from './components/SearchForm';
import Mix from './components/Mix';
import './style/index.css';
import { listPlaylists, clearPlaylist, deleteAllPlaylists } from './util/youtube';

const API_KEY = 'AIzaSyBkgrN0HMZWQzMxgkXMGw2F_ysxFUdDe9o'; // API key is restricted, so can be public.
const CLIENT_ID = '859070380405-1fr4q5kqkkk460ccjianpi78kk14tqig.apps.googleusercontent.com';
const SCOPE = 'https://www.googleapis.com/auth/youtube';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];

let GoogleAuth;

// Log in or out.
function handleAuthClick() {
  if (GoogleAuth.isSignedIn.get()) {
    GoogleAuth.signOut();
  } else {
    GoogleAuth.signIn();
  }
}

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
    this.setState({
      mix,
      error: '',
    });
  }

  updateError = (error) => {
    this.setState({
      error,
      mix: {
        dj: '',
        description: '',
        locationDate: '',
        tracklist: [],
      },
    });
  }

  content = () => {
    const { error, mix } = this.state;
    if (error) {
      return <div className="mix-box"><h1>Something went wrong...</h1><div className="error">{error}</div></div>;
    } else if (mix.dj.length === 0) {
      return '';
    }
    return <Mix {...mix} updateError={this.updateError} />;
  }

  render = () => {
    const { isAuthorized, gapiReady } = this.state;
    let loginText;
    if (gapiReady) loginText = (isAuthorized) ? 'LOG OUT' : 'LOG IN';
    else loginText = 'WAIT';

    return (
      <div className="overlay">

        {/* NTS Search Form */}
        <div className="search-box">
          <h1>WELCOME TO NTS MIX</h1>
          <SearchForm
            gapiReady
            isAuthorized
            updateMix={this.updateMix}
            updateError={this.updateError}
          />
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
            disabled={!gapiReady || !isAuthorized || true}
            style={{ marginLeft: 10 }}>
            DELETE ALL PLAYLISTS
          </button>
          <button
            className="outline"
            onClick={() => listPlaylists() }
            disabled={!gapiReady || !isAuthorized}
            style={{ marginLeft: 10 }}>
            LIST PLAYLISTS
          </button>
          <button
            className="outline"
            onClick={() => clearPlaylist('PLXl_nPEBC_L2CY6-japw2FiM6_lDrRupL') }
            disabled={!gapiReady || !isAuthorized}
            style={{ marginLeft: 10 }}>
            CLEAR
          </button>
        </div>

      </div>
    );
  }
}

export default App;
