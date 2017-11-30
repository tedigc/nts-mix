import React from 'react';
import PropTypes from 'prop-types';

class Track extends React.Component {

  render() {
    let { artist, title } = this.props;
    return (
      <div>
        <p>{artist} - {title}</p>
      </div>
    );
  }

}

Track.propTypes = {
  artist : PropTypes.string,
  title  : PropTypes.string
};

export default Track;