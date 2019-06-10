import React, { Component } from 'react';

import Hero from '../components/hero';
import ProgramSelect from '../components/dashboard-program-select';
import ProgramList from '../components/dashboard-program-list';
import LoadingWheel from '../components/base/loader-orange';

import { CAMPUSES, HERO_TEXT } from '../constants';
import { APPLICATION_INPUTS} from '../components/forms/inputs/application-inputs';

import inputs from '../components/forms/inputs/select-inputs';

class Dashboard extends Component {
  constructor(props){
    super(props);

    const campusInputs = inputs.getCampusInputs(CAMPUSES);

    this.state = {
      campusInputs: campusInputs,
      program: props.user.program || '',
      campus: props.user.campus || '',
      errorMessage: '',
    };
  }

  componentDidMount() {
    if (!this.props.fetchedData) this.props.getData(true);
    if (this.props.location.state && this.props.location.state.dataRefresh) {
      const {dataRefresh} = this.props.location.state;
      if (dataRefresh) this.props.getData(true);
    }
    if (window && window.analytics) window.analytics.page('Dashboard')
  }

  onProgramChange = (e) => {
    this.setState({
      program: e.target.value,
      campus: '',
      errorMessage: ''
    });
  }

  onCampusChange = (e) => {
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
    let programInputs = inputs.getProgramInputs(APPLICATION_INPUTS, this.props.applications)
    return (
      <div className="dashboard">
        <div className="container">
          <div>
            <div className="portal-inner">
              <Hero
                headline={HERO_TEXT.DASHBOARD.heroHeadline}
                description={HERO_TEXT.DASHBOARD.heroDescription}
              />
              {!this.props.isLoading ? (
                <div>
                  {this.props.applications.length > 0 && (
                    <ProgramList
                      applications={this.props.applications}
                      internalStatusUpdate={this.state.internalStatusUpdate}
                      opps={this.props.applications}
                      user={this.props.user}
                    />
                  )}
                  {programInputs.options.length > 0 && (
                    <ProgramSelect
                      isLoading={this.props.isLoading}
                      programInputs={programInputs}
                      program={!this.props.applications.length ? this.state.program || this.props.user.program : this.state.program}
                      isValid={this.isValid}
                      onProgramChange={this.onProgramChange}
                      campusInputs={this.state.campusInputs}
                      campus={!this.props.applications.length ? this.state.campus || this.props.user.campus : this.state.campus}
                      errorMessage={this.state.errorMessage}
                      onCampusChange={this.onCampusChange}
                      programSelected={!!this.state.program || this.props.user.program}
                      hasExistingApps={this.props.applications.length}
                    />
                  )}
                </div>
              ) : (
                <div className="program-select column-headline">
                  <h4 className="column-headline">Looking for active applications...</h4>
                  <LoadingWheel/>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
