import React, { Component } from 'react';
import Signup from '../components/signup';
import Signin from '../components/signin';

import PortalAside from '../components/portal-aside';

class Home extends Component {
  constructor(props){
    super(props);

    this.state = {
      userIsSignedIn: false,
      showSignin: false
    };
    this.toggleSignin = this.toggleSignin.bind(this);
  }

  toggleSignin() {
    this.setState({
      showSignin: !this.state.showSignin
    });
  }

  componentDidMount() {
    this.props.clearData();
    window.analytics.ready(function() {
      window.analytics.page('Home')
       });
     }

  render() {
    return (
      <div className="home">
        <div className="container">
          <div className="portal">
            <PortalAside/>
                <div className="form-content">
                  { this.state.showSignin
                    ? <Signin toggleSignin={this.toggleSignin}/>
                    : <Signup toggleSignin={this.toggleSignin}/>
                  }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Home;
