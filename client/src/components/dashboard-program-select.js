import React, { Component } from 'react';

import Select from '../components/forms/select';

class ProgramSelect extends Component {
  constructor(props){
    super(props);

    this.state = {
    }
  }


  render() {
    let loadingWheel =
    <div className="program-select">
      <p className="section-row">Looking for active applications...</p>
    </div>


    let programSelectForm =
    <div className="program-select">
      <p className="section-row">Looks like you don't have any active applications. Select a program and campus below to start your application:</p>
        <form onSubmit={this.props.handleSubmit}>
          <div className="form-group">
                <Select name="select-normal"
                label='Select a Program'
                fieldName=""
                options={this.props.programInputs.options}
                className="select"
                showError={this.props.submitAttempted && !this.props.isValid('program')}
                currentSelection={this.props.program}
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
                onOptionClick={this.props.onCampusChange}
                program={this.props.program}
                />
            </div>
            <div className="action">
            <button className="button-primary" type="submit">Start Your Application</button>
            </div>
        </form>
        <span className="form-note form-error">{ this.props.errorMessage }</span>
        <p className="citation">Once you submit an application you can log back into this portal to complete the rest of the admissions process.</p>
      </div>

  return (
    <div>
      { this.props.isLoading ? loadingWheel : programSelectForm}
    </div>
    )
  }
}

export default ProgramSelect;
