import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { PrivateRoute, PublicRoute, NoMatch } from './helpers/Routes';

import Header from './components/header';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
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
    this.statusUpdate = this.statusUpdate.bind(this);
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
    const API_URL = '/api/v1/user';
    if ((!this.state.fetchedData && localStorage.token) || (refresh && localStorage.token)) {
      this.setState({isLoading: true}, () => {
        fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          },
        }).then(res => res.json())
          .then(result => {
            if (result.message === 'jwt expired' || result.message === 'jwt malformed') {
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
        })
      } else {
      this.setState({
        isLoading: false
      })
    }
  }

  statusUpdate(id, status) {
   let newOpps = this.state.opportunities.map(opp => {
     if (opp.id === id) opp.currentStep = status
      return opp;
   })
     this.setState({
       opportunities: newOpps
     })
  }

render() {
      return (
      <div>
        <Header clearData={this.clearData}/>
          <main>
          <Switch>
            <PublicRoute exact path='/' clearData={this.clearData} component={Home}/>
            <PublicRoute exact path='/forgot-password' component={ForgotPassword}/>
            <PublicRoute exact path="/reset/:token" component={ResetPassword}/>
            <PrivateRoute exact path='/dashboard'{...this.state}  getData={this.getData} statusUpdate={this.statusUpdate} component={Dashboard}/>
            <PrivateRoute exact path='/coding-challenge' {...this.state} getData={this.getData} statusUpdate={this.statusUpdate} component={CodingChallenge}/>
            <PrivateRoute exact path='/book-interview' {...this.state} getData={this.getData} statusUpdate={this.statusUpdate} component={BookInterview}/>
            <NoMatch/>
          </Switch>
          </main>
      </div>
    )
  }
}

export default App;
