import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Signup from '../../components/signup/Signup'

class Home extends Component {
  render() {
    return (
    <div className="App">
      <Signup/>
    </div>
    );
  }
}
export default Home;
