import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './App';
import TracklistPage from './routes/TracklistPage';

import Test from './Test';

ReactDOM.render(
  <Test/>,
  document.getElementById('root')
);

// ReactDOM.render(
//   <BrowserRouter>
//     <div>
//       <Route exact path='/'          component={App}/>
//       <Route       path='/tracklist' component={TracklistPage}/>
//     </div>
//   </BrowserRouter>,
//   document.getElementById('root')
// );