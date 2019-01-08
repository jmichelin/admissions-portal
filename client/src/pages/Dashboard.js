import React, { Component } from 'react';

import Select from '../components/forms/select';
import inputs from '../components/forms/inputs/select-inputs';

import { CAMPUSES, FULL_TIME_PROGRAMS } from '../constants';


class Dashboard extends Component {
  constructor(props){
    super(props);
    const programInputs = inputs.getProgramInputs(FULL_TIME_PROGRAMS);
    const getCampusInputs = inputs.getCampusInputs(CAMPUSES);

    this.state = {
      user: {},
      programInputs: programInputs
    };
  }

  logout() {
    localStorage.removeItem('token');
    this.setState({
      redirectToHome: true
    })
  }

  componentDidMount() {
    const API_URL = '/auth'
    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
    }).then(res => res.json())
      .then(result => {
        if (result.user) {
          this.setState({
            user: result.user
          })
        } else {
          this.logout();
        }
      }).catch(err => console.log(err))
  }


  render() {
    return (
      <div className="dashboard">
        <div className="container">
          <h2>Admissions Portal Dashboard</h2>
          <h5>Welcome {this.state.user.first_name}!</h5>
          <div>
            <div className="section-header">
              <h4>Current Applications</h4>
            </div>
            <p>Looks like you don't have any active applications. Select a program below to start your application.</p>
              <div className="form-group">
                  <Select name="select-normal"
                  label='Select a Program'
                  fieldName="Campus__c"
                  id="modal-campus"
                  options={this.state.programInputs.options}
                  className="select"
                  showError={this.state.submitAttempted && !this.isValid('Campus__c')}
                  currentSelection={this.state.campusValue || this.props.campusName}
                  onOptionClick={this.onCampusChange}
                  disabled={false}
                  />
              </div>
            <div className="action">
            <button className="button-primary">Start Your Application</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
