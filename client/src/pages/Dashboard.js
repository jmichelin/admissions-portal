import React, { Component } from 'react';

import Hero from '../components/hero';
import ProgramSelect from '../components/dashboard-program-select';
import ProgramList from '../components/dashboard-program-list';

import { CAMPUSES, FULL_TIME_PROGRAMS, HERO_TEXT } from '../constants';
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
      errorMessage: ''
    };

    this.onProgramChange = this.onProgramChange.bind(this);
    this.onCampusChange = this.onCampusChange.bind(this);
  }

  componentDidMount() {
    if (!this.props.fetchedData) this.props.getData(true);
    if (this.props.location.state && this.props.location.state.calendarRefresh) {
      const {calendarRefresh} = this.props.location.state;
      if (calendarRefresh) this.props.getData(true);
    }
    if (window && window.analytics) window.analytics.page('Dashboard')
  }

  onProgramChange(e) {
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

  onCampusChange(e) {
    this.setState({
      campus: e.target.value,
      errorMessage: ''
    });
  }

  isValid(fieldName) {
    return !!this.state[fieldName];
  }

  formIsValid(data) {
    return !!data.program;
  }

  render() {
    return (
      <div className="dashboard">
        <div className="container">
          <div>
            <div className="portal-inner">
              <Hero headline={HERO_TEXT.DASHBOARD.heroHeadline} description={HERO_TEXT.DASHBOARD.heroDescription}/>
              {(this.props.applications.length || this.props.applications.length) && !this.props.isLoading ? (
                <ProgramList
                  applications={this.props.applications}
                  internalStatusUpdate={this.state.internalStatusUpdate}
                  opps={this.props.applications}
                  user={this.props.user}
                />
              ) : (
                <ProgramSelect
                  isLoading={this.props.isLoading}
                  programInputs={this.state.programInputs}
                  program={this.state.program}
                  isValid={this.isValid}
                  onProgramChange={this.onProgramChange}
                  campusInputs={this.state.campusInputs}
                  campus={this.state.campus}
                  errorMessage={this.state.errorMessage}
                  onCampusChange={this.onCampusChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
