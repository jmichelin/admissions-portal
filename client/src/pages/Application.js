import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Joi from 'joi';

import AdmissionsProcessSteps from '../components/admissions-process-steps';
import Hero from '../components/hero';
import Breadcrumb from '../components/breadcrumb';
import Checkbox from '../components/forms/checkbox';
import InputGroup from '../components/forms/input-group';
import Label from '../components/forms/label';
import TextField from '../components/forms/text-field';
import Select from '../components/forms/select';

import Schema from '../helpers/validations';
import { APPLICATION_INPUTS } from '../components/forms/inputs/application-inputs';

import { APPLICATIONS_ENDPOINT, APPLICATION_STEPS_SEI_12WK } from '../constants';

class Application extends Component {
  constructor(props){
    super(props);

    let inputs = APPLICATION_INPUTS[0]

    let program;
    if (window.location.search.split("=")[1] !== undefined) {
      program = window.location.search.split("=")[1].split("%20").join(" ")
    }

    let values = inputs.formFields.reduce((result, currentVal) => {
      result[currentVal["fieldName"]] = '';
      return result
    }, {});

    this.state = {
        program: program,
        steps: inputs.formFields,
        values: values,
        errors: {},
        submitAttempted: false
      };
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.lead) {
      const {lead} = this.props.location.state;
      this.setState({lead: lead})
    }
  }

  onInputChange = (fieldName, event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    // check dependencies
    this.state.steps.forEach((step) => {
      if (step.dependentField === fieldName) {
        step.dependentProcess(value).then((options) => {
          // only using for select, so update options
          this.setState({
            steps: this.state.steps.map((s) => { return s.id === step.id ? Object.assign({}, s, {options}): s })
          })
        })
      }
    })

    this.setState(prevState => ({
      ...prevState,
      values: {
        ...prevState.values,
        [fieldName]: value
      }
    }));
  }

  onSubmit = (event) => {
    event.preventDefault();

    this.setState({submitAttempted: true})
    if (this.invalidValues()) return;

    let program = getUrlVars()['program']
    if (typeof(program) === 'string') {
      program = decodeURIComponent(program)
    } else {
      return // TODO Some kind error? means the param is missing
    }

    fetch(APPLICATIONS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        values: this.state.values,
        program: program,
        complete: new Date,
      })
    })
    .then(resp => resp.json)
    .then((resp) => {
      console.log(resp)
    })
  }

  invalidValues = () => {
    let errors = {};
    this.state.steps.forEach((step) => {
      let validationSet = step.validate.reduce((result, currentVal) => {
        result[currentVal] = this.state.values[step.fieldName]
        return result
      }, {})

      let validation = Joi.validate(validationSet, Schema)
      if (validation.error !== null) {
        errors[step.id] = step.errorMsg
      }

    })
    this.setState({errors: errors});
    return Object.keys(errors).length > 0
  }

  onSave = (event) => {
    event.preventDefault();
  }

  renderSelect = (input, i) => {
    return (
      <div key={`input-${i}`} className={`input ${input.type}`}>
        <Select
          key={i}
          type={input.type}
          name={input.id}
          label={input.label}
          required={input.required}
          value={this.state.values[input.fieldName]}
          options={input.options}
          onOptionClick={this.onInputChange.bind(this, input.fieldName)}
          errorMessage={this.state.errors[input.id]}
          showError={this.state.errors[input.id]}
          disabled={input.dependentField ? !this.state.values[input.dependentField] : false}
          />
      </div>
    )
  }

  renderText(input, i) {
    return (
      <div key={`input-${i}`} className={`input ${input.type}`}>
        <Label text={input.label}/>
        <InputGroup
          key={i}
          type={input.type}
          name={input.id}
          label={input.label}
          required={input.required}
          placeholder={input.placeholder}
          value={this.state.values[i]}
          onInputChange={this.onInputChange.bind(this, input.fieldName)}
          errorMessage={this.state.errors[input.id]}
          showError={this.state.errors[input.id]}
          />
      </div>
    )
  }

  renderTextarea(input, i) {
    return (
      <div key={`input-${i}`} className={`input ${input.type}`}>
        <Label text={input.label}/>
        <InputGroup
          key={i}
          type={input.type}
          name={input.id}
          label={input.label}
          required={input.required}
          value={this.state.values[i]}
          onInputChange={this.onInputChange.bind(this, input.fieldName)}
          errorMessage={this.state.errors[input.id]}
          showError={this.state.errors[input.id]}
          />
      </div>
    )
  }

  renderCheckbox(input, i) {
    return (
      <div key={`input-${i}`} className={`input ${input.type}`}>
        <Checkbox
          key={i}
          type={input.type}
          name={input.id}
          label={input.label}
          required={input.required}
          value={this.state.values[i]}
          onInputChange={this.onInputChange.bind(this, input.fieldName)}
          errorMessage={this.state.errors[input.id]}
          showError={this.state.errors[input.id]}
          />
      </div>
    )
  }

  renderSteps() {
    return this.state.steps.map((input,i) => {
      switch (input.type) {
        case "text":
          return this.renderText(input, i)
          break;
        case "select":
          return this.renderSelect(input, i)
          break;
        case "textarea":
          return this.renderTextarea(input, i)
          break;
        case "checkbox":
          return this.renderCheckbox(input, i)
          break;
        default:
        return this.renderText(input, i)
      }
    })
  }


  render() {
    let fakeOpp = {admissionsProcess: APPLICATION_STEPS_SEI_12WK, currentStep: 1}
    return (
      <div className="application-steps">
        <div className="container">
          <div className="portal-inner">
            <Hero headline={'Complete Your Application'} description={this.state.program || 'Software Engineering Immersive'}/>
            <Breadcrumb />
              <AdmissionsProcessSteps opp={fakeOpp}/>
            <div className="application-form">
              {this.renderSteps()}
              <div className="action">
                <button className="button-secondary" type="submit" onClick={this.onSave}>Save</button>
                <button className="button-primary" type="submit" onClick={this.onSubmit}>Submit</button>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
  }

}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

export default Application;
