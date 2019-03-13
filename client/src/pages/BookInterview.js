import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Hero from '../components/hero';
import Breadcrumb from '../components/breadcrumb';

import CalendarIframe from '../components/calendar-iframe';
import LoadingWheel from '../components/base/loader-orange';
import CampusList from '../components/book-interview-campuses';
import InterviewSidebar from '../components/book-interview-sidebar';

import { HERO_TEXT, SEI_STEPS_12_WK } from '../constants';


class BookInterview extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: false,
      showIframe: false,
      hideSpinner: false,
      campus: {},
      redirectToDashboard: false,
    };

    this.hideSpinner = this.hideSpinner.bind(this);
    this.loadBookingTool = this.loadBookingTool.bind(this);
    this.hideIframe = this.hideIframe.bind(this);
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.opp) {
      const {opp} = this.props.location.state;

      if (opp.currentStep !== SEI_STEPS_12_WK.STEP_THREE && !this.props.location.override) {
        this.setState({ redirectToDashboard: true })
      }
      this.setState({opp: opp})
      if (window && window.analytics) window.analytics.page('Book Interview')
     } else {
      this.setState({ redirectToDashboard: true })
    }
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
              <Hero headline={HERO_TEXT.SEI_BOOK_INTERVIEW.heroHeadline} description={HERO_TEXT.SEI_BOOK_INTERVIEW.heroDescription}/>
              <div className="two-col">
                <div className="campus-group">
                  <Breadcrumb
                    previousComponent={this.hideIframe}
                    refreshCalendar={!this.state.isLoading && this.state.showIframe}
                    text={(!this.state.isLoading && this.state.showIframe) || this.state.isLoading ? 'Select a Different Calendar' : 'Back to Dashboard'}
                    linkUrl={(!this.state.isLoading && this.state.showIframe) || this.state.isLoading ? null : '/dashboard'}/>
                  { !this.state.showIframe ? <CampusList loadBookingTool={this.loadBookingTool}/> : null }
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
