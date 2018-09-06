import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Track = props => <div><span>{props.artist} - {props.title}</span></div>;

class Mix extends Component {
  render() {
    const { dj, description, tracklist } = this.props;
    const tracklistComponent = tracklist.map((track, key) =>
      <Track key={key} artist={track.artist} title={track.title}/>);

    return (
      <div className="mix-box">
        <h1>{dj.toUpperCase()}</h1>
        <p>{description}</p>
        <hr/>
        {tracklistComponent}
      </div>
    );
  }
}

Mix.propTypes = {
  dj: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  locationDate: PropTypes.string.isRequired,
  tracklist: PropTypes.array.isRequired,
};

export default Mix;
