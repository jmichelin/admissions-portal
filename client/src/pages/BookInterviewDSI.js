import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Hero from '../components/hero';
import CalendarIframe from '../components/calendar-iframe';
import LoadingWheel from '../components/base/loader-orange';
import InterviewSidebar from '../components/book-interview-sidebar-dsi';

import { HERO_TEXT, DSI_STEPS, DSI_YCBM_CALENDAR_ID, DSI_YCBM_CALENDAR_URL } from '../constants';


class BookInterviewDSI extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      showIframe: false,
      hideSpinner: false,
      campus: {},
      redirectToDashboard: false,
    };

    this.hideSpinner = this.hideSpinner.bind(this);
    this.hideIframe = this.hideIframe.bind(this);
    this.loadBookingTool = this.loadBookingTool.bind(this);

  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.opp) {
      const {opp} = this.props.location.state;

      if (opp.currentStep !== DSI_STEPS.STEP_THREE && !this.props.location.override) {
        this.setState({ redirectToDashboard: true })
      }
      this.setState({opp: opp}, this.loadBookingTool)
      if (window && window.analytics) window.analytics.page('Book Interview DSI')
     } else {
      this.setState({ redirectToDashboard: true })
    }
  }

  loadBookingTool(campus) {
    this.setState({
      showIframe: true,
    })
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
      document.getElementById(DSI_YCBM_CALENDAR_ID).style.height = `${e.data}px`
      if (!isNaN(e.data)) {
        this.setState({
          height:e.data
        })
      }
     }

  hideIframe() {
    this.setState({
      showIframe: false,
      isLoading: false
    })
  }

  render() {
        let loadingBlock =
      <div className="grouping">
        <h4 className="column-headline">Loading the booking tool...</h4>
        <div className="column-headline"><LoadingWheel/></div>
      </div>

    if (this.state.redirectToDashboard) {
      return (<Redirect to='/dashboard'/>)
    }
      return (
      <div className="book-interview">
        <div className="container">
            <div className="portal-inner">
              <Hero headline={HERO_TEXT.DSI_BOOK_INTERVIEW.heroHeadline} description={HERO_TEXT.DSI_BOOK_INTERVIEW.heroDescription}/>
              <div className="two-col">
                <div className="campus-group">
                  { this.state.isLoading ? loadingBlock : null }
                  { this.state.showIframe ?
                    <CalendarIframe
                      opp={this.state.opp}
                      user={this.props.user}
                      calendarUrl={DSI_YCBM_CALENDAR_URL}
                      calendarId={DSI_YCBM_CALENDAR_ID}
                      hideSpinner={this.hideSpinner}
                      handleFrameTasks={this.handleFrameTasks}
                      hideIframe={this.hideIframe}/> : null }
                </div>
                <InterviewSidebar/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BookInterviewDSI;
