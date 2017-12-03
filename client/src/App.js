/* global gapi */

/**
 * USEFUL LINKS:
 *  - https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps
 */

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

class App extends Component {

  state = {
    url       : 'https://www.nts.live/shows/sun-cut/episodes/sun-cut-27th-november-2017',
    search    : '',
    gapiReady : false,
    tracklist : [],
    code      : '',
    token     : '',
    isAuthorized : false,
    GoogleAuth : {}
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.findTracklist = this.findTracklist.bind(this);
    this.handleAuthClick = this.handleAuthClick.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
  }

  componentDidMount() {
    // this.loadYoutubeAPI();
    let { search } = this.props.location;
    if(search.includes("?code=")) {

      // extract code from url
      let code = decodeURIComponent(this.props.location.search.split("=")[1]);
      // if(code.charAt(code.length) === '#') code = code.slice(0, -1);
      console.log(code);
      this.setState({ code });

      // obtain access key 
      console.log("Access granted. Obtaining key.");
      axios.post('/api/auth/token', { authCode : code })
        .then((response) => {
          console.log("token received");
          console.log(response.data);
          this.setState({ token : response.data });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  handleAuthClick(e) {
    e.preventDefault();
    let { isAuthorized } = this.state;
    if(!isAuthorized) {
      // log in
      axios.get('/api/auth/code')
        .then((res) => {
          window.location = res.data.url;
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      // log out
      console.log('logout');
    }
  }

  handleChange(e) {
    e.preventDefault();
    if(e.target.name === "nts-link") {
      this.setState({ url : e.target.value });      
    }
    if(e.target.name === "yt-search") {
      this.setState({ search : e.target.value });            
    }
  }

  findTracklist(e) {
    e.preventDefault();
    const { url } = this.state;
    axios.post('/api/nts/tracklist', { url })
      .then((result) => {
        this.setState({ tracklist : result.data.tracklist });     
      });
  }

  createPlaylist() {
    console.log("creating playlist");

    let request = gapi.client.youtube.playlists.insert({
      part: 'snippet, status',
      resource: {
        snippet: {
          title: 'Test Playlist',
          description: 'Ayy Lmao'
        },
        status: {
          privacyStatus: 'private'
        }
      }
    });
    request.execute((res) => {
      console.log(res);
    });
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
    let { isAuthorized } = this.state;
    let loginText = (isAuthorized) ? 'LOG OUT' : 'LOG IN';
    return (
      <div className="App">
        <h1>WELCOME TO NTS MIX</h1>

        <button onClick={this.handleAuthClick}>{loginText}</button>
        <button onClick={this.createPlaylist} style={{ marginLeft: 10 }}>CREATE PLAYLIST</button>
        
        <br/>
        <br/>

        {/* NTS Track List Search */}
        <form onSubmit={this.findTracklist}>
          <input type="text" name="nts-link" value={this.state.url} onChange={this.handleChange}/>
          <button>SEARCH NTS</button>
        </form>

        <br/>

        {/* Temporary YouTube API Test */}
        <form onSubmit={this.apiTest}>
          <input type="text" name="yt-search" value={this.state.search} onChange={this.handleChange}/>
          <button className="button" >SEARCH YOUTUBE</button>
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