import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from './helpers/Routes';

import Header from './components/header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CodingChallenge from './pages/CodingChallenge';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      user: {},
      opportunities: []
    };

  }

  componentWillMount() {
    const API_URL = '/api/v1/user'

    if (localStorage.token) {
      fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        },
      }).then(res => res.json())
        .then(result => {
          if (result.opportunities) {
            this.setState({
              opportunities: result.opportunities,
              user:result.user,
              isLoading: false
            })
          } else {
            this.setState({
              noOpportunities: true,
              isLoading: false
            })
          }
        }).catch(err => console.log(err))
    }
  }

render() {
      return (
      <div>
        <Header/>
          <main>
          <Switch>
            <PublicRoute exact path='/' component={Home}/>
            <PrivateRoute exact path='/dashboard' component={Dashboard} user={this.state.user} opportunities={this.state.opportunities}/>
            <PrivateRoute exact path='/coding-challenge' component={CodingChallenge} user={this.state.user} opportunities={this.state.opportunities}/>
          </Switch>
          </main>
      </div>
    )
  }
}

export default App;
