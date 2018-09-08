import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Track from './Track';
import { createPlaylist, searchForVideo, addVideoToPlaylist } from '../util/youtube';

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

  createPlaylist = () => {
    this.setState({
      inProgress: 'searching',
      trackStatuses: Array(this.props.tracklist.length).fill('searching'),
    });
    const { dj, description, locationDate, tracklist } = this.props;
    const playlistTitle = `${dj} - ${locationDate} | NTS Mix`;
    const playlistId = 'PLXl_nPEBC_L2CY6-japw2FiM6_lDrRupL';

    // Handle each track's search and add in sequence
    let sequence = Promise.resolve();
    tracklist.forEach((track, key) => {
      sequence = sequence.then(() =>

        new Promise((resolve) => {
          // First, search for the video
          const searchQuery = `${track.artist} - ${track.title}`;
          searchForVideo(searchQuery)
            .then((searchResponse) => {
              // If found, add the first search result to the playlist
              const { videoId } = searchResponse.items[0].id;
              addVideoToPlaylist(playlistId, videoId)
                .then((addResponse) => {
                  const { trackStatuses } = this.state;
                  trackStatuses[key] = 'success';
                  this.setState({ trackStatuses });

                  if (key === tracklist.length - 1) {
                    this.setState({
                      inProgress: 'complete',
                      playlistURL: `https://www.youtube.com/playlist?list=${playlistId}`,
                    });
                  }
                  resolve();
                });
            })
            .catch((searchError) => {
              const { trackStatuses } = this.state;
              trackStatuses[key] = 'failed';
              this.setState({ trackStatuses });
              resolve();
            });
        }));
    });
  }

  button = () => {
    const { inProgress } = this.state;
    switch (inProgress) {
      case 'searching': return <div className="playlist-button-wrapper"><button className="playlist-button" onClick={this.createPlaylist} disabled><i className="fa fa-spinner spinner"></i> &nbsp; CREATING PLAYLIST </button></div>;
      case 'complete': return <div className="playlist-button-wrapper"><button className="playlist-button" onClick={this.openPlaylist}><i className="fas fa-external-link-alt"></i> &nbsp; OPEN </button></div>;
      default: return <div className="playlist-button-wrapper"><button className="playlist-button" onClick={this.createPlaylist}><i className="far fa-plus-square"></i> &nbsp; CREATE PLAYLIST </button></div>;
    }
  }

  openPlaylist = () => {
    const win = window.open(this.state.playlistURL, '_blank');
    win.focus();
  }

  tracklist() {
    const { trackMessages, trackStatuses } = this.state;
    const { tracklist } = this.props;
    if (tracklist.length === 0) return <h2 className="dark">NO TRACKLIST PROVIDED</h2>;
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
      <div className="mix-box">
        <h1>{dj.toUpperCase()}</h1>
        <p>{description}</p>
        <hr/>
        {this.tracklist()}
        {tracklist.length > 0 && this.button()}
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
