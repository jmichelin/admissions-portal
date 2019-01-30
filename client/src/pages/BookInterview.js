import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';

import CalendarNYC from '../components/calendars/calendar-nyc';

class BookInterview extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true

    };

  }

  hideSpinner = () => {
    console.log('hey!!!');
    this.setState({
      isLoading: false
    });
  };

  componentDidMount() {

  }



  render() {
      return (
      <div className="book-interview">
        <div className="container">
            <h4 className="page-title">Book Your Technical Interview</h4>
            <Link to="/dashboard"><button className="-inline">Back to Dashboard</button></Link>
            <div className="portal-inner">
              {this.state.isLoading ? <p>Loading...</p> : null }
              <CalendarNYC hideSpinner={this.hideSpinner}/>
          </div>
        </div>
      </div>
    );
  }
}

export default BookInterview;
