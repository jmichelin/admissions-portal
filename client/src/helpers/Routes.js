import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest}
    render={props => (
    localStorage.token ? (<Component {...props} />) : ( <Redirect to={{pathname: '/'}}/>))} />
);

export const PublicRoute = ({ component: Component, ...rest }) => (
  <Route {...rest}
    render={props => (
    !localStorage.token ? (<Component {...props} />) : ( <Redirect to={{pathname: '/dashboard'}}/>))} />
);
