import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from './helpers/Routes';

import Header from './components/header';
import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';

import './App.css';

class App extends Component {
  constructor(props){
    super(props);
  }

render() {
      return (
      <div>
        <Header/>
          <main>
          <Switch>
            <PublicRoute exact path='/' component={Home}/>
            <PrivateRoute exact path='/dashboard' component={Dashboard}/>
          </Switch>
          </main>
      </div>
    )
  }
}

export default App;
