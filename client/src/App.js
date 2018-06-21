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
  const request = gapi.client.youtube.playlists.delete({ id : playlistId });
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
    part      : 'snippet',
    maxResults: 5,
    order     : 'relevance',
    q         : track
  };
  const request = gapi.client.youtube.search.list(parameters);
  return new Promise((resolve, reject) => {
    request.execute((res) => {
      resolve(res);
    });
  });
}

class App extends Component {
  state = {
    gapiReady: false,
    isAuthorized: false,
    mix: {
      dj: '',
      description: '',
      location: '',
      date: '',
      tracklist: [],
    },
    url: 'https://www.nts.live/shows/sun-cut/episodes/sun-cut-27th-november-2017',
    playlistId: '',
    status: '',
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
    console.log('loading youtube api');
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      this.setState({ gapiReady: true });
      gapi.load('client:auth2', this.initClient);
    };
    document.body.appendChild(script);
  }

  /**
   * Initialise GAPI client and check the user's sign in status.
   */
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
    
        let user = GoogleAuth.currentUser.get();
        let isAuthorized = user.hasGrantedScopes(SCOPE);
        this.setState({ isAuthorized });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Log in or out.
   */
  handleAuthClick(e) {
    e.preventDefault();
    if(GoogleAuth.isSignedIn.get()) {
      GoogleAuth.signOut();
    } else {
      GoogleAuth.signIn();
    }
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
    this.setState({ status: 'SEARCHING FOR TRACKLIST' });

    e.preventDefault();
    const { url } = this.state;
    axios.post('/api/nts/tracklist', { url })
      .then((result) => {

        let { dj, description, location, date, tracklist } = result.data;
        this.setState({ mix : { dj, description, location, date, tracklist }});

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

  /**
   * Create a brand new playlist, and fill it with a collection of tracks based on IDs.
   */
  createPlaylist(dj, description, location, date, trackIds) {

    this.setState({ status: 'CREATING PLAYLIST'});
    const title = `${dj} - ${location} ${date} | NTS mix`;

    // Define parameters.
    const parameters = {
      part: 'snippet, status',
      resource: {
        snippet: {
          title,
          description,
        },
        status: {
          privacyStatus: 'private',
        },
      },
    };

    // Execute request.
    const request = gapi.client.youtube.playlists.insert(parameters);
    request.execute((res) => {
      const playlistId = res.id;
      console.log(`Playlist Created with ID ${playlistId}`);
      this.setState({ status: 'ADDING SONGS' });
      this.addAllSongs(playlistId, trackIds);
    });
  }

  /**
   * Given an array of YouTube video IDs, add those videos to the playlist with the specified ID.
   */
  addAllSongs(playlistId, trackIds) {
    let sequence = Promise.resolve();
    for(let id of trackIds) {
      sequence = sequence.then(() => {
        return new Promise((resolve, reject) => {

          // Define parameters.
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

          // Execute request.
          let request = gapi.client.youtube.playlistItems.insert(parameters);
          request.execute((res) => {
            console.log(res);
            console.log('added song successfully : ' + res.snippet.title);
            resolve();
          });

        });
      });
    }
  }

  /**
   * Returns a list of track components.
   */
  tracklist() {
    let { dj, description, tracklist } = this.state.mix;
    let tracklistComponent = tracklist.map((track, key) => {
      let artist = track.split("-")[0].trim();
      let title  = track.split("-")[1].trim();
      return <Track key={key} artist={artist} title={title}/>
    });
    console.log(tracklistComponent);
    if(tracklist.length > 0) {
      return (
        <div>
          <h1>{dj.toUpperCase()}</h1>
          <p>{description}</p>
          <hr/>
          {tracklistComponent}
        </div>
      );
    } else {
      return (<div>empty</div>);
    }

  }

  render() {
    const { isAuthorized, status, gapiReady } = this.state;
    
    let loginText;
    if (gapiReady) {
      loginText = (isAuthorized) ? 'LOG OUT' : 'LOG IN';
    } else {
      loginText = 'WAIT';
    }

    const tracklist = this.tracklist();
    const mycomp = (
      <Transition
        timeout={500}
        classNames="fade">
        {tracklist}
      </Transition>
    );

    console.log(mycomp);

    return (
      <div className="App">
        <h1>WELCOME TO NTS MIX</h1>

        <span>{status}</span>

        <br/>
        <br/>

        <button onClick={this.handleAuthClick} disabled={!gapiReady}>{loginText}</button>
        <button onClick={deleteAllPlaylists} disabled={!gapiReady || !isAuthorized} style={{ marginLeft: 10 }}>DELETE ALL PLAYLISTS</button>
        <Link to="/tracklist"><button style={{ marginLeft: 10 }}>TRACKLIST PAGE</button></Link>

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

        {mycomp}

      </div>
    );
  }
}

export default App;
