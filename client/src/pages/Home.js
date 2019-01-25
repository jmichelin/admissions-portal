import React, { Component } from 'react';
import Signup from '../components/signup';
import Signin from '../components/signin';

class Home extends Component {
  constructor(props){
    super(props);

    this.state = {
      userIsSignedIn: false,
      showSignin: true
    };
    this.toggleSignin = this.toggleSignin.bind(this);
  }

  toggleSignin() {
    this.setState({
      showSignin: !this.state.showSignin
    });
  }

  componentWillMount() {
    this.props.clearData()
  }

  render() {
    return (
      <div className="home">
        <div className="container">
          <div className="portal">
              <div className="portal-aside"></div>
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
