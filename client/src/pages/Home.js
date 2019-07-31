import React, { Component } from 'react';
import Signup from '../components/signup';
import Signin from '../components/signin';

import PortalAside from '../components/portal-aside';

import utils from '../helpers/utils';

class Home extends Component {
  constructor(props){
    super(props);

    this.state = {
      userIsSignedIn: false,
      showSignin: false,
      leadSource: {}
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
    const leadSource = utils.getLeadSource(document.cookie, window.location.search);
      this.setState({
        leadSource: leadSource
      })
   }

  render() {
    return (
      <div className="home">
        <div className="container">
          <div className="portal">
            <PortalAside/>
                <div className="form-content">
                  { this.state.showSignin
                    ? <Signin toggleSignin={this.toggleSignin} leadSource={this.state.leadSource}/>
                  : <Signup toggleSignin={this.toggleSignin} leadSource={this.state.leadSource} updateState={this.props.updateState}/>
                  }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Home;
