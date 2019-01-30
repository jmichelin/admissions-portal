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
     console.log(this.iframe);

     console.log(this.iframe.document);
     this.iframe.contentWindow.postMessage('hello', "*");
     window.addEventListener("message", this.handleFrameTasks);
   }
 }

 handleFrameTasks = (e) => {
    console.log('data', e);
    }

  render() {
    const script = `<script>window.addEventListener && window.addEventListener("message", function(event){if (event.origin === "https://nyc-interviews.youcanbook.me"){document.getElementById("ycbmiframenyc-interviews").style.height = event.data + "px";}}, false);</script>`

      return (
        <div>
          <iframe ref={(f) => this.iframe = f} src="https://remote-interviews.youcanbook.me/?noframe=true&skipHeaderFooter=true" onLoad={() => this.props.hideSpinner(this.iframe)} id="ycbmiframenyc-interviews" frameBorder="0" allowtransparency="true"></iframe>
          <div dangerouslySetInnerHTML={{__html: script }} />
        </div>
        )
  }
}

export default CalendarNYC;
