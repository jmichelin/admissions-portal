import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, getData, ...rest }) => (
  <Route {...rest}
    render={props => (
    localStorage.token ? (<Component getData={getData} {...rest}/>) : ( <Redirect to={{pathname: '/'}}/>))} />
);

export const PublicRoute = ({ component: Component, clearData, ...rest }) => (
  <Route {...rest}
    render={props => (
    !localStorage.token ? (<Component {...props} clearData={clearData} />) : ( <Redirect to={{pathname: '/dashboard'}}/>))} />
);


export const NoMatch = ({ component: Component, ...rest }) => (
  <Route {...rest}
    render={props => (
      !localStorage.token ? ( <Redirect to={{pathname: '/'}}/>) : ( <Redirect to={{pathname: '/dashboard'}}/>))} />
);
