import React, { Component } from 'react';

import ProgramSelect from '../components/dashboard-program-select';
import OpportunityList from '../components/dashboard-opportunity-list';

import { CAMPUSES, FULL_TIME_PROGRAMS, GALVANIZE_BASE_URL } from '../constants';
import inputs from '../components/forms/inputs/select-inputs';


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
      campus: '',
      errorMessage: '',
      opportunities: [],
      noOpportunities: false,
      isLoading: true
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

  componentWillMount() {
    const API_URL = '/api/v1/user'
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
    let query = `?campus=${formData.campus}&first_name=${this.state.user.first_name}&last_name=${this.state.user.last_name}&email=${this.state.user.email}`
    if (formData.program === 'Data Science') {
      window.location.href = `${GALVANIZE_BASE_URL}/data-science/application${query}`;
    } else if (formData.program.includes("Web Development")) {
      window.location.href = `${GALVANIZE_BASE_URL}/web-development/application${query}`;
    }
    } else {
    this.setState({
      isLoading: false,
      errorMessage: 'There was a problem with your request. Please try again.'
     });
  }
}


  render() {
      return (
      <div className="dashboard">
        <div className="container">
          <div>
            <h3 className="portal-title">Admissions Portal Dashboard</h3>
            <div className="portal-inner">
              <div className="section-header">
                <h4>Your Current Applications</h4>
              </div>
              {this.state.opportunities.length ?
                <OpportunityList
                  opps={this.state.opportunities}
                  user={this.state.user}/>
                :
                <ProgramSelect
                  isLoading={this.state.isLoading}
                  handleSubmit={this.handleSubmit}
                  programInputs={this.state.programInputs}
                  program={this.state.program}
                  isValid={this.isValid}
                  onOptionClick={this.props.onProgramChange}
                  campusInputs={this.state.campusInputs}
                  campus={this.state.campus}
                  onCampusChange={this.onCampusChange}/>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
