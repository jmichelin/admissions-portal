import React from 'react';

export default (props) => {

  let list;

  if (props.showTI) {
    list =
        <ul>
          <li>The interview will be <span>60 minutes long</span> conducted online.</li>
          <li>To ensure you can complete the assessment in time for your desired cohort, you should book your assessment and start preparing immediately, as assessment slots fill up quickly.</li>
          <li>A maximum of three attempts are permitted network-wide.</li>
          <li>If you do not pass the assessment, you will not be permitted another attempt until you have waited at least two weeks.</li>
        </ul>

  } else if (props.showTAA) {
    list =
        <ul>
          <li>The interview will be <span>75 minutes long</span> conducted online.</li>
          <li>To ensure you can complete the assessment in time for your desired cohort, you should book your assessment and start preparing immediately, as assessment slots fill up quickly.</li>
          <li>A maximum of three attempts are permitted network-wide.</li>
          <li>If you do not pass the assessment, you will not be permitted another attempt until you have waited at least two weeks.</li>
        </ul>
  } else {
    list =
        <ul>
          <li>The interview will be <span>60 to 75 minutes long</span> conducted online.</li>
          <li>To ensure you can complete the assessment in time for your desired cohort, you should book your assessment and start preparing immediately, as assessment slots fill up quickly.</li>
          <li>A maximum of three attempts are permitted network-wide.</li>
          <li>If you do not pass the assessment, you will not be permitted another attempt until you have waited at least two weeks.</li>
        </ul>
  }

  return (
    <div className="sidebar">
      <h4 className="column-headline">Things to Know</h4>
      { list }
      <div className="card-help">
        <h4>Have Questions?</h4>
        <p>We have the answers to help you prepare for the Technical Admissions Assessment (TAA).</p>
        <a className="button-secondary" href="https://www.galvanize.com/web-development/interview" rel="noopener noreferrer" target="_blank">About the TAA</a>
        <h5>Contact</h5>
        <a href="mailto:admissions@galvanize.com">admissions@galvanize.com</a>
      </div>
    </div>
  )
}
