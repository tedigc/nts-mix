/* global gapi */

import React, { Component } from 'react';
import axios from 'axios';

/**
 * example NTS search: https://www.nts.live/shows/sun-cut/episodes/sun-cut-27th-november-2017
 */

let API_KEY = "";

class App extends Component {

  state = {
    url   : 'https://www.nts.live/shows/sun-cut/episodes/sun-cut-27th-november-2017',
    search: '',
    gapiReady: false,
    tracklist: []
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.apiTest = this.apiTest.bind(this);
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

  componentDidMount() {
    this.loadYoutubeAPI();
  }

  handleChange(event) {
    event.preventDefault();
    if(event.target.name === "nts-link") {
      this.setState({ url : event.target.value });      
    }
    if(event.target.name === "yt-search") {
      this.setState({ search : event.target.value });            
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { url } = this.state;
    axios.post('/api/submit', { url })
      .then((result) => {
        const { tracklist } = result.data;
        this.setState({ tracklist });        
        for(let track of this.state.tracklist) {
          console.log(track);
        }
      });
  }

  apiTest(event) {
    event.preventDefault();
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

  render() {
    return (
      <div className="App">

        <p>{this.state.gapiReady}</p>

        {/* NTS Track List Search */}
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="nts-link" value={this.state.url} onChange={this.handleChange} />
          <button>Search NTS</button>
        </form>

        <hr/>

        {/* Temporary YouTube API Test */}
        <form onSubmit={this.apiTest}>
          <input type="text" name="yt-search" value={this.state.search} onChange={this.handleChange} />
          <button>Search YouTube</button>
        </form>

      </div>
    );
  }

}

export default App;
