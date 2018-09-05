import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './App';
import TracklistPage from './routes/TracklistPage';

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Route path='/' component={App} exact />
      <Route path='/tracklist' component={TracklistPage}/>
    </div>
  </BrowserRouter>,
  document.getElementById('root'),
);
