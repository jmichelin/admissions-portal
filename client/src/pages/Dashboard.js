import React, { Component } from 'react';

import Hero from '../components/hero';
import ProgramSelect from '../components/dashboard-program-select';
import OpportunityList from '../components/dashboard-opportunity-list';

import { CAMPUSES, FULL_TIME_PROGRAMS, GALVANIZE_BASE_URL, HERO_TEXT } from '../constants';
import inputs from '../components/forms/inputs/select-inputs';


class Dashboard extends Component {
  constructor(props){
    super(props);
    const programInputs = inputs.getProgramInputs(FULL_TIME_PROGRAMS);
    const campusInputs = inputs.getCampusInputs(CAMPUSES);

    this.state = {
      programInputs: programInputs,
      campusInputs: campusInputs,
      program: '',
      campus: '',
      errorMessage: '',
    };

    this.onProgramChange = this.onProgramChange.bind(this);
    this.onCampusChange = this.onCampusChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (!this.props.fetchedData) this.props.getData(true);
    if (this.props.location.state && this.props.location.state.calendarRefresh) {
      const {calendarRefresh} = this.props.location.state;
      if (calendarRefresh) this.props.getData(true);
    }
  }

onProgramChange(e, field) {
  if (e.target.value.includes('Remote')) {
    this.setState({
      program: e.target.value,
      campus: 'Remote',
      errorMessage: ''
    });
  } else {
    this.setState({
      program: e.target.value,
      campus: '',
      errorMessage: ''
    });
  }
}

onCampusChange(e, field) {
this.setState({
  campus: e.target.value,
  errorMessage: ''
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
  })

  const { program, campus } = this.state;
  const formData = { program, campus };

  if (this.formIsValid(formData)) {
    let query = `?campus=${formData.campus}&first_name=${this.props.user.first_name}&last_name=${this.props.user.last_name}&email=${this.props.user.email}`
    if (formData.program === 'Data Science') {
      window.location.href = `${GALVANIZE_BASE_URL}/data-science/application${query}`;
      return;
    } else if (formData.program.includes("Software Engineering")) {
      window.location.href = `${GALVANIZE_BASE_URL}/web-development/application${query}`;
      return;
    }
  } else {
    this.setState({
      errorMessage: 'Please select a program and campus.'
     });
  }
}


  render() {
      return (
      <div className="dashboard">
        <div className="container">
          <div>
            <div className="portal-inner">
              <Hero headline={HERO_TEXT.DASHBOARD.heroHeadline} description={HERO_TEXT.DASHBOARD.heroDescription}/>
              {this.props.opportunities && this.props.opportunities.length && !this.props.isLoading?
                <OpportunityList
                  internalStatusUpdate={this.state.internalStatusUpdate}
                  opps={this.props.opportunities}
                  user={this.props.user}/>
                :
                <ProgramSelect
                  isLoading={this.props.isLoading}
                  handleSubmit={this.handleSubmit}
                  programInputs={this.state.programInputs}
                  program={this.state.program}
                  isValid={this.isValid}
                  onProgramChange={this.onProgramChange}
                  campusInputs={this.state.campusInputs}
                  campus={this.state.campus}
                  errorMessage={this.state.errorMessage}
                  onCampusChange={this.onCampusChange}/>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
