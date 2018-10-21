/* global gapi */
import React, { Component } from 'react';
import SearchForm from '../components/SearchForm';
import Mix from '../components/Mix';
import Info from '../components/Info';
import AuthContext from '../contexts/AuthContext';
import '../style/index.css';
import { initClient, logInOut } from '../util/auth';

import youtube from '../util/youtube';

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

  /**
   * Load the YouTubeAPI before the component mounts
   */
  componentWillMount = () => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      this.setState({ gapiReady: true });
      gapi.load('client:auth2', initClient.bind(null, this.setAuth));
    };
    document.body.appendChild(script);
  }

  setAuth = (isAuthorized) => {
    this.setState({ isAuthorized });
  }

  /**
   * Remove the error message and update the mix info
   */
  updateMix = (mix) => {
    this.setState({
      mix,
      error: '',
    });
  }

  /**
   * Remove mix info and update the error message.
   */
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

  /**
   * Produce either an error message or a mix panel
   */
  content = () => {
    const { error, mix } = this.state;
    if (error) {
      return <div className="panel"><div className="panel-inner-wrapper"><h1>Something went wrong...</h1><div className="dark">{error}</div></div></div>;
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
        <AuthContext.Provider value={{ isAuthorized, gapiReady, setAuth: this.setAuth }}>

          <div className="container">
            <div className="row">
              <div className="col-12">
                {/* NTS Search Form */}
                <div className="panel">
                  <div className="panel-inner-wrapper">

                    <div className="title-wrapper">
                      <h1 className="title">WELCOME TO NTS MIX</h1>
                      <button className="login-button" onClick={() => logInOut() } disabled={!gapiReady}>{loginText}</button>
                    </div>

                    <SearchForm
                      updateMix={this.updateMix}
                      updateError={this.updateError}
                    />
                    <br/>
                  </div>
                </div>

                {/* Tracklist or error message */}
                {this.content()}

                {/* Info panel */}
                <Info/>

              </div>
            </div>
          </div>

        {/* <div className="row">
          <div className="col-6">
            <div className="control-panel">
              <button
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
              </button>

            </div>
          </div>
        </div> */}

        </AuthContext.Provider>
      </div>
    );
  }
}

export default App;
