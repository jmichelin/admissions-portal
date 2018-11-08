import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import inputs from './../forms/inputs/create-account';
import InputGroup from './../forms/input-group';
import Checkbox from './../forms/checkbox';

import './signin.css';
import './../../styles/form.css';
import './../../styles/button.css';

import Joi from 'joi';

const SIGNIN_URL = 'http://localhost:5000/auth/signin';

class Signin extends Component {

  constructor(props){
    super(props);

    this.state = {

    }

  }


  onInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }


  handleSubmit(event) {

  }


  render() {
    return (
            <div className="Signin">
              <h2>Hello from SiginIn!</h2>
            </div>
    );
  }
}

const schema = {
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(5).max(15)
}

export default Signin;
