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

import { APPLICATION_STEPS_SEI_12WK } from '../constants';

class Application extends Component {
  constructor(props){
    super(props);

    let values = APPLICATION_INPUTS[0].steps.reduce((result, currentVal) => {
      result[currentVal["fieldName"]] = '';
      return result
    }, {});

    this.state = {
        steps: APPLICATION_INPUTS[0].steps,
        values: values,
        errors: {},
        submitAttempted: false
      };
  }

  onInputChange = (fieldName, event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

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
    if(this.invalidValues()) return;
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
    return errors.length > 0
  }

  onSave = (event) => {
    event.preventDefault();

    console.log('saving form data');
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
            <Hero headline={'Complete Your Application'} description={this.props.product || 'Software Engineering Immersive'}/>
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

export default Application;
