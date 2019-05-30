import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { PrivateRoute, PublicRoute, NoMatch } from './helpers/Routes';

import Application from './pages/Application';
import Header from './components/header';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import CodingChallenge from './pages/CodingChallenge';
import PythonChallenge from './pages/PythonChallenge'
import BookInterview from './pages/BookInterview';
import BookInterviewDSI from './pages/BookInterviewDSI';

import utils from './helpers/utils';
import { getStage } from './helpers/programs';


class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      opportunities: [],
      leads: [],
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
      leads: [],
      user:{},
      fetchedData: false,
      isLoading: true
    })
  }

  getData(refresh) {
    if ((!this.state.fetchedData && localStorage.token) || (refresh && localStorage.token)) {
      this.setState({isLoading: true}, () => {
        const API_URL = '/api/v1/user';
        fetch(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.token}` },
        }).then(res => res.json())
          .then(result => {
            if (result.message === 'jwt expired' || result.message === 'jwt malformed' || result.message === 'Your session has expired. Please log back in.') {
              this.clearData()
            }
            else if (result.data && result.data.opportunities && result.data.user) {
              let opps = result.data.opportunities.map(opp => {
                debugger;
                let stageObj = getStage(opp);

                let currentStep = stageObj.step;
                let admissionsProcess = stageObj.process;
                opp.currentStep = currentStep;
                opp.admissionsProcess = admissionsProcess;
                return opp;
              })
              this.setState({
                opportunities: opps,
                user:result.data.user,
                isLoading: false,
                fetchedData: true,
              })
            }
            else if (result.data && result.data.opportunities && result.data.user) {

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
      this.clearData()
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
            <PublicRoute path="/reset:token" component={ResetPassword}/>
            <PrivateRoute exact path='/dashboard'{...this.state}  getData={this.getData} statusUpdate={this.statusUpdate} component={Dashboard}/>
            <PrivateRoute exact path='/coding-challenge' {...this.state} getData={this.getData} statusUpdate={this.statusUpdate} component={CodingChallenge}/>
            <PrivateRoute exact path='/python-challenge' {...this.state} getData={this.getData} statusUpdate={this.statusUpdate} component={PythonChallenge}/>
            <PrivateRoute exact path='/book-interview' {...this.state} getData={this.getData} statusUpdate={this.statusUpdate} component={BookInterview}/>
            <PrivateRoute exact path='/book-interview-dsi' {...this.state} getData={this.getData} statusUpdate={this.statusUpdate} component={BookInterviewDSI}/>

            <PrivateRoute path="/application" {...this.state} statusUpdate={this.statusUpdate} component={Application}/>

            <NoMatch/>
          </Switch>
          </main>
      </div>
    )
  }
}

export default App;
