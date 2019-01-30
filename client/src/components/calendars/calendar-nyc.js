import React, { Component } from 'react';


class CalendarNYC extends Component {
  constructor(props){
    super(props);
    this.iframe = React.createRef();


    this.state = {
    };

  }

  componentDidMount(){
   this.iframe.onload = () => {
     this.iframe.contentWindow.postMessage('hello', "*");
     window.addEventListener("message", this.handleFrameTasks);
   }
 }

 handleFrameTasks = (e) => {
   document.getElementById("ycbmiframenyc-interviews").style.height = `${e.data + 'px'}`
    }

  render() {
      return (
        <div>
          <iframe ref={(f) => this.iframe = f} src="https://remote-interviews.youcanbook.me/?noframe=true&skipHeaderFooter=true" onLoad={() => this.props.hideSpinner(this.iframe)} id="ycbmiframenyc-interviews" frameBorder="0" allowtransparency="true"></iframe>
        </div>
        )
  }
}

export default CalendarNYC;
