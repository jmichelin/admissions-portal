import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from './helpers/Routes';

import Header from './components/header';
import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';

import './App.css';

class App extends Component {

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
