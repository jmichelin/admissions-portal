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
      user: {}
    }

    this.setOpps = this.setOpps.bind(this);
    this.clearData = this.clearData.bind(this);
  }

  setOpps(result) {
    if (result) {
      this.setState({
        opportunities: result.opportunities,
        user:result.user
      })
    }
  }

  clearData() {
      this.setState({
        opportunities: [],
        user:{}
      })
  }

render() {
      return (
      <div>
        <Header/>
          <main>
          <Switch>
            <PublicRoute exact path='/' clearData={this.clearData} component={Home}/>
            <PrivateRoute exact path='/dashboard' setOpps={this.setOpps} opportunities={this.state.opportunities} user={this.state.user}component={Dashboard}/>
            <PrivateRoute exact path='/coding-challenge' opportunities={this.state.opportunities} user={this.state.user} component={CodingChallenge}/>
            <NoMatch/>
          </Switch>
          </main>
      </div>
    )
  }
}

export default App;
