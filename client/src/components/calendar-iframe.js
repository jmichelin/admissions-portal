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
    const QUERY_STRING = `FNAME=${this.props.user.first_name}&LNAME=${this.props.user.last_name}&EMAIL=${this.props.user.email}&CONTACT-ID=${this.props.user.salesforce_id}&OP-ID=${this.props.opp.id}&CAMPUS=${this.props.opp.campus}&COURSE-START=${this.props.opp.courseStart}&COURSE-TYPE=${this.props.opp.courseType}&PRODUCT-CODE=${this.props.opp.productCode}`

      return (
        <div className="grouping">
          <iframe title="ycbm-iframe"
            ref={(f) => this.iframe = f}
            src={`${this.props.calendarUrl}/?noframe=true&skipHeaderFooter=true&${QUERY_STRING}`} onLoad={() => this.props.hideSpinner(this.iframe)} id={this.props.calendarId}
            frameBorder="0"
            allowtransparency="true">
          </iframe>
        </div>
        )
  }
}

export default CalendarIframe;
