import React from 'react';
import { Page } from './components';
import { useLocation, Switch, Route } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import SearchPage from './pages/SearchPage';
import MixPage from './pages/MixPage';
import './index.css';

const transition = {
  unmountOnExit: true,
  classNames: 'fade',
  timeout: { enter: 300, exit: 300 }
};

const routes = [
  { path: '/', name: 'Search', component: SearchPage, exact: true },
  { path: '/:artist/:episode', name: 'Mix', component: MixPage, exact: true }
];

const Routes = () => {
  const location = useLocation();
  return (
    <TransitionGroup>
      <CSSTransition key={location.key} {...transition}>
        <Page>
          <Switch location={location}>
            {routes.map((route, index) => (
              <Route key={index} {...route} />
            ))}
          </Switch>
        </Page>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default Routes;
