import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter, Route } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Route path='/' component={App}/>
    </div>
  </BrowserRouter>, 
  document.getElementById('root')
);