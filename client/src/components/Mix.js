import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Track from './Track';
import { createPlaylist } from '../util/youtube';

class Mix extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackMessages: Array(this.props.tracklist.length).fill(''),
      trackStatuses: Array(this.props.tracklist.length).fill(''),
    };
  }

  createPlaylist = () => {
    const { trackStatuses, trackMessages } = this.state;
    const { dj, description, locationDate, tracklist } = this.props;
    this.setState({ trackStatuses: Array(this.props.tracklist.length).fill('searching') });

    createPlaylist(dj, description, locationDate)
      .then((response) => {
        console.log(response);
        const playlistId = response.id;
        console.log(`Created playlist ${playlistId}`);
        tracklist.forEach((track, key) => {

        });
      })
      .catch((error) => {
        if (error.code === 403) {
          this.props.updateError('You\'ve reached your daily playlist limit. You can create a maximum of 10 playlists per day, due to Google\'s polcy regarding playlist creation through their YouTube API.');
          // console.error('You\'re doing that too much.');
        }
      });
  }

  render() {
    const { trackMessages, trackStatuses } = this.state;
    const { dj, description, tracklist } = this.props;
    const tracklistComponent = tracklist.map((track, key) =>
      <Track
        key={key}
        artist={track.artist}
        title={track.title}
        message={trackMessages[key]}
        status={trackStatuses[key]}
      />);

    return (
      <div className="mix-box">
        <h1>{dj.toUpperCase()}</h1>
        <p>{description}</p>
        <hr/>
        {tracklistComponent}
        <br/>
        <button className="playlist-button" onClick={this.createPlaylist}><i className="far fa-plus-square"></i> &nbsp; CREATE PLAYLIST </button>
        <br/>
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
