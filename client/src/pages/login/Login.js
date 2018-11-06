import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './login.css';
import './../../styles/form.css';



class Login extends Component {

  constructor(props){
    super(props);
    this.state = {
      first_name: '',
      last_name:'',
      phone:'',
      email:'',
      password:'',
      confirmedPassowrd: '',
      consent: false,
      isFormValid: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

  }

  componentDidMount() {
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('submitting form!');
  }

  render() {
    return (
    <div className="Login">
      <div className="container">
        <div className="portal-aside"></div>
        <div className="form-content">
          <h1>Sign Up</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label> First Name
                <input type="text" name="first_name" required value={this.state.first_name} onChange={this.handleInputChange}></input>
              </label>
              <label> Last Name
                <input type="text" name="last_name" required value={this.state.last_name} onChange={this.handleInputChange}></input>
              </label>
          </div>
            <label> Phone
              <input type="text" name="phone" required value={this.state.phone} onChange={this.handleInputChange}></input>
            </label>
            <label> Email
              <input type="text" name="email" required value={this.state.email} onChange={this.handleInputChange}></input>
            </label>
            <label> Password
              <input type="text" name="password" required value={this.state.password} onChange={this.handleInputChange}></input>
            </label>
            <label> Confirm Password
              <input type="text" name="confirmedPassowrd" required value={this.state.confirmedPassword} onChange={this.handleInputChange}></input>
            </label>
            <label>
              <input type="checkbox" name="consent" required checked={this.state.consent} onChange={this.handleInputChange}></input>
              I agree to Galvanize's Privacy Policy and Terms of Use.
          </label>
          <input type="submit" value="Submit" disabled={!this.state.isFormValid}/>
          </form>
        </div>
      </div>
    </div>
    );
  }
}
export default Login;
