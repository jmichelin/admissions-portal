import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, getData, statusUpdate, clearData, ...rest }) => (
  <Route {...rest}
    render={props => (
    localStorage.token ? (<Component getData={getData} clearData={clearData} statusUpdate={statusUpdate} {...rest}/>) : ( <Redirect to={{pathname: '/'}}/>))} />
);

export const PublicRoute = ({ component: Component, updateState, clearData, ...rest }) => (
  <Route {...rest}
    render={props => (
    !localStorage.token ? (<Component {...props} updateState={updateState} clearData={clearData} />) : ( <Redirect to={{pathname: '/dashboard'}}/>))} />
);


export const NoMatch = ({ component: Component, ...rest }) => (
  <Route {...rest}
    render={props => (
      !localStorage.token ? ( <Redirect to={{pathname: '/'}}/>) : ( <Redirect to={{pathname: '/dashboard'}}/>))} />
);
