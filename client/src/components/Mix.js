import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Track from './Track';
import { createPlaylist, searchForVideo, addVideoToPlaylist } from '../util/youtube';

// /**
//  * Given an array of YouTube video IDs, add those videos to the playlist with the specified ID.
//  */
// export function addAllSongs(playlistId, tracklist) {
//   let sequence = Promise.resolve();
//   tracklist.forEach((track) => {
//     sequence = sequence.then(() =>
//       new Promise((resolve) => {
//         const searchQuery = `${track.artist} - ${track.title}`;
//         searchForVideo(searchQuery)
//           .then((response) => {
//             console.log(response);
//             resolve();
//           });
//         // const parameters = {
//         //   part: 'snippet',
//         //   snippet: {
//         //     playlistId,
//         //     resourceId: {
//         //       kind: 'youtube#video',
//         //       videoId: id,
//         //     },
//         //   },
//         // };

//         // const request = gapi.client.youtube.playlistItems.insert(parameters);
//         // request.execute((res) => {
//         //   console.log(res);
//         //   console.log(`Added song successfully : ${res.snippet.title}`);
//         //   resolve();
//         // });
//       }));
//   });
// }

class Mix extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackMessages: Array(this.props.tracklist.length).fill(''),
      trackStatuses: Array(this.props.tracklist.length).fill(''),
    };
  }

  createPlaylist = () => {
    this.setState({ trackStatuses: Array(this.props.tracklist.length).fill('searching') });
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
                  resolve();
                });
            });
        }));
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
