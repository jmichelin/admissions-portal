import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, user, opportunities, ...rest }) => (
  <Route {...rest}
    render={props => (
    localStorage.token ? (<Component {...props}/>) : ( <Redirect to={{pathname: '/'}}/>))} />
);

export const PublicRoute = ({ component: Component, ...rest }) => (
  <Route {...rest}
    render={props => (
    !localStorage.token ? (<Component {...props} />) : ( <Redirect to={{pathname: '/dashboard'}}/>))} />
);


export const NoMatch = ({ component: Component, ...rest }) => (
  <Route {...rest}
    render={props => (
      !localStorage.token ? ( <Redirect to={{pathname: '/'}}/>) : ( <Redirect to={{pathname: '/dashboard'}}/>))} />
);
