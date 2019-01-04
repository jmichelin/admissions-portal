import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

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
      <div className="Dashboard">
        <h2>Dashboard</h2>
        <h4>{this.state.user.email}</h4>
      </div>
    );
  }
}

export default Dashboard;
