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
      isLoading: false,
      showIframe: false
    };

    this.hideSpinner = this.hideSpinner.bind(this);
    this.loadBookingTool = this.loadBookingTool.bind(this);

  }

  hideSpinner(iframe) {
    this.setState({
      isLoading: false
    });
  };

  componentDidMount() {
    if (!this.props.fetchedData) this.props.getData(true);
  }

  loadBookingTool(link) {
    console.log('hey');
    this.setState({
      calendarLink: link,
      showIframe: true
    })
  }

  render() {

    let loadingBlock =
      <div className="campus-group -loading"><h4 className="column-headline">Loading the booking tool...</h4>
        <div><LoadingWheel/></div>
      </div>
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
                { !this.state.showIframe ? <CampusList loadBookingTool={this.loadBookingTool}/> : loadingBlock }
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
