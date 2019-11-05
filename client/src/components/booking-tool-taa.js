import React,{Component} from 'react';

import Breadcrumb from '../components/breadcrumb';
import CalendarIframe from '../components/calendar-iframe';
import LoadingWheel from '../components/base/LoadingWheel';

export default class TAABookingTool extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showIframe: true,
      isLoading: true,
      hideSpinner: false,
      calendarId: 'ycbmiframetechnical-admissions-assessment',
      calendarUrl: 'https://technical-admissions-assessment.youcanbook.me'
    };
  }

  hideSpinner = (iframe) => {
    iframe.contentWindow.postMessage('hello', "*");
    window.addEventListener("message", this.handleFrameTasks);
    this.setState({
      isLoading: false,
      hideSpinner: true
    });
  };

  handleFrameTasks = (e) => {
      document.getElementById(this.state.calendarId).style.height = `${e.data}px`
      if (!isNaN(e.data)) {
        this.setState({
          height:e.data
        })
      }
     }

  loadBookingTool = (campus) => {
    this.setState({
      campus: campus,
      showIframe: true,
      isLoading: true
    })
  }

  hideIframe = () => {
    this.setState({
      showIframe: false,
      isLoading: false
    })
  }

  render() {
    return (
      <>
      <Breadcrumb
        refreshData={!this.state.isLoading && this.state.showIframe}
        text={(!this.state.isLoading && this.state.showIframe) || this.state.isLoading ? 'Select a Different Calendar' : 'Back to Dashboard'}
        linkUrl={(!this.state.isLoading && this.state.showIframe) || this.state.isLoading ? null : '/dashboard'}/>
      {this.state.isLoading && (
        <div className="grouping">
          <h4 className="column-headline">Loading the booking tool...</h4>
          <div className="column-headline"><LoadingWheel/></div>
        </div>
      )}
      {this.state.showIframe && (
        <CalendarIframe
          opp={this.props.opp}
          user={this.props.user}
          calendarUrl={this.state.calendarUrl}
          calendarId={this.state.calendarId}
          hideSpinner={this.hideSpinner}
          handleFrameTasks={this.handleFrameTasks}
          hideIframe={this.hideIframe}
        />
      )}
      </>
    )
  }
}
