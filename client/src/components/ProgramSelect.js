import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PROGRAM_SELECT_TEXT } from '../constants';
import { APPLICATION_INPUTS } from './forms/inputs/application-inputs';
import Select from '../components/forms/select';
import utils from '../helpers/utils';

class ProgramSelect extends Component {
  retrieveApp(program) {
    const foundApp = APPLICATION_INPUTS.find(e => e.name === program)

    if (foundApp) {
      const admissionsProcess = utils.getStage(this.props.program);
      return ({
        courseProduct: foundApp.courseProduct,
        courseType: foundApp.courseType,
        admissionsProcess: admissionsProcess.process,
      })
    }
  }

  render() {
    return (
      <div className="program-select application-row">
        <h4>{PROGRAM_SELECT_TEXT.headlineText}</h4>
        <p className="section-row">
          {!this.props.hasExistingApps ? PROGRAM_SELECT_TEXT.noApplicationsText : PROGRAM_SELECT_TEXT.existingApplicationsText}
        </p>
        <div className="form">
          <div className="form-group">
            <Select name="select-normal"
              label='Select a Program'
              fieldName=""
              options={this.props.programInputs.options}
              className="select"
              showError={this.props.submitAttempted && !this.props.isValid('program')}
              currentSelection={this.props.program}
              value={this.props.program}
              onOptionClick={this.props.onProgramChange}
            />
          </div>
          <div className="form-group">
            <Select name="select-normal"
              label='Select a Campus'
              id="campus"
              fieldName=""
              options={this.props.campusInputs.options}
              className="select"
              showError={this.props.submitAttempted && !this.props.isValid('campus')}
              currentSelection={this.props.campus}
              value={this.props.campus}
              onOptionClick={this.props.onCampusChange}
              disabled={!this.props.programSelected}
            />
          </div>
            <div className="action">
            <Link
              to={{
                pathname: '/application',
                state: {
                  program: this.retrieveApp(this.props.program),
                  campus: this.props.campus
                }
              }}
            >
              <button className="button-primary" disabled={!this.props.program || !this.props.campus}>
                Start Your Application
              </button>
            </Link>
          </div>
        </div>
        <span className="form-note form-error">{this.props.errorMessage}</span>
        {!this.props.hasExistingApps && <p className="citation">{PROGRAM_SELECT_TEXT.citationText1}</p>}
        <p className="citation">
          Questions? Reach out to <a href="mailto:admissions@galvanize.com">admissions@galvanize.com</a> and we'd be happy to help.
        </p>
      </div>
    )
  }
}

export default ProgramSelect;
