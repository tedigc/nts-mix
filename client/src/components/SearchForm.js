import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

class SearchForm extends Component {
  state = {
    url: "",
    searching: false
  };

  searchForTracklist = e => {
    e.preventDefault();
    this.setState({ searching: true });
    this.props.updateMix({
      dj: "",
      description: "",
      locationDate: "",
      tracklist: []
    });
    const { url } = this.state;
    axios
      .post("/api/nts/tracklist", { url })
      .then(result => {
        this.setState({ searching: false });
        this.props.updateMix(result.data);
      })
      .catch(err => {
        this.setState({ searching: false });
        this.props.updateError(err.response.data.message);
      });
  };

  // Returns a context-sensitive search button
  searchButton = () => {
    const { searching } = this.state;
    if (searching) {
      return (
        <button className="search-button" disabled={true}>
          <i className="fas fa-spinner spinner" />
        </button>
      );
    }
    return (
      <button className="search-button">
        <i className="fas fa-search" />
      </button>
    );
  };

  // Update the contents of the search input.
  handleChange = e => {
    e.preventDefault();
    if (e.target.name === "search-input") {
      this.setState({ url: e.target.value });
    }
  };

  render() {
    const { searching, url } = this.state;
    return (
      <form onSubmit={this.searchForTracklist}>
        {this.searchButton()}
        <div className="search-wrapper">
          <input
            type="text"
            name="search-input"
            value={url}
            placeholder="Paste an NTS mix URL here..."
            disabled={searching}
            onChange={this.handleChange}
          />
        </div>
      </form>
    );
  }
}

SearchForm.propTypes = { updateMix: PropTypes.func.isRequired };
export default SearchForm;
