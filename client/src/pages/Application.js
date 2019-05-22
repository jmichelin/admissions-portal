import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Joi from 'joi';

import Hero from '../components/hero';
import Checkbox from '../components/forms/checkbox';
import InputGroup from '../components/forms/input-group';
import Label from '../components/forms/label';
import TextField from '../components/forms/text-field';
import Select from '../components/forms/select';

import Schema from '../helpers/validations';


import {CAMPUSES} from '../constants';


let pretendSteps = [{
  id: 'campus',
  label: 'Where are you planning to take this course?',
  type: 'select',
  fieldName: 'Campus__c',
  value: '',
  validate: ["string"],
  errorMsg: "Please select a valid campus",
  options: CAMPUSES
}, {
  id: 'course-dates',
  label: 'When would you like to take this course?',
  fieldName: 'Which_dates_you_prefer_to_take_course__c',
  type: 'select',
  options: [{
      optionName: "Aug 19, 2019",
      value: "DATA SCIENCE - NYC-SOHO - AUGUST 2019"  // need to reference getStepOneInputs() from dotcom to dynamically get these
    },
    {
      optionName: "Dec 25, 2019",
      value: "DATA SCIENCE - NYC-SOHO - DECEMBER 2019"
    }],
  dynamic: true,
  validate: ["string"],
  errorMsg: "Please select a preferred date",
  value: ''
},{
  id: 'why-applying',
  label: 'Why are you applying to this Galvanize Program?',
  fieldName: 'Reason_applying_to_this_gSchool_Program__c',
  type: 'textarea',
  validate: ["250-1500-chars"],
  errorMsg: "Must have between 250 to 1500 characters",
  value: ''
}, {
  placeholder: 'MM/DD/YYYY',
  id: 'date-of-birth',
  label: 'Date of Birth',
  fieldName: 'Birthdate__c',
  errorMessage: 'Invalid birthday. Must be formatted as MM/DD/YYYY.',
  type: 'text',
  value: '',
  validate: ["birthday"],
  errorMsg: "Please input your date of birth in the proper format MM/DD/YYYY",
  cleave: true
}, {
  id: 'is-international',
  label: 'Are you a U.S. Citizen or permanent resident?',
  type: 'select',
  fieldName: 'International__c',
  value: '',
  validate: ["string"],
  errorMsg: "Please select an option",
  options: [
    {
      name: 'Yes',
      value: 'false'
    },
    {
      name: 'No',
      value: 'true'
    }
  ]
},{
  id: 'of-age',
  label: `I am at least 18 years old and I have at least a HS diploma or equivalent. I understand I will be asked to provide proof of my prior educational history if I enroll.`,
  fieldName: 'Is_Eighteen',
  type: 'checkbox',
  value: '',
  validate: [],
  errorMsg: 'You must agree to being 18 or older',
  sfIgnore: true
},]

class Application extends Component {
  constructor(props){
    super(props);

    let values = pretendSteps.reduce((result, currentVal) => {
      result[currentVal["fieldName"]] = '';
      return result
    }, {});

    // set validation schema

    this.state = {
        steps: pretendSteps,
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
    pretendSteps.forEach((step) => {
      let validationSet = step.validate.reduce((result, currentVal) => {
        result[currentVal] = this.state.values[step.fieldName]
        return result
      }, {})

      let validation = Joi.validate(validationSet, Schema)
      if (validation.error !== null) {
        errors[step.id] = step.errorMsg
      }

    })
    console.log(errors)
    this.setState({errors: errors});
    return errors.length > 0
  }

  renderSelect = (input, i) => {
    return (
      <div key={`input-${i}`}>
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
      <div key={`input-${i}`}>
        <Label text={input.label}/>
        <InputGroup
          key={i}
          type={input.type}
          name={input.id}
          label={input.placeholder ? input.placeholder : input.label}
          required={input.required}
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
      <div key={`input-${i}`}>
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
      <div key={`input-${i}`}>
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
          // ???
      }
    })
  }


  render() {
    return (
      <div className="application-steps">
        <div className="container">
          <div className="portal-inner">
            <Hero headline={'Complete Your Application'} description={'Get er done and change your life!'}/>
            <div className="application">
              {this.renderSteps()}
            </div>
            <button className="button-primary" type="submit" onClick={this.onSubmit}>Fancy Button</button>
          </div>
        </div>
    </div>
  )
  }

}

export default Application;
