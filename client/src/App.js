/* global gapi */

import React, { Component } from 'react';
import axios from 'axios';
import { injectGlobal } from 'styled-components';
import Track from './Track';

// set style and fonts
import myfont from './UniversCondensed.ttf';
import './index.css';

injectGlobal`
  @font-face {
    font-family: 'UniversCondensed';
    src: local('UniversCondensed'), url(${myfont}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }
`;

const API_KEY        = 'AIzaSyB4gUJOW_UWz7u-OVeA9DFDFC8HBRxf1HY'; // API key is restricted, so can be public
const CLIENT_ID      = '859070380405-o07ctoojjj77p6hqvo1qu04o8jr28k6t.apps.googleusercontent.com';
const SCOPE          = 'https://www.googleapis.com/auth/youtube';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
const DO_NOT_DELETE  = 'PLQ3YpXF4Wmw85ntSyGtW3_b8Up02Yw66V'; // playlist ID. doesn't really matter if this goes public

let GoogleAuth;

class App extends Component {

  state = {
    gapiReady    : false,
    isAuthorized : false,
    tracklist    : [],
    url          : 'https://www.nts.live/shows/sun-cut/episodes/sun-cut-27th-november-2017',
    playlistId   : '',
    status       : ''
  };

  constructor(props) {
    super(props);
    this.initClient = this.initClient.bind(this);
    this.handleAuthClick = this.handleAuthClick.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.findTracklist = this.findTracklist.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
    this.deleteAllPlaylists = this.deleteAllPlaylists.bind(this);
    this.deletePlaylist = this.deletePlaylist.bind(this);
  }

  componentWillMount() {
    this.loadYoutubeAPI();
  } 

