import React, { Component } from "react";
import PropTypes from "prop-types";

class Track extends Component {
  render() {
    const { artist, title, message, status } = this.props;
    const icon = () => {
      if (status === "searching") {
        return <i className="fas fa-spinner spinner track-status" />;
      } else if (status === "success") {
        return <i className="fas fa-check track-status" />;
      } else if (status === "failed") {
        return <i className="fas fa-ban track-status" />;
      }
      return "";
    };

    return (
      <div>
        <span>
          {artist} - {title}
        </span>
        <div className="track-progress-container">
          <span className="track-message">{message}</span>
          {icon()}
        </div>
      </div>
    );
  }
}

Track.propTypes = {
  artist: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
};
export default Track;
