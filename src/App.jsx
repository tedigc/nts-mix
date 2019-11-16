/* global gapi */
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Main, Wrapper, Mix, SearchForm, LoginButton } from './components';
import AuthContext from './contexts/AuthContext';
import { initClient } from './utils/auth';
import './index.css';
import SearchPage from './pages/SearchPage';
import MixPage from './pages/MixPage';
import Temp from './Temp';

const transition = {
  unmountOnExit: true,
  classNames: 'fade',
  timeout: 1000
};

const routes = [
  { path: '/', name: 'Search', component: SearchPage, exact: true },
  { path: '/:artist/:episode', name: 'Mix', component: MixPage, exact: true }
];

const App = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [gapiReady, setGapiReady] = useState(false);
  const [mixIn, setMixIn] = useState(false);
  const [mix, setMix] = useState(undefined);

  useEffect(() => {
    // Load the Google API script on mount
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      setGapiReady(true);
      gapi.load('client:auth2', initClient.bind(null, setIsAuthorized));
    };
    document.body.appendChild(script);
  }, []);

  const resetMix = () => {
    setMixIn(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthorized, gapiReady, setIsAuthorized }}>
      <BrowserRouter>
        <Main>
          <Wrapper>
            <Temp />
          </Wrapper>
        </Main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
