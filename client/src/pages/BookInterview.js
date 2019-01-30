import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';

import CalendarNYC from '../components/calendars/calendar-nyc';
import LoadingWheel from '../components/base/loader-orange';

class BookInterview extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true
    };

    this.hideSpinner = this.hideSpinner.bind(this);

  }

  hideSpinner(iframe) {
    console.log(iframe);
    this.setState({
      isLoading: false
    });


  };

  componentDidMount() {
    if (!this.props.fetchedData) this.props.getData(true);
  }




  render() {

    let loadingBlock = <div><p className="section-row">Loading the booking tool...</p>
          <LoadingWheel/></div>
      return (
      <div className="book-interview">
        <div className="container">
            <h4 className="page-title">Book Your Technical Interview</h4>
            <Link to="/dashboard"><button className="-inline">Back to Dashboard</button></Link>
            <div className="portal-inner">
              { this.state.isLoading ? loadingBlock : null }
              <CalendarNYC hideSpinner={this.hideSpinner}/>
          </div>
        </div>
      </div>
    );
  }
}

export default BookInterview;
