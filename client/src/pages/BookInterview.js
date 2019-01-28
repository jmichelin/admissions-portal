import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';

class BookInterview extends Component {
  constructor(props){
    super(props);

    this.state = {

    };

  }

  componentWillMount() {
    if (!this.props.fetchedData) this.props.getData();
  }





  render() {
      const iFrame = `<iframe src="https://nyc-interviews.youcanbook.me/?noframe=true&skipHeaderFooter=true" id="ycbmiframenyc-interviews" style="width:100%;height:1000px;border:0px;background-color:transparent;" frameborder="0" allowtransparency="true"></iframe><script>window.addEventListener && window.addEventListener("message", function(event){if (event.origin === "https://nyc-interviews.youcanbook.me"){document.getElementById("ycbmiframenyc-interviews").style.height = event.data + "px";}}, false);</script>`
      return (
      <div className="book-interview">
        <div className="container">
            <h4 className="page-title">Book Your Technical Interview</h4>
            <Link to="/dashboard"><button className="-inline">Back to Dashboard</button></Link>
            <div className="portal-inner">
              <div dangerouslySetInnerHTML={{__html: iFrame }} />
            </div>
        </div>
      </div>
    );
  }
}

export default BookInterview;
