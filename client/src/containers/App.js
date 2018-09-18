/* global gapi */
import React, { Component } from 'react';
import SearchForm from '../components/SearchForm';
import Mix from '../components/Mix';
import Info from '../components/Info';
import '../style/index.css';
import youtube from '../util/youtube';
import config from '../config';

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
    username: '',
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
      apiKey: config.apiKey,
      clientId: config.clientId,
      scope: 'https://www.googleapis.com/auth/youtube',
      discoveryDocs: DISCOVERY_DOCS,
    })
      .then(() => {
        GoogleAuth = gapi.auth2.getAuthInstance();
        GoogleAuth.isSignedIn.listen((isAuthorized) => { this.setState({ isAuthorized }); });
        const user = GoogleAuth.currentUser.get();
        const username = user.w3.ig;
        const isAuthorized = user.hasGrantedScopes(SCOPE);
        this.setState({ isAuthorized, username });
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
    const { isAuthorized, gapiReady, username } = this.state;
    let loginText;
    if (gapiReady) loginText = (isAuthorized) ? 'LOG OUT' : 'LOG IN';
    else loginText = 'WAIT';

    return (
      <div className="overlay">

        {/* NTS Search Form */}
        <div className="search-box">
          <div className="title-wrapper">
            <h1>WELCOME TO NTS MIX<button className="info-button"><i className="fas fa-info"></i></button></h1>
          </div>
          <SearchForm
            gapiReady={gapiReady}
            isAuthorized={isAuthorized}
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
          { gapiReady && isAuthorized && <span className="user-text">Logged in as {username}</span>}
          {/* <button
            className="outline"
            onClick={() => youtube.deleteAllPlaylists() }
            disabled={!gapiReady || !isAuthorized }
            style={{ marginLeft: 10 }}>
            DELETE ALL PLAYLISTS
          </button>
          <button
            className="outline"
            onClick={() => youtube.listPlaylists() }
            disabled={!gapiReady || !isAuthorized}
            style={{ marginLeft: 10 }}>
            LIST PLAYLISTS
          </button>
          <button
            className="outline"
            onClick={() => youtube.clearPlaylist('PLQ3YpXF4Wmw-KCQdRuG95gAQqEl_Y7C5d') }
            disabled={!gapiReady || !isAuthorized}
            style={{ marginLeft: 10 }}>
            CLEAR
          </button> */}
        </div>

        <Info/>

      </div>
    );
  }
}

export default App;
