import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import inputs from '../../components/forms/inputs/create-account';
import InputGroup from '../../components/forms/input-group';
import Checkbox from '../../components/forms/checkbox';


import './login.css';
import './../../styles/form.css';
import './../../styles/button.css';




class Login extends Component {

  constructor(props){
    super(props);
    const accountInputs = inputs.getCreateAccountInputs();

    this.state = {
      formInputs: accountInputs,
      first_name: '',
      last_name:'',
      email:'',
      password:'',
      confirmedPassowrd: '',
      consent: false,
      isFormValid: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);

  }

  componentDidMount() {
    this.createInputs();
  }

  onInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  isValid() {

  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('submitting form!');
    this.isValid()
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
            errorMessage={input.errorMessage}/>)
        } else {
          return null;
        }
    })
  }


  render() {
    return (
    <div className="Login">
      <div className="container">
        <div className="portal">
            <div className="portal-aside"></div>
            <div className="form-content">
              <img className="logo" src="https://s3-us-west-2.amazonaws.com/dotcom-files/Galvanize_Logo.png" alt="Galvanize Logo"></img>
            <h1 className="logo-subtext">Admissions Portal</h1>
            <h3 className="portal-title">Create an Account</h3>
              <h6>Already have an account? <a>Sign In</a></h6>

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
              <div className="form-footer">
                {this.createInputs().slice(5,6)}
                <input type="submit" value="Create Account" className="button primary" disabled={!this.state.isFormValid}/>
              </div>
              </form>
            </div>
          </div>
        </div>
    </div>
    );
  }
}
export default Login;
