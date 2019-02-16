/* eslint-disable no-console */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import PortalAside from '../components/portal-aside';

import inputs from '../components/forms/inputs/inputs';
import InputGroup from '../components/forms/input-group';

import HRLogo from '../assets/images/hack-reactor-horizontal-logo.png';
import Joi from 'joi';

const API_URL = '/auth/reset';


class ResetPassword extends Component {
  constructor() {
    super();
    const accountInputs = inputs.getForgotPasswordInputs();

    this.state = {
      formInputs: accountInputs,
      email: '',
      showError: false,
      messageFromServer: '',
      showNullError: false,
      errorMessage: ''
    };

    this.onInputChange = this.onInputChange.bind(this);

  }

   componentDidMount() {
     fetch(`${API_URL}/${this.props.match.params.token}`, {
       method: 'GET',
       headers: {
         'content-type': 'application/json'
       }
     }).then(response => {
       if (response.ok) {
       return response.json()
     } else {
       return response.json().then(error => {
         throw new Error(error.message)
       })
     }
    }).then(result => {
       console.log(result);
      if (result.email) {
        this.setState({
          email: result.email,
          updated: false,
          isLoading: false,
          error: false,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      this.setState({
        errorMessage: error.message,
        isLoading: false,
        updated: false
      });
    });
}


  onInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  createInputs() {
    return this.state.formInputs.map((input, i) => {
      if (input.type === 'text' || input.type === 'email' || input.type === 'tel' || input.type === 'password') {
        return (
          <InputGroup
            key={i}
            type={input.type}
            name={input.id}
            label={input.label}
            required={input.required}
            value={this.state[input.id]}
            onInputChange={this.onInputChange}
            errorMessage={input.errorMessage}
            showError={this.state.submitAttempted && !this.validField(input)}
            />
          )
      } else {
          return null;
        }
    })
  }

  validField(input) {
    const field = {[input.id]:this.state[input.id]}
    const result = Joi.validate(field, schema);
    if (result.error === null) {
      return true;
    }
    return false;
  };

  validUser(data) {
    const result = Joi.validate(data, schema);
    if (result.error === null) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const {email, messageFromServer, showNullError, showError} = this.state;

    return (
      <div className="home forgot-password">
      <div className="container">
        <div className="portal">
          <PortalAside/>
          <div className="form-content">
            <h1 className="title">Admissions Portal<span>New!</span></h1>
            <div className="logo-wrapper">
              <img className="logo" src="https://s3-us-west-2.amazonaws.com/dotcom-files/Galvanize_Logo.png" alt="Galvanize Logo"></img>
              <img className="logo -hr" src={HRLogo} alt="Hack Reactor Logo"></img>
            </div>
             <h3 className="portal-title">Reset Your Password</h3>
          <form onSubmit={this.sendEmail}>
          <div className="form-group">
            {this.createInputs().slice(0,1)}
          </div>
          <div className="form-footer">
            <button className={this.state.isLoading ? "button-primary -loading" : "button-primary"}>Sign In</button>
          </div>
          <div className="error-wrapper"><span className="form note form-error">{ this.state.errorMessage }</span></div>
        </form>
        {showNullError && (
          <div>
            <p>The email address cannot be null.</p>
          </div>
        )}
        {showError && (
          <div>
            <p>
              That email address isn't recognized. Please try again or
              create a new account.
            </p>
            <button
              buttonText="Register"
              link="/register"
            />
          </div>
        )}
        {messageFromServer === 'recovery email sent' && (
          <div>
            <h3>Password Reset Email Successfully Sent!</h3>
          </div>
        )}
        <Link to="/"><button className="-inline">Back to Login</button></Link>
      </div>
      </div>
    </div>
    </div>
    );
  }
}

const schema = {
  email: Joi.string().email(),
}


export default ResetPassword;
