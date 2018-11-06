import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Home extends Component {
  render() {
    return (
    <div className="App">
      <h1>Project Home</h1>
      <Link to={'./list'}>
        <button variant="raised">
            My List
        </button>
      </Link>
      <Link to={'./signup'}>
        <button variant="raised">
            Signup
        </button>
      </Link>
    </div>
    );
  }
}
export default Home;