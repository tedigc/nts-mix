/* global gapi */
import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Main, Wrapper } from './components';
import { initClient } from './utils/auth';
import AuthContext from './contexts/AuthContext';
import Routes from './Routes';
import './index.css';

const App = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [gapiReady, setGapiReady] = useState(false);

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

  return (
    <AuthContext.Provider value={{ isAuthorized, gapiReady, setIsAuthorized }}>
      <BrowserRouter>
        <Main>
          <Wrapper>
            <Routes />
          </Wrapper>
        </Main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
