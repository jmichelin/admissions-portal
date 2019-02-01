import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { PrivateRoute, PublicRoute, NoMatch } from './helpers/Routes';

import Header from './components/header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CodingChallenge from './pages/CodingChallenge';
import BookInterview from './pages/BookInterview';

import utils from './helpers/utils';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      opportunities: [],
      user: {},
      isLoading: true,
      fetchedData: false
    }

    this.getData = this.getData.bind(this);
    this.clearData = this.clearData.bind(this);
  }

  clearData() {
    localStorage.removeItem('token');
    this.setState({
      opportunities: [],
      user:{},
      fetchedData: false,
      isLoading: true
    })
  }


  getData(refresh) {
    if (refresh) { this.setState({isLoading: true}) }
    const API_URL = '/api/v1/user';
    if ((!this.state.fetchedData && localStorage.token) || refresh && localStorage.token) {
        fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          },
        }).then(res => res.json())
          .then(result => {
            if (result.message === 'jwt expired') {
              this.clearData()
            }
            else if (result.data && result.data.opportunities && result.data.user) {
              let opps = result.data.opportunities.map(opp => {
                let currentStep = opp.courseProduct === 'Web Development' ? utils.getSEIStage(opp) : utils.getDSIStage(opp);
                opp.currentStep = currentStep;
                return opp;
              })
              this.setState({
                opportunities: opps,
                user:result.data.user,
                isLoading: false,
                fetchedData: true,
              })
            } else {
              // no opportunities and already fetched
              this.setState({
                isLoading: false,
                fetchedData: true
              })
            }
          }).catch(err => {
            this.clearData()
          })
    } else {
      this.setState({
        isLoading: false
      })
    }
  }

render() {
      return (
      <div>
        <Header clearData={this.clearData}/>
          <main>
          <Switch>
            <PublicRoute exact path='/' clearData={this.clearData} component={Home}/>
            <PrivateRoute exact path='/dashboard'{...this.state}  getData={this.getData} component={Dashboard}/>
            <PrivateRoute exact path='/coding-challenge' {...this.state} getData={this.getData} component={CodingChallenge}/>
            <PrivateRoute exact path='/book-interview' {...this.state} getData={this.getData} component={BookInterview}/>
            <NoMatch/>
          </Switch>
          </main>
      </div>
    )
  }
}

export default App;
