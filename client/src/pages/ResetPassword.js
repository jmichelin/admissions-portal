import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PortalAside from '../components/portal-aside';
import inputs from '../components/forms/inputs/inputs';
import InputGroup from '../components/forms/input-group';
import HRLogo from '../assets/images/hack-reactor-horizontal-logo.png';
import Joi from 'joi';

const API_RESET_PASSWORD_URL = '/auth/reset';
const API_UPDATE_PASSWORD_URL = '/auth/update-password';

class ResetPassword extends Component {
  constructor() {
    super();

    const accountInputs = inputs.resetPasswordInputs();

    this.state = {
      formInputs: accountInputs,
      submitAttempted: false,
      emailToReset: '',
      email: '',
      password: '',
      confirmed_password: '',
      showError: false,
      messageFromServer: '',
      showNullError: false,
      errorMessage: '',
      disabled: false
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  componentDidMount() {
    fetch(`${API_RESET_PASSWORD_URL}${this.props.match.params.token}`, {
       method: 'GET',
       headers: { 'content-type': 'application/json' }
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          return response.json()
            .then(error => { throw new Error(error.message) })
        }
      })
      .then(result => {
        this.setState({
          email: result.email,
          emailToReset: result.email,
          updated: false,
          isLoading: false,
          error: false,
        });
      })
      .catch((error) => {
        this.setState({
          errorMessage: error.message,
          isLoading: false,
          updated: false,
          disabled: true
        });
      });
  }

  onInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
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

    if (input.id === 'email') return this.state.email === this.state.emailToReset
    if (input.id === 'confirmed_password') return this.state[input.id] === this.state.password;
    if (result.error === null) return true;

    return false;
  }

  validUser(data) {
    const result = Joi.validate(data, schema);

    if (this.state.confirmed_password !== this.state.password) return false;
    if (this.state.email !== this.state.emailToReset) return false;
    if (result.error === null) return true;

    return false;
  }

  updatePassword = (e) => {
    e.preventDefault();

    this.setState({ submitAttempted: true, isLoading: true })

    const { email, password } = this.state;
    const formData = { email, password }

    if (this.validUser(formData)) {
      fetch(API_UPDATE_PASSWORD_URL, {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: {
          'content-type': 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            return response.json()
              .then(error => { throw new Error(error.message) })
          }
        })
        .then(result => {
          this.setState({
            updated: true,
            disabled: true,
            errorMessage: result,
            isLoading: false
          });
        })
        .catch((error) => {
          this.setState({
            errorMessage: error.message,
            isLoading: false,
            updated: false
          });
        });
    } else {
      this.setState({ isLoading: false });
    }
  };

  render() {
    return (
      <div className="home forgot-password">
        <div className="container">
          <div className="portal">
            <PortalAside/>
            <div className="form-content">
              <h1 className="title">
                Admissions Portal<span>New!</span>
              </h1>
              <div className="logo-wrapper">
                <img
                  className="logo"
                  src="https://s3-us-west-2.amazonaws.com/dotcom-files/Galvanize_Logo.png"
                  alt="Galvanize Logo"
                />
                <img className="logo -hr" src={HRLogo} alt="Hack Reactor Logo" />
              </div>
              <h3 className="portal-title -forgot-pass">
                Reset Your Password
              </h3>
              <p className="citation -thin -center">
                Enter your new password below. Then proceed to login.
              </p>
              <form onSubmit={this.updatePassword}>
                <div className="form-group">
                  {this.createInputs().slice(0,1)}
                </div>
                <div className="form-group">
                  {this.createInputs().slice(1,3)}
                </div>
                <div className="form-footer">
                  <button
                    disabled={this.state.disabled}
                    className={this.state.isLoading ? "button-primary -loading" : "button-primary"}
                  >
                    Reset Password
                  </button>
                </div>
                <div className="error-wrapper">
                  <span className="form note form-error">
                    {this.state.errorMessage}
                  </span>
                </div>
              </form>
              <Link to="/">
                <button className="-inline">
                  Back to Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const schema = {
  email: Joi.string().email(),
  password: Joi.string().min(5).max(15)
}

export default ResetPassword;
