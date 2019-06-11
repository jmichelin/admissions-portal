import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import inputs from './forms/inputs/inputs';
import InputGroup from './forms/input-group';
import Checkbox from './forms/checkbox';
import Select from './forms/select';

import HRLogo from '../assets/images/hack-reactor-horizontal-logo.png';
import { APPLICATION_INPUTS } from './forms/inputs/application-inputs';

import utils from '../helpers/utils';

import Joi from 'joi';
const phoneJoi = Joi.extend(require('joi-phone-number'));

const SIGNUP_URL = '/auth/signup';

class Signup extends Component {

  constructor(props){
    super(props);
    const accountInputs = inputs.getCreateAccountInputs();
    const values = accountInputs.reduce((result, currentVal) => {
      result[currentVal["fieldName"]] = '';
      return result
    }, {});

    this.state = {
      formInputs: accountInputs,
      isFormValid: false,
      submitAttempted: false,
      errorMessage: '',
      isLoading: false,
      values,
    }
  }

  checkDependencies = (fieldName, value) => {
    // check dependencies
    this.state.formInputs.forEach((input) => {
      if (input.dependentField && input.dependentField === fieldName) {
        input.dependentProcess(value)
          .then((options) => {
            // only using for select, so update options
            this.setState({
              formInputs: this.state.formInputs.map((s) => { return s.id === input.id ? Object.assign({}, s, { options }): s })
            })
        })
      }
    })
  }

  onInputChange = (event) => {
    const target = event.target;

    const value = target.type === 'checkbox' ? target.checked : target.value;
    const fieldName = target.name;

    this.checkDependencies(fieldName, value);
    this.setState(prevState => ({
      ...prevState,
      values: {
        ...prevState.values,
        [fieldName]: value
      },
    }));
  }

  validUser = (data) => {
    const result = Joi.validate(data, schema);
    if (this.state.values.confirmed_password !== this.state.values.password) return false;
    if (this.state.values.terms === false) return false;
    if (result.error === null) {
      return true;
    } else {
      return false;
    }
  }

  validField = (input) => {
    const field = { [input.id]: this.state.values[input.id] }
    const result = Joi.validate(field, schema);

    if (input.id === 'confirmed_password') {
      return this.state.values[input.id] === this.state.values.password;
    }
    if (input.id === 'terms') {
      return this.state.values.terms;
    }
    if (result.error === null) {
      return true;
    }
    return false;
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    this.setState({
      submitAttempted: true,
      isLoading: true
    })
    const { first_name, last_name, email, password, program, campus, phone } = this.state.values;
    const { courseType, courseProduct } = APPLICATION_INPUTS.find(e => e.name === program) || { courseType: undefined, courseProduct: undefined }
    const formData = { first_name, last_name, email, password, program, campus, phone, courseType, courseProduct }

    // set courseType and courseProduct from Application Inputs to send to server
    if (this.validUser(formData)) {

      try {
        let response = await fetch(SIGNUP_URL, {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'content-type': 'application/json'
          }
        })
        let result = await response.json();
        if (result.message) throw new Error(result.message)
        localStorage.token = result.token;
        const applications = result.data.applications.map(app => {
          const stageObj = utils.getStage(app);
          app.formalName = stageObj.name;
          app.currentStep = stageObj.step;
          app.admissionsProcess = stageObj.process;
          return app;
        })
        let updatedState = {
          user: result.data.user,
          applications: applications,
          fetchedData: true
        }
        this.props.updateState(updatedState, '/dashboard')
      } catch(err) {
        this.setState({
          errorMessage: err.message,
          isLoading: false
        })
      }

    } else {
      this.setState({ isLoading: false });
    }
  }

  createInputs() {
    return this.state.formInputs.map((input, i) => {
      if (input.type === 'text' || input.type === 'email' || input.type === 'tel' || input.type === 'password') {
        return (
          <InputGroup
            key={i}
            type={input.type}
            name={input.id}
            placeholder={input.label}
            required={input.required}
            value={this.state.values[input.id]}
            onInputChange={this.onInputChange}
            errorMessage={input.errorMessage}
            showError={this.state.submitAttempted && !this.validField(input)}
          />
          )
      } else if (input.type === 'checkbox') {
        return (
          <Checkbox
            key={i}
            type={input.type}
            name={input.id}
            label={input.label}
            required={input.required}
            checked={this.state.values.terms}
            terms={true}
            onInputChange={this.onInputChange}
            showError={this.state.submitAttempted && !this.validField(input)}
            errorMessage={input.errorMessage}/>
        )} else if (input.type === 'select') {
            return (<Select
              key={i}
              type={input.type}
              name={input.id}
              placeholder={input.label}
              required={input.required}
              value={this.state.values[input.id]}
              options={input.options}
              onOptionClick={(e) => this.onInputChange(e)}
              disabled={input.dependentField ? !this.state.values[input.dependentField] : false}
              errorMessage={input.errorMessage}
              showError={this.state.submitAttempted && !this.validField(input)}
            />
        )} else {
          return null;
        }
    })
  }

  render() {
    return (
      <div className="signup">
        <h1 className="title">Admissions Portal<span>New!</span></h1>
        <div className="logo-wrapper">
          <img className="logo" src="https://s3-us-west-2.amazonaws.com/dotcom-files/Galvanize_Logo.png" alt="Galvanize Logo"></img>
          <img className="logo -hr" src={HRLogo} alt="Hack Reactor Logo"></img>
        </div>
        <h3 className="portal-title">Create Your Account</h3>
        <p className="title-subtext">Already have an account? <button className="-inline" onClick={this.props.toggleSignin}>Sign In</button></p>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            {this.createInputs().slice(0,2)}
          </div>
          <div className="form-group">
            {this.createInputs().slice(2,3)}
          </div>
          <div className="form-group">
            {this.createInputs().slice(3,5)}
          </div>
          <div className="form-group">
            {this.createInputs().slice(5,6)}
          </div>
          <div className="form-group">
            {this.createInputs().slice(6,8)}
          </div>
          <div className="form-footer">
            {this.createInputs().slice(8,9)}
            <input type="submit" value="Create Account" className={this.state.isLoading ? "button-primary -loading" : "button-primary"}/>
          </div>
          <div className="error-wrapper"><span className="form note form-error">{ this.state.errorMessage }</span></div>
        </form>
      </div>
    );
  }
}

const schema = {
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(5).max(15),
  program: Joi.string(),
  campus: Joi.string(),
  phone: phoneJoi.string().phoneNumber(),
  courseType: Joi.string(),
  courseProduct: Joi.string(),
}

export default withRouter(Signup);
