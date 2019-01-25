import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { PrivateRoute, PublicRoute, NoMatch } from './helpers/Routes';

import Header from './components/header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CodingChallenge from './pages/CodingChallenge';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      opportunities: [],
      user: {},
      isLoading: true
    }

    this.setOpps = this.setOpps.bind(this);
    this.clearData = this.clearData.bind(this);
  }

  clearData() {
      this.setState({
        opportunities: [],
        user:{}
      })
  }

  setOpps() {
    const API_URL = '/api/v1/user';
    if (!this.state.opportunities.length) {
        fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          },
        }).then(res => res.json())
          .then(result => {
            if (result.data.opportunities && result.data.user) {
              this.setState({
                opportunities: result.data.opportunities,
                user:result.data.user,
                scorecards: result.data.scorecards,
                isLoading: false
              })
            } else {
              this.setState({
                isLoading: false
              })
            }
          }).catch(err => {
            console.log(err)
          })
    }
  }

render() {
      return (
      <div>
        <Header/>
          <main>
          <Switch>
            <PublicRoute exact path='/' clearData={this.clearData} component={Home}/>
            <PrivateRoute exact path='/dashboard' setOpps={this.setOpps} isLoading={this.state.isLoading} opportunities={this.state.opportunities} user={this.state.user} component={Dashboard}/>
            <PrivateRoute exact path='/coding-challenge' setOpps={this.setOpps} isLoading={this.state.isLoading} opportunities={this.state.opportunities} user={this.state.user} component={CodingChallenge}/>
            <NoMatch/>
          </Switch>
          </main>
      </div>
    )
  }
}

export default App;
