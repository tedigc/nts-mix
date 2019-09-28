/* global gapi */
import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

import { Main, Wrapper, Mix, SearchForm, LoginButton } from './components';
import AuthContext from './contexts/AuthContext';
import { initClient } from './utils/auth';
import './index.css';

const transition = {
  unmountOnExit: true,
  classNames: 'fade',
  timeout: 1000
};

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
      <Main>
        <Wrapper>
          <SearchForm
            onSubmit={newMix => {
              setMixIn(true);
              setMix(newMix);
            }}
            resetMix={resetMix}
          />
          <br />

          <CSSTransition in={mixIn} {...transition}>
            <div>{mix && <Mix mix={mix} />}</div>
          </CSSTransition>
          <br />

          <LoginButton />
        </Wrapper>
      </Main>
    </AuthContext.Provider>
  );
};

export default App;
