import React from 'react';

export default (props) => {

  return (
    <div className="sidebar">
    <h4 className="column-headline">Things to Know</h4>
    <ul>
      <li>The interview will be <span>60 minutes long.</span></li>
      <li>To ensure you can interview in time for your desired cohort, you should book an interview and start preparing immediately, as interview sports fill up quickly.  If a location's calendar is full, try booking on one of the other ones (acceptance applies network wide).</li>
      <li>A max of 3 interview attempts is permitted network-wide.</li>
    </ul>

    <div className="card-help">
      <h4>Got Questions?</h4>
      <p>We have the answers to help you prepare for the technical interview.</p>
      <a className="button-secondary" href="https://www.galvanize.com/web-development/interview" rel="noopener noreferrer" target="_blank">About the Tech Interview</a>
      <h5>Contact</h5>
      <a href="mailto:admissions@galvanize.com">admissions@galvanize.com</a>
    </div>
    </div>
  )
}
