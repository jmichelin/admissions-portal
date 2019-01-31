import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';

import CalendarIframe from '../components/calendar-iframe';
import LoadingWheel from '../components/base/loader-orange';
import CampusList from '../components/book-interview-campuses';
import InterviewSidebar from '../components/book-interview-sidebar';

import { CAMPUSES } from '../constants';


class BookInterview extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      campus: CAMPUSES[0]
    };

    this.hideSpinner = this.hideSpinner.bind(this);

  }

  hideSpinner(iframe) {
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
            <Link to="/dashboard"><button className="-inline">Back to Dashboard</button></Link>
            <div className="portal-inner">
              <div className="hero">
                <h3 className="">Book Your Technical Interview</h3>
                <p className="section-row">All campuses share the same interview format and assessment rubric so you can interview at the location that's most convenient for you, regardless of your preferred campus.</p>
              </div>
              <div className="two-col">
                <CampusList/>
                <InterviewSidebar/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// { this.state.isLoading ? loadingBlock : null }
// <CalendarIframe calendarUrl={this.state.campus.ycbmLink} hideSpinner={this.hideSpinner}/>

export default BookInterview;
