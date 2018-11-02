import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Signup extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
  }

  componentWillMount() {
    console.log('hi from the signup page!');
  }


  render() {
    return (
    <div className="App">
      <h1>Sign Up</h1>
    </div>
    );
  }
}
export default Signup;
