import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './dashboard.css';

class Dashboard extends Component {
  constructor(props){
    super(props);

    this.state = {
    }
  }

  componentDidMount() {
    const API_URL = 'http://localhost:5000/'
    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      },
    }).then(res => res.json())
      .then(result) => {
        console.log(result);
      }
  }


  render() {
    return (
      <div className="Dashboard">
        <h2>Dashboard</h2>
      </div>
    );
  }
}
export default Dashboard;
