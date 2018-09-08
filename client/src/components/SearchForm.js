import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class SearchForm extends Component {
  state = {
    url: 'https://www.nts.live/shows/sun-cut/episodes/sun-cut-27th-november-2017',
    // url: 'https://www.nts.live/shows/guests/episodes/bonobo-presents-outlier-radio-21st-march-2016',
    // url: 'https://www.nts.live/shows/four-tet/episodes/four-tet-and-floating-points-live-from-brilliant-corners-10th-july-2017',
    searching: false,
  }

  searchForTracklist = (e) => {
    e.preventDefault();
    this.setState({ searching: true });
    this.props.updateMix({
      dj: '',
      description: '',
      locationDate: '',
      tracklist: [],
    });
    const { url } = this.state;
    axios.post('/api/nts/tracklist', { url })
      .then((result) => {
        this.setState({ searching: false });
        this.props.updateMix(result.data);
      })
      .catch((err) => {
        this.setState({ searching: false });
        this.props.updateError(err.response.data.message);
      });
  }

  // Returns a context-sensitive search button
  searchButton = () => {
    const { searching } = this.state;
    const { isAuthorized, gapiReady } = this.props;
    if (searching) {
      return (
        <button className="search-button" disabled={true}>
          <i className="fas fa-spinner spinner"></i>
        </button>
      );
    }
    return (
      <button className="search-button" disabled={!gapiReady || !isAuthorized}>
        <i className="fas fa-search"></i>
      </button>
    );
  }

  // Update the contents of the search input.
  handleChange = (e) => {
    e.preventDefault();
    if (e.target.name === 'search-input') {
      this.setState({ url: e.target.value });
    }
  }

  render() {
    const { searching, url } = this.state;
    const { isAuthorized, gapiReady } = this.props;
    const placeholderText = (isAuthorized) ? 'Paste an NTS mix URL here...' : 'Please log in to continue';
    return (
      <form onSubmit={this.searchForTracklist}>
        {this.searchButton()}
        <div className="search-wrapper">
          <input
            type="text"
            name="search-input"
            value={url}
            placeholder={placeholderText}
            disabled={!gapiReady || !isAuthorized || searching}
            onChange={this.handleChange}
          />
        </div>
      </form>
    );
  }
}

SearchForm.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  gapiReady: PropTypes.bool.isRequired,
  updateMix: PropTypes.func.isRequired,
};
export default SearchForm;
