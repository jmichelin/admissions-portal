import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Signup extends Component {

  constructor(props){
    super(props);
    this.state = {
      first_name: '',
      last_name:'',
      phone:'xxx-xxx-xxxx',
      email:'',
      password:'',
      confirmedPassowrd: '',
      consent: false
    }
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

  render() {
    return (
    <div className="App">
      <h1>Sign Up</h1>
      <form onSubmit={this.handleSubmit}>
        <label> First Name
          <input type="text" name="first_name" value={this.state.first_name} onChange={this.handleInputChange}></input>
        </label>
        <label> Last Name
          <input type="text" name="last_name" value={this.state.last_name} onChange={this.handleInputChange}></input>
        </label>
        <label> Phone
          <input type="text" name="phone" value={this.state.phone} onChange={this.handleInputChange}></input>
        </label>
        <label> Email
          <input type="text" name="email" value={this.state.email} onChange={this.handleInputChange}></input>
        </label>
        <label> Password
          <input type="text" name="password" value={this.state.password} onChange={this.handleInputChange}></input>
        </label>
        <label> Confirm Password
          <input type="text" name="confirmedPassowrd" value={this.state.confirmedPassword} onChange={this.handleInputChange}></input>
        </label>
        <label>
          <input type="checkbox" name="consent" checked={this.state.consent} onChange={this.handleInputChange}></input>
          I agree to Galvanize's Privacy Policy and Terms of Use.
      </label>
      </form>
    </div>
    );
  }
}
export default Signup;