  loadYoutubeAPI() {
    console.log('loading youtube api');
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      this.setState({ gapiReady : true });
      gapi.load('client:auth2', this.initClient);
    };
    document.body.appendChild(script);
  }

  /**
   * Initialise GAPI client and check the user's sign in status
   */
  initClient() {
    gapi.client.init({
      'apiKey'   : API_KEY,
      'clientId' : CLIENT_ID,
      'scope'    : 'https://www.googleapis.com/auth/youtube',
      discoveryDocs: DISCOVERY_DOCS
      })
      .then(() => {
        GoogleAuth = gapi.auth2.getAuthInstance();
        GoogleAuth.isSignedIn.listen((isAuthorized) => { this.setState({ isAuthorized }); });
    
        let user = GoogleAuth.currentUser.get();
        let isAuthorized = user.hasGrantedScopes(SCOPE);
        this.setState({ isAuthorized });

        // TODO delay setting LOG IN / LOG OUT text until this has been completed
      });
  }

  handleAuthClick(e) {
    e.preventDefault();
    if(GoogleAuth.isSignedIn.get()) {
      GoogleAuth.signOut();
    } else {
      GoogleAuth.signIn();
    }
  }

  handleChange(e) {
    e.preventDefault();
    if(e.target.name === "nts-link") {
      this.setState({ url : e.target.value });      
    }
  }

  /**
   * search NTS for a tracklist, and create a playlist from that
   */
  findTracklist(e) {

    this.setState({ status : 'SEARCHING FOR TRACKLIST'});

    e.preventDefault();
    const { url } = this.state;
    axios.post('/api/nts/tracklist', { url })
      .then((result) => {
        let { tracklist } = result.data;
        this.setState({ tracklist });

        Promise.all(tracklist.map((track) => {
            return this.searchForTrack(track);
          }))
          .then((response) => {
            let trackIds = [];
            for(let result of response) {
              trackIds.push(result.items[0].id.videoId);
            }
            this.createPlaylist(trackIds);
            // this.addAllSongs([0, 1, 2, 3, 4]);
          });
      });
  }

  searchForTrack(track) {
    let parameters = {
      part : 'snippet',
      maxResults: 5,
      order: 'relevance',
      q : track
    };
    let request = gapi.client.youtube.search.list(parameters);
    return new Promise((resolve, reject) => {
      request.execute((res) => {
        resolve(res);
      });
    });
  }

  /**
   * TODO remove this method 
   * 
   * removes all playlists, except for my own "lectures and talks" playlist
   */
  deleteAllPlaylists() {
    console.log('Deleting all playlists');

    let parameters = {
      part      : 'snippet',
      mine      : true,
      maxResultd: 25
    };

    let request = gapi.client.youtube.playlists.list(parameters);
    request.execute((res) => {
      for(let item of res.items) {
        if(item.id !== DO_NOT_DELETE) {
          this.deletePlaylist(item.id);
        }
      }
    });
  }

  /**
   * Create a brand new playlist, and fill it with a collection of tracks based on IDs
   * @param {array} trackIds 
   */
  createPlaylist(trackIds) {

    this.setState({ status : 'CREATING PLAYLIST'});

    // define parameters
    let parameters = {
      part: 'snippet, status',
      resource: {
        snippet: {
          title: 'Test Playlist',
          description: 'Test playlist for NTS mix'
        },
        status: {
          privacyStatus: 'private'
        }
      }
    };

    // execute request
    let request = gapi.client.youtube.playlists.insert(parameters);
    request.execute((res) => {
      let playlistId = res.id;
      console.log(`Playlist Created with ID ${playlistId}`);
      this.setState({ status : 'ADDING SONGS' });
      this.addAllSongs(playlistId, trackIds);
    });
  }

  /**
   * Delete the YouTube playlist with the given ID
   * 
   * @param {string} playlistId 
   */
  deletePlaylist(playlistId) {

    let request = gapi.client.youtube.playlists.delete({ id : playlistId });
    request.execute((res) => {
      console.log(res);
    });
  }

  /**
   * Given an array of YouTube video IDs, add those videos to the playlist with the specified ID
   * @param {string}       playlistId 
   * @param {array:string} trackIds 
   */
  addAllSongs(playlistId, trackIds) {
    let sequence = Promise.resolve();
    for(let id of trackIds) {
      sequence = sequence.then(() => {
        return new Promise((resolve, reject) => {

          // define parameters
          let parameters = {
            part : 'snippet',
            snippet : {
              playlistId : playlistId,
              resourceId : {
                kind : 'youtube#video',
                videoId: id
              }
            }
          };

          // execute request
          let request = gapi.client.youtube.playlistItems.insert(parameters);
          request.execute((res) => {
            console.log(res);
            console.log('added song successfully : ' + res.snippet.title);
            resolve();
          });

        });
      })
    }
  }

  /**
   * returns a list of track components
   */
  tracklist() {
    let tracklist = this.state.tracklist.map((track, key) => {
      let artist = track.split("-")[0].trim();
      let title  = track.split("-")[1].trim();
      return <Track key={key} artist={artist} title={title}/>
    });
    return tracklist;
  }

  render() {
    let { isAuthorized, status, gapiReady } = this.state;
    
    let loginText;
    if(gapiReady) {
      loginText = (isAuthorized) ? 'LOG OUT' : 'LOG IN';
    } else {
      loginText = 'WAIT';
    }

    return (
      <div className="App">
        <h1>WELCOME TO NTS MIX</h1>

        <span>{status}</span>

        <br/>
        <br/>

        <button onClick={this.handleAuthClick} disabled={!gapiReady}>{loginText}</button>
        <button onClick={this.deleteAllPlaylists} disabled={!gapiReady || !isAuthorized} style={{ marginLeft: 10 }}>DELETE ALL PLAYLISTS</button>
        
        <br/>
        <br/>

        {/* NTS Track List Search */}
        <form onSubmit={this.findTracklist}>
          <input type="text" name="nts-link" value={this.state.url} disabled={!gapiReady || !isAuthorized} onChange={this.handleChange}/>
          <button value={this.state.url} disabled={!gapiReady || !isAuthorized}>SEARCH NTS</button>
        </form>

        <br/>
        <br/>
        <br/>

        {this.tracklist()}

      </div>
    );
  }

}

export default App;