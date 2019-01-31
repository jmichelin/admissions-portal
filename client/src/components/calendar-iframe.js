import React, { Component } from 'react';


class CalendarIframe extends Component {
  constructor(props){
    super(props);
    this.iframe = React.createRef();


    this.state = {
    };

  }

 //  componentDidMount(){
 //   this.iframe.onload = () => {
 //     this.iframe.contentWindow.postMessage('hello', "*");
 //     window.addEventListener("message", this.handleFrameTasks);
 //   }
 // }

 componentWillUnmount() {
    window.removeEventListener("message", this.props.handleFrameTasks);
 }

 // handleFrameTasks = (e) => {
 //     document.getElementById(this.props.calendarId).style.height = `${e.data}px`
 //     if (!isNaN(e.data)) {
 //       this.setState({
 //         height:e.data
 //       })
 //     }
 //    }

  render() {
      return (
        <div>
          <iframe ref={(f) => this.iframe = f} src={`${this.props.calendarUrl}/?noframe=true&skipHeaderFooter=true`} onLoad={() => this.props.hideSpinner(this.iframe)} id={this.props.calendarId} frameBorder="0" allowtransparency="true"></iframe>
        </div>
        )
  }
}

export default CalendarIframe;
