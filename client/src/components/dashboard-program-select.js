import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Select from '../components/forms/select';
import LoadingWheel from '../components/base/loader-orange';

class ProgramSelect extends Component {
  constructor(props){
    super(props);
  }


  render() {
    let loadingWheel =
    <div className="program-select column-headline">
      <h4 className="column-headline">Looking for active applications...</h4>
      <LoadingWheel/>
        </div>


    let programSelectForm =
    <div className="program-select">
      <p className="section-row">Looks like you don't have any active applications. Select a program and campus below to start your application:</p>
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
            <div className="action">
            <Link to={{
                    pathname: '/application',
                    state: {
                      program: this.props.program,
                    }
                    }}>
                    <button className="button-primary">Start Your Application</button></Link>
            </div>
        </div>
        <span className="form-note form-error">{ this.props.errorMessage }</span>
        <p className="citation">Once you submit an application you can log back into this portal to complete the rest of the admissions process.</p>
        <p className="citation -thin">Questions? Reach out to <a href="mailto:admissions@galvanize.com">admissions@galvanize.com</a> and we'd be happy to help.</p>
    </div>

  return (
    <div>
      { this.props.isLoading ? loadingWheel : programSelectForm }
    </div>
    )
  }
}

export default ProgramSelect;
