import React, { Component } from 'react';


class CalendarIframe extends Component {
  constructor(props){
    super(props);
    this.iframe = React.createRef();
  }


 componentWillUnmount() {
    window.removeEventListener("message", this.props.handleFrameTasks);
 }

  render() {
      return (
        <div className="grouping">
          <iframe title="ycbm-iframe" ref={(f) => this.iframe = f} src={`https://test-interviews.youcanbook.me/?noframe=true&skipHeaderFooter=true&OP-ID=${this.props.opp.id}&FNAME=${this.props.user.first_name}&LNAME=${this.props.user.last_name}&EMAIL=${this.props.user.email}`} onLoad={() => this.props.hideSpinner(this.iframe)} id={this.props.calendarId} frameBorder="0" allowtransparency="true"></iframe>
        </div>
        )
  }
}

export default CalendarIframe;
