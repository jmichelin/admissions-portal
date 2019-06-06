import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import inputs from './forms/inputs/inputs';
import InputGroup from './forms/input-group';
import Checkbox from './forms/checkbox';
import Select from './forms/select';

import HRLogo from '../assets/images/hack-reactor-horizontal-logo.png';
import { APPLICATION_INPUTS } from './forms/inputs/application-inputs';

import Joi from 'joi';

const SIGNUP_URL = '/auth/signup';

class Signup extends Component {

  constructor(props){
    super(props);
    const accountInputs = inputs.getCreateAccountInputs();

    this.state = {
      formInputs: accountInputs,
      first_name: '',
      last_name:'',
      email:'',
      password:'',
      confirmed_password: '',
      program: '',
      campus: '',
      terms: false,
      isFormValid: false,
      submitAttempted: false,
      errorMessage: '',
      isLoading: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.validField = this.validField.bind(this);
    this.validUser = this.validUser.bind(this);
  }

  onInputChange(event) {
    const target = event.target;

    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  validUser(data) {
    const result = Joi.validate(data, schema);
    console.log(result);
    if (this.state.confirmed_password !== this.state.password) return false;
    if (this.state.terms === false) return false;
    if (result.error === null) {
      return true;
    } else {
      return false;
    }
  }

  validField(input) {
    const field = {[input.id]:this.state[input.id]}
    const result = Joi.validate(field, schema);
    if (input.id === 'confirmed_password') {
      return this.state[input.id] === this.state.password;
    }
    if (input.id === 'terms') {
      return this.state.terms;
    }
    if (result.error === null) {
      return true;
    }
    return false;
}

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      submitAttempted: true,
      isLoading: true
    })
    const { first_name, last_name, email, password, program, campus } = this.state;
    const { courseType, courseProduct } = APPLICATION_INPUTS.find(e => e.name === program)
    const formData = { first_name, last_name, email, password, program, campus, courseType, courseProduct }

    // set courseType and courseProduct from Application Inputs to send to server
    if (this.validUser(formData)) {
      fetch(SIGNUP_URL, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'content-type': 'application/json'
        }
        }).then(response => {
          if (response.ok) {
            return response.json()
          }
          return response.json().then(error => {
            throw new Error(error.message)
          })
        }).then(result => {
          localStorage.token = result.token;
          this.setState({
            redirectToDashboard: true
          })
        }).catch(err => {
            this.setState({
              errorMessage: err.message,
              isLoading: false
            })
        })
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
            value={this.state[input.id]}
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
            checked={this.state.consent}
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
              value={this.state[input.id]}
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
    if (this.state.redirectToDashboard) {
      return (
      <Redirect to="/dashboard"/>
      )
    }
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
              {this.createInputs().slice(5,7)}
            </div>
            <div className="form-footer">
              {this.createInputs().slice(7,8)}
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
  courseType: Joi.string().required(),
  courseProduct: Joi.string().required(),
}

export default Signup;
