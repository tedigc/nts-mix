import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { url : '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ url : event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { url } = this.state;
    axios.post('/api/submit', { url })
      .then((result) => {
        const { tracklist } = result.data;
        for(let track of tracklist) {
          console.log(track);
        }
      });
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="nts-link" value={this.state.url} onChange={this.handleChange} />
          <button>Submit</button>
        </form>
      </div>
    );
  }

}

export default App;
