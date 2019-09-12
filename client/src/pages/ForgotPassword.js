import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PortalAside from '../components/portal-aside';
import inputs from '../components/forms/inputs/inputs';
import InputGroup from '../components/forms/input-group';
import Joi from 'joi';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formInputs: inputs.getForgotPasswordInputs(),
      submitAttempted: false,
      email: '',
      showError: false,
      messageFromServer: '',
      showNullError: false,
      errorMessage: ''
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
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
            placeholder={input.label}
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
    if (result.error === null) return true;

    return false;
  };

  validUser(data) {
    const result = Joi.validate(data, schema);

    if (result.error === null) return true;

    return false;
  }

  sendEmail(e) {
    e.preventDefault();

    this.setState({ submitAttempted: true, isLoading: true });

    const { email } = this.state;
    const formData = { email }

    if (this.validUser(formData)) {
      fetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'content-type': 'application/json'
        }
      })
        .then((response) => {
          if (response.ok) {
            return response.json()
          } else {
            return response.json().then(error => {
              throw new Error(error.message)
            })
          }
        })
        .then(result => {
          this.setState({ isLoading: false, errorMessage: result });
        })
        .catch((error) => {
          this.setState({
            errorMessage: error.message,
            isLoading: false
          })
        });
    } else {
      this.setState({ isLoading: false })
    }
  }

  render() {
    return (
      <div className="home forgot-password">
        <div className="container">
          <div className="portal">
            <PortalAside/>
            <div className="form-content">
              <h3 className="portal-title -forgot-pass">
                Forgot Your Password?
              </h3>
              <p className="citation -thin -center">
                Enter your email to receive a password reset link.
              </p>
              <form onSubmit={this.sendEmail}>
                <div className="form-group">
                  {this.createInputs().slice(0,1)}
                </div>
                <div className="form-footer">
                  <button className={this.state.isLoading ? "button-primary -loading" : "button-primary"}>
                    Submit
                  </button>
                </div>
                <div className="error-wrapper">
                  <span className="form note form-error">
                    {this.state.errorMessage}
                  </span>
                </div>
              </form>
              <div className="-center">
                <Link to="/">
                  <button className="-inline">
                    Back to Login
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const schema = { email: Joi.string().email() }

export default ForgotPassword;
