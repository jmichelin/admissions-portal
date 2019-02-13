import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import inputs from './forms/inputs/inputs';
import InputGroup from './forms/input-group';

import HRLogo from '../assets/images/hack-reactor-horizontal-logo.png';

import Joi from 'joi';

const SIGNIN_URL = '/auth/signin';

class Signin extends Component {

  constructor(props){
    super(props);
    const accountInputs = inputs.getSignInInputs();

    this.state = {
      formInputs: accountInputs,
      email:'',
      password:'',
      isLoading: false,
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
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
    if (result.error === null) {
      return true;
    } else {
      return false;
    }

  }

  validField(input) {
    const field = {[input.id]:this.state[input.id]}
    const result = Joi.validate(field, schema);
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

    const { email, password } = this.state;
    const formData = { email, password }

    if (this.validUser(formData)) {
      fetch(SIGNIN_URL, {
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
          localStorage.token = result.token
          this.setState({ isLoading: false, redirectToDashboard:true});
          return result;
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


  render() {
        if (this.state.redirectToDashboard) {
          return (
          <Redirect to="/dashboard"/>
          )
        }

    return (
            <div className="signin">
              <h1 className="title">Admissions Portal<span>New!</span></h1>
              <div className="logo-wrapper">
                <img className="logo" src="https://s3-us-west-2.amazonaws.com/dotcom-files/Galvanize_Logo.png" alt="Galvanize Logo"></img>
                <img className="logo -hr" src={HRLogo} alt="Hack Reactor Logo"></img>
              </div>
             <div>
               <h3 className="portal-title">Sign In</h3>
               <p className="title-subtext">Don't have an account? <button className="-inline" onClick={this.props.toggleSignin}>Create Your Account</button></p>
                 <p className="citation -thin -center">Have an account through Hack Reactor? Create a new account here to pick up where you left off in the admissions process.</p>
                 <form onSubmit={this.handleSubmit}>
                   <div className="form-group">
                     {this.createInputs().slice(0,1)}
                   </div>
                   <div className="form-group">
                     {this.createInputs().slice(1,2)}
                   </div>
                   <div className="form-footer">
                     <div className="forgot-password">
                       <Link to="/forgot-password"><button className="-inline" onClick={this.toggleForgotPassword}>Forgot Your Password?</button></Link>
                     </div>
                     <button className={this.state.isLoading ? "button-primary -loading" : "button-primary"}>Sign In</button>
                   </div>
                   <div className="error-wrapper"><span className="form note form-error">{ this.state.errorMessage }</span></div>
                 </form>
             </div>
            </div>
    );
  }
}

const schema = {
  email: Joi.string().email(),
  password: Joi.string().min(5).max(15)
}

export default Signin;
