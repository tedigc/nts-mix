import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// class TracklistPage extends Component {
//   render() {
//     return(
//       <div>
//         <h1>TRACKLIST PAGE</h1>
//         <Link to="/"><button>HOME</button></Link>
//       </div>
//     );
//   }
// }

function TracklistPage() {
  return (
    <div>
      <h1>TRACKLIST PAGE</h1>
      <Link to="/"><button>HOME</button></Link>
    </div>
  );
}

export default TracklistPage;
