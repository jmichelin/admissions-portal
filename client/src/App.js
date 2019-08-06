import React, { Component } from 'react';
import { Switch, withRouter } from 'react-router-dom';
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

class App extends Component {
  state = {
    applications: [],
    leads: [],
    user: {},
    isLoading: true,
    fetchedData: false,
    programSelect: ''
  }

  clearData = () => {
    localStorage.removeItem('token');
    this.setState({
      applications: [],
      leads: [],
      user:{},
      fetchedData: false,
      isLoading: false
    })
  }

  setApplications = (result) => {
    if (result.message === 'jwt expired' || result.message === 'jwt malformed' || result.message === 'Your session has expired. Please log back in.') {
      this.clearData()
    } else if (result.data && result.data.applications && result.data.user) {
      const applications = result.data.applications.map(app => {
        const stageObj = utils.getStage(app);
        app.formalName = stageObj.name;
        app.currentStep = stageObj.step;
        app.admissionsProcess = stageObj.process;
        return app;
      })

      this.setState({
        applications,
        user: result.data.user,
        isLoading: false,
        fetchedData: true,
      })
    } else {
      // no applications and already fetched
      this.setState({ isLoading: false, fetchedData: true })
    }
  }

  getData = (refresh) => {
    if ((!this.state.fetchedData && localStorage.token) || (refresh && localStorage.token)) {
      this.setState({ isLoading: true }, () => {
        fetch('/api/v1/user', {
          headers: { Authorization: `Bearer ${localStorage.token}` },
        })
          .then(res => res.json())
          .then(result => {
             this.setApplications(result); })
          .catch((err) => { console.log(err); this.clearData() })
      })
    } else {
      this.clearData()
    }
  }

  updateState = (updatedState, redirect) => {
    this.setState({...updatedState}, () =>
      this.props.history.push(redirect)
    )
  }

  statusUpdate = (id, status) => {
    let newOpps = this.state.applications.map(opp => {
      if (opp.id === id) opp.currentStep = status
      return opp;
    })
    this.setState({ applications: newOpps })
  }

  render() {
    return (
      <div>
        <Header clearData={this.clearData}/>
          <main>
          <Switch>
            <PublicRoute exact path='/' clearData={this.clearData} updateState={this.updateState} component={Home}/>
            <PublicRoute exact path='/forgot-password' component={ForgotPassword}/>
            <PublicRoute path="/reset:token" component={ResetPassword}/>
            <PrivateRoute exact path='/dashboard'{...this.state}  getData={this.getData} statusUpdate={this.statusUpdate} component={Dashboard}/>
            <PrivateRoute exact path='/coding-challenge' {...this.state} getData={this.getData} statusUpdate={this.statusUpdate} component={CodingChallenge}/>
            <PrivateRoute exact path='/python-challenge' {...this.state} getData={this.getData} statusUpdate={this.statusUpdate} component={PythonChallenge}/>
            <PrivateRoute exact path='/book-interview' {...this.state} getData={this.getData} statusUpdate={this.statusUpdate} component={BookInterview}/>
            <PrivateRoute exact path='/book-interview-dsi' {...this.state} getData={this.getData} statusUpdate={this.statusUpdate} component={BookInterviewDSI}/>
            <PrivateRoute path="/application" {...this.state} clearData={this.clearData} statusUpdate={this.statusUpdate} component={Application} />
            <NoMatch/>
          </Switch>
          </main>
      </div>
    )
  }
}

export default withRouter(App);
