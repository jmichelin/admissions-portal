import React, { Component } from 'react';
import Hero from '../components/hero';
import ProgramSelect from '../components/ProgramSelect';
import ProgramList from '../components/ProgramList';
import LoadingWheel from '../components/base/LoadingWheel';
import { HERO_TEXT } from '../constants';
import { APPLICATION_INPUTS } from '../components/forms/inputs/application-inputs';

class Dashboard extends Component {
  constructor(props){
    super(props);

    this.state = {
      program: props.user.program || '',
      campus: props.user.campus || '',
      errorMessage: ''
    };
  }

  componentDidMount() {
    if (!this.props.fetchedData) this.props.getData(true);
    if (this.props.location.state && this.props.location.state.dataRefresh) {
      this.props.getData(true);
    }
    if (window && window.analytics) window.analytics.page('Dashboard')
  }

  onProgramChange = (e) => {
    const program = e.target.value;

    this.setState({
      program: program,
      errorMessage: ''
    });
  }

  onCampusChange = (e) => {
    this.setState({ campus: e.target.value, errorMessage: '' });
  }

  isValid(fieldName) {
    return !!this.state[fieldName];
  }

  formIsValid(data) {
    return !!data.program;
  }

  programInputs(applications = null) {
    let options = APPLICATION_INPUTS.map(program => {
      return {
        name: program.name,
        value: program.name,
        courseProduct: program.courseProduct,
        courseType: program.courseType,
      };
    })

    if (applications && applications.length > 0) {
      options = options.filter((option) => (
        !applications.find(app => app.course_product === option.courseProduct)
      ));
    }

    return  {
      id: 'program',
      label: 'Program',
      type: 'select',
      value: '',
      options,
    };
  }

  render() {
    const programInputs = this.programInputs(this.props.applications)

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
                      user={this.props.user}
                      getData={this.props.getData}
                    />
                  )}
                  {programInputs.options.length > 0 && (
                    <ProgramSelect
                      isLoading={this.props.isLoading}
                      programInputs={programInputs}
                      program={!this.props.applications.length ? this.state.program || this.props.user.program : this.state.program}
                      isValid={this.isValid}
                      onProgramChange={this.onProgramChange}
                      campus={!this.props.applications.length ? this.state.campus || this.props.user.campus : this.state.campus}
                      errorMessage={this.state.errorMessage}
                      onCampusChange={this.onCampusChange}
                      campusSelected={!!this.state.campus}
                      hasExistingApps={this.props.applications.length}
                    />
                  )}
                </div>
              ) : (
                <div className="program-select column-headline">
                  <h4 className="column-headline">Retrieving active applications...</h4>
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
