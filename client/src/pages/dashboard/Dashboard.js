import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './dashboard.css';

class Dashboard extends Component {
  constructor(props){
    super(props);

    this.state = {
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
