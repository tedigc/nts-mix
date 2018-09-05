import React from 'react';
import PropTypes from 'prop-types';

class Track extends React.Component {
  render() {
    const { artist, title } = this.props;
    return (
      <div>
        <span>{artist} - {title}</span>
      </div>
    );
  }
}

Track.propTypes = {
  artist: PropTypes.string,
  title: PropTypes.string,
};

export default Track;
