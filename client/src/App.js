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

let API_KEY = "";

class App extends Component {

  state = {
    url       : 'https://www.nts.live/shows/sun-cut/episodes/sun-cut-27th-november-2017',
    search    : '',
    gapiReady : false,
    tracklist : [],
    code      : '',
    token     : '',
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.findTracklist = this.findTracklist.bind(this);
    this.apiTest = this.apiTest.bind(this);
    this.login = this.login.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
  }

  componentDidMount() {
    this.loadYoutubeAPI();
    let search = this.props.location.search;
    if(search.includes("?code=")) {
      let code = decodeURIComponent(this.props.location.search.split("=")[1]);
      console.log(code);
      this.setState({ code });
      console.log("Access granted. Obtaining key.");
      axios.post('/api/key', { authCode : code })
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

  loadYoutubeAPI() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      gapi.load('client', () => {
        gapi.client.setApiKey(API_KEY);
        gapi.client.load('youtube', 'v3', () => {
          this.setState({ gapiReady: true });
        });
      });
    }

    document.body.appendChild(script);
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
    axios.post('/api/submit', { url })
      .then((result) => {
        this.setState({ tracklist : result.data.tracklist });     
      });
  }

  apiTest(e) {
    e.preventDefault();
    let { search } = this.state;
    let request = gapi.client.youtube.search.list({
      part      : "snippet",
      type      : "video",
      q         : this.state.search,
      maxResults: 3,
      order     : "viewCount",
    });
    request.execute((res) => {
      console.log(res);
    });
    console.log(`API Test - ${search}`);
  }

  login(e) {
    e.preventDefault();
    console.log("Tesing API");
    axios.post('/api/playlist', {})
      .then((result) => {
        window.location = result.data.url;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  createPlaylist() {
    console.log("creating playlist");
    axios.post('/api/playlist', this.state.token)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
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
    return (
      <div className="App">
        <h1>WELCOME TO NTS MIX</h1>

        <button onClick={this.login}>LOG IN</button>
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