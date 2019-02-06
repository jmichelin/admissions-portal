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
          <iframe ref={(f) => this.iframe = f} src={`${this.props.calendarUrl}/?noframe=true&skipHeaderFooter=true`} onLoad={() => this.props.hideSpinner(this.iframe)} id={this.props.calendarId} frameBorder="0" allowtransparency="true"></iframe>
        </div>
        )
  }
}

export default CalendarIframe;
