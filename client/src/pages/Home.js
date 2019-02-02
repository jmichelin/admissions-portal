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
              <div className="portal-aside">
                <div className="program-block">
                  <img className="program-logo" src="../assets/images/HR_SEI_logo_white_horizontal.png"></img>
                  <p>Manage your application, complete your coding challenge and book your technical interview to complete the Software Engineering admissions process.</p>
                </div>
                <div className="program-block">
                  <img className="program-logo" src="../assets/images/galvanize_data_science_white.png"></img>
                  <p>Manage your application, complete your technical exercise and book your technical interviews to copmlete the Data Science admissions process.</p>
                </div>
              </div>
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
