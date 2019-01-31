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
      showIframe: false,
      hideSpinner: false,
      campus: {}
    };

    this.hideSpinner = this.hideSpinner.bind(this);
    this.loadBookingTool = this.loadBookingTool.bind(this);
    this.hideIframe = this.hideIframe.bind(this);
  }

  hideSpinner(iframe) {
    iframe.contentWindow.postMessage('hello', "*");
    window.addEventListener("message", this.handleFrameTasks);
    this.setState({
      isLoading: false,
      hideSpinner: true
    });
  };

  handleFrameTasks = (e) => {
      document.getElementById(this.state.campus.ycbmId).style.height = `${e.data}px`
      if (!isNaN(e.data)) {
        this.setState({
          height:e.data
        })
      }
     }

  componentDidMount() {
    if (!this.props.fetchedData) this.props.getData(true);
  }

  loadBookingTool(campus) {
    this.setState({
      campus: campus,
      showIframe: true,
      isLoading: true
    })
  }

  hideIframe() {
    this.setState({
      showIframe: false,
      isLoading: false
    })
  }

  render() {
    let loadingBlock =
      <div><h4 className="column-headline">Loading the booking tool...</h4>
        <div className="column-headline"><LoadingWheel/></div>
      </div>

      let breadcrumb = <button className="-inline" onClick={this.hideIframe}>Select a Different Calendar</button>

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
                <div className="campus-group">
                  { !this.state.showIframe ? <CampusList loadBookingTool={this.loadBookingTool}/> : null }
                  { !this.state.isLoading && this.state.showIframe ? breadcrumb : null }
                  { this.state.isLoading ? loadingBlock : null }
                  { this.state.showIframe ?
                    <CalendarIframe
                      calendarUrl={this.state.campus.ycbmLink}
                      calendarId={this.state.campus.ycbmId}
                      hideSpinner={this.hideSpinner}
                      handleFrameTasks={this.handleFrameTasks}
                      hideIframe={this.hideIframe}/> : null }
                </div>
                { !this.state.showIframe ? <InterviewSidebar/> : null }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BookInterview;
