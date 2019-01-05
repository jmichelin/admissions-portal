import React, { Component } from 'react';

import './dashboard.css';

class Dashboard extends Component {
  constructor(props){
    super(props);

    this.state = {
      user: {}
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.setState({
      redirectToHome: true
    })
  }

  componentDidMount() {
    const API_URL = 'http://localhost:5000/'
    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
    }).then(res => res.json())
      .then(result => {
        if (result.user) {
          this.setState({
            user: result.user
          })
        } else {
          this.logout();
        }
      }).catch(err => console.log(err))
  }


  render() {
    return (
      <div className="dashboard">
        <div className="container">
          <h2>Dashboard</h2>
          <h4>Welcome {this.state.user.first_name}!</h4>
          <p>From here you can fill out applications for our programs, book interviews, and proceed.</p>

        </div>
      </div>
    );
  }
}

export default Dashboard;
