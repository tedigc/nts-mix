import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Track from './Track';
import AuthContext from '../contexts/AuthContext';
import youtube from '../util/youtube';
import asyncForEach from '../util/async';
import { logInOut } from '../util/auth';

class Mix extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'default',
      playlistURL: '',
      trackMessages: Array(this.props.tracklist.length).fill(''),
      trackStatuses: Array(this.props.tracklist.length).fill(''),
    };
  }

  createPlaylist = async () => {
    await this.setState({
      inProgress: 'searching',
      trackStatuses: Array(this.props.tracklist.length).fill('searching'),
    });
    const { dj, description, locationDate, tracklist } = this.props;
    const playlistTitle = `${dj} - ${locationDate} | NTS Mix`;

    // Create the playlist and extract its ID
    const createResponse = await youtube.createPlaylist(playlistTitle, description);
    const playlistId = createResponse.id;
    // const playlistId = 'PLQ3YpXF4Wmw-KCQdRuG95gAQqEl_Y7C5d';

    // Search for each track, and add it to the newly created playlist
    await asyncForEach(tracklist, async (track, i) => {
      const { trackStatuses } = this.state;
      const searchQuery = `${track.artist} - ${track.title}`;
      const searchResponse = await youtube.searchForVideo(searchQuery);

      // If no results are found, change the status/icon and process the next track
      if (searchResponse.items.length === 0) {
        trackStatuses[i] = 'failed';
        await this.setState({ trackStatuses });
        return;
      }

      // Otherwise, add the video to the playlist
      const { videoId } = searchResponse.items[0].id;
      await youtube.addVideoToPlaylist(playlistId, videoId);
      trackStatuses[i] = 'success';
      await this.setState({ trackStatuses });
    });

    // Once all tracks have been processed, make the playlist available to open
    this.setState({
      inProgress: 'complete',
      playlistURL: `https://www.youtube.com/playlist?list=${playlistId}`,
    });
  }

  button = (isAuthorized, gapiReady) => {
    const { inProgress } = this.state;
    switch (inProgress) {
      case 'searching': return <div className="playlist-button-wrapper"><button className="playlist-button" onClick={this.createPlaylist} disabled><i className="fa fa-spinner spinner"></i> &nbsp; CREATING PLAYLIST </button></div>;
      case 'complete': return <div className="playlist-button-wrapper"><button className="playlist-button" onClick={this.openPlaylist}><i className="fas fa-external-link-alt"></i> &nbsp; OPEN </button></div>;
      default:
        if (isAuthorized && gapiReady) return <div className="playlist-button-wrapper"><button className="playlist-button" onClick={this.createPlaylist}><i className="far fa-plus-square"></i> &nbsp; CREATE PLAYLIST </button></div>;
        return <div className="playlist-button-wrapper"><button className="playlist-button" onClick={logInOut} ><i class="fas fa-user"></i> &nbsp; LOG IN TO CREATE PLAYLIST </button></div>;
    }
  }

  openPlaylist = () => {
    const win = window.open(this.state.playlistURL, '_blank');
    win.focus();
  }

  tracklist() {
    const { trackMessages, trackStatuses } = this.state;
    const { tracklist } = this.props;
    if (tracklist.length === 0) return <div className="error">NO TRACKLIST PROVIDED</div>;
    return tracklist.map((track, key) =>
      <Track
        key={key}
        artist={track.artist}
        title={track.title}
        message={trackMessages[key]}
        status={trackStatuses[key]}
      />);
  }

  render() {
    const { dj, description, tracklist } = this.props;
    return (
      <div className="panel">
        <div className="panel-inner-wrapper">
          <h1>{dj.toUpperCase()}</h1>
          <p>{description}</p>
          <hr/>
          {this.tracklist()}
          <AuthContext.Consumer>
            { ({ isAuthorized, gapiReady }) => tracklist.length > 0 && this.button(isAuthorized, gapiReady) }
          </AuthContext.Consumer>
        </div>
      </div>
    );
  }
}

Mix.propTypes = {
  dj: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  locationDate: PropTypes.string.isRequired,
  tracklist: PropTypes.array.isRequired,
  updateError: PropTypes.func.isRequired,
};
export default Mix;
