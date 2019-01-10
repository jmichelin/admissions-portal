import React, { Component } from 'react';

import Select from '../components/forms/select';
import inputs from '../components/forms/inputs/select-inputs';

import { CAMPUSES, FULL_TIME_PROGRAMS, GALVANIZE_BASE_URL } from '../constants';


class Dashboard extends Component {
  constructor(props){
    super(props);
    const programInputs = inputs.getProgramInputs(FULL_TIME_PROGRAMS);
    const campusInputs = inputs.getCampusInputs(CAMPUSES);

    this.state = {
      user: {},
      programInputs: programInputs,
      campusInputs: campusInputs,
      program: '',
      campus: ''
    };

    this.onProgramChange = this.onProgramChange.bind(this);
    this.onCampusChange = this.onCampusChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

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

onProgramChange(e, field) {
  this.setState({
    program: e.target.value,
  });
}

onCampusChange(e, field) {
this.setState({
  campus: e.target.value,
});
}

isValid(fieldName) {
  return !!this.state[fieldName];
}

formIsValid(data) {
  return !!data.program && data.campus;
}

handleSubmit(event) {
  event.preventDefault();
  this.setState({
    submitAttempted: true,
    isLoading: true
  })

  const { program, campus } = this.state;
  const formData = { program, campus }

  if (this.formIsValid(formData)) {
    if (formData.program === 'Data Science') {
      window.location.href = `${GALVANIZE_BASE_URL}/data-science/application?campus=${formData.campus}`;
    } else if (formData.program.includes("Web Development")) {
      window.location.href = `${GALVANIZE_BASE_URL}/web-development/application?campus=${formData.campus}`;
    }
    } else {
    this.setState({ isLoading: false });
  }
}


  render() {
    return (
      <div className="dashboard">
        <div className="container">
          <div>
            <h3 className="portal-title">Admissions Portal Dashboard</h3>
            <h4 className="title-subtext">Welcome {this.state.user.first_name}!</h4>
            <div className="portal-inner">
              <div className="section-header">
                <h4>Current Applications</h4>
              </div>
              <p className="section-row">Looks like you don't have any active applications. Select a program and campus below to start your application.</p>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                      <Select name="select-normal"
                      label='Select a Program'
                      fieldName="Campus__c"
                      id="modal-campus"
                      options={this.state.programInputs.options}
                      className="select"
                      showError={this.state.submitAttempted && !this.isValid('program')}
                      currentSelection={this.state.program}
                      onOptionClick={this.onProgramChange}
                      />
                  </div>
                  <div className="form-group">
                      <Select name="select-normal"
                      label='Select a Campus'
                      fieldName="Campus__c"
                      id="modal-campus"
                      options={this.state.campusInputs.options}
                      className="select"
                      showError={this.state.submitAttempted && !this.isValid('campus')}
                      currentSelection={this.state.campus}
                      onOptionClick={this.onCampusChange}
                      />
                  </div>
                  <div className="action">
                  <button className="button-primary" type="submit">Start Your Application</button>
                  </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
