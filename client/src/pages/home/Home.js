import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Signup from '../../components/signup/Signup';
import Signin from '../../components/signin/Signin';

import './home.css';

class Home extends Component {
  constructor(props){
    super(props);

    this.state = {
      userIsSignedIn: false,
      showLogin: true
    }

  }

  render() {
    return (
      <div className="Home">
        <div className="container">
          <div className="portal">
              <div className="portal-aside"></div>
                <div className="form-content">
                  { this.state.showLogin
                    ? <Signin/>
                    : <Signup/>
                  }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Home;
