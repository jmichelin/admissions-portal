import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { PrivateRoute, PublicRoute, NoMatch } from './helpers/Routes';

import Header from './components/header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CodingChallenge from './pages/CodingChallenge';

import utils from './helpers/utils';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      opportunities: [],
      user: {},
      stage: '',
      isLoading: true,
      fetchedData: false
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
    if (!this.state.opportunities.length && localStorage.token && !this.state.fetchedData) {
        fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          },
        }).then(res => res.json())
          .then(result => {
            if (result.message === 'jwt expired') {
              this.logout()
            }
            else if (result.data && result.data.opportunities && result.data.user) {
              this.setState({
                opportunities: result.data.opportunities,
                user:result.data.user,
                isLoading: false,
                fetchedData: true
              })
            } else {
              // no opportunities and already fetched
              this.setState({
                isLoading: false,
                fetchedData: true
              })
            }
          }).catch(err => {
            this.logout()
          })
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.setState({
      redirectToHome: true
    })
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
            <PrivateRoute exact path='/book-interview' setOpps={this.setOpps} isLoading={this.state.isLoading} opportunities={this.state.opportunities} user={this.state.user} component={CodingChallenge}/>
            <NoMatch/>
          </Switch>
          </main>
      </div>
    )
  }
}

export default App;
